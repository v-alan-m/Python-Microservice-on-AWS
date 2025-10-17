import io
import json
from typing import Dict

import boto3
import logging
import multipart as python_multipart
import base64
import jwt

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def extract_boundary(headers):
    content_type = headers.get('content-type', '')
    boundary_start = content_type.find('boundary=')
    if boundary_start != -1:
        boundary_end = content_type.find(';', boundary_start)
        if boundary_end == -1:
            boundary_end = len(content_type)
        boundary = content_type[boundary_start + len('boundary='):boundary_end].strip()

        # Check if the boundary is enclosed in quotes and remove them if present
        if boundary.startswith('"') and boundary.endswith('"'):
            boundary = boundary[1:-1]

        return boundary

    return None


def parse_form(headers, body, boundary):
    fields, files = {}, {}

    def on_field(field):
        key = field.field_name.decode()
        value = field.value.decode()
        fields[key] = value

    def on_file(file):
        key = file.field_name.decode()
        files[key] = file

    headers['Content-Type'] = headers['content-type']

    content_type = headers.get('content-type')
    if content_type is None:
        logging.getLogger(__name__).warning("Your header misses Content-Type")
        raise ValueError("Your header misses Content-Type")

    # Extract the multipart/form-data part and remove whitespace
    content_type_part = content_type.split(';')[0].strip()
    boundary_part = content_type.split(';')[1].strip()

    # Update the headers with the modified Content-Type value
    new_headers: Dict[str, any] = {'Content-Type': content_type_part + ';' + boundary_part}

    python_multipart.parse_form(headers=new_headers, input_stream=body, on_field=on_field, on_file=on_file)
    return fields, files


def handler(event, context):
    # CORS headers as we're not going to mock the API, so out API should return the CORS headers
    headers = {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*'
    }

    request_headers = event['headers']
    body = event["body"]

    is_base64_encoded = bool(event["isBase64Encoded"])
    if is_base64_encoded:
        body = base64.b64decode('body')
    else:
        body = body.encode('utf-8')

    # Parse the required data.
    boundary = extract_boundary(request_headers)
    fields, files = parse_form(request_headers, io.BytesIO(body), boundary)

    hotel_name = fields.get("hotelName")
    hotel_rating = fields.get("hotelRating")
    hotel_city = fields.get("hotelCity")
    hotel_price = fields.get("hotelPrice")
    file_name = fields.get("photo")
    user_id = fields.get("userId")
    id_token = fields.get("idToken")

    # image
    file = files.get("photo")
    file_name = file.file_name.decode()
    file_content = file.file_object.read()

    # After .read(), the pointer is at the end; subsequent reads would return b"" (nothing).
    # Rewinding lets you reread the same stream (E.g: pass it to another function, upload to S3, hash it, etc.).
    file.file_object.seek(0)

    token = jwt.decode(id_token, verify=False)
    # A decoded jwt token will have claims, E.g: Name,address, group memberships
    # If a user is a member of more than one group this value is comma separated.
    group = token.get("cognito:groups")

    # Some user who are only browsing the website may be part of no groups.
    if group is None or group != "Admin":
        return {
                "statusCode": 401,
                "body": json.dumps({
                    "Error": "You are not a member of the Admin group.",
                })
            }


    logger.info('Some information will be presented.')
    # TODO implement
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(event['key1'])
    }
