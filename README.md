# Python Microservice on AWS

## AWS services: Incognito:
  - **API Gateway**
  - **Lambda**
  - **ECS**
  - **DynamoDB**
  - **S3**
  - **SNS**
  - **CloudMap**
  - **Secrets Manager**
  - **AWS Cognito**6

## Architectural patterns for microservices: 
  - **API Gateway**
  - **Event Bus**
  - **Circuit Breaker**
  - **CQRS**

# Hotel Booking Project
## Overview
![Dashboard](hotel/images/Overview.png)
## Flowchart
![Dashboard](hotel/images/Flowchart.png)

# Run the HTML code 
- Run on port 8080, not Pycharm Jetbrain's localhost: 63342
  - Start the server:
    - ```bash
      python -m http.server 8080
      ```
  - Log in through the admin page:
    - ```bash
      python -m webbrowser -t "http://localhost:8080\hotel\admin.html"
      ``` 
  - Navigate to a specific webpage:
    - ```bash
      python -m webbrowser -t "http://localhost:8080/hotel/addHotel.html"
      ```

# AWS Setup
## Create AWS account
- Go to aws.amazon.com/free → start sign-up
  - Sign in using root user email” (not IAM)
  - Once in, you’ll create an IAM user for day-to-day use
## Set up a local IAM profile
  - This will set up a profile on your local machine, that your projects will use through boto3
   1. Search for **IAM**
   2. In **IAM** search for **Users** -> **Create User**
   3. Untick the checkbox for 'Provide user access to the AWS console:
      1. We require a local IAM profile with access keys (for CLI + Python SDK) so we don’t need AWS console access.
   4. Choose **I want to create an IAM user**
   5. Attach a **policy** -> **AdministratorAccess**
   6. Export the **Access key** + **Secret key** as a **.csv**
      1. In the **Security credentials tab** > Scroll to the **Access keys** section > Click **Create access key**
         1. Use case → **Select Command Line Interface (CLI)**
            1. This is the correct option for AWS CLI + SDKs like boto3
## Configure a named CLI profile in Powershell or CMD for your machine, not within a virtual environment
  - `aws configure --profile course-admin`
    - After running the command, enter:
      - **AWS Access Key ID:** _**(from the .csv)**_
      - **AWS Secret Access Key:** _**(from the .csv)**_
      - **Default region name:** _**eu-west-2**_
      - **Default output format:** _**json**_
    - This writes two files for your Windows user:
      - %UserProfile%\.aws\credentials
      - %UserProfile%\.aws\config
    - Test the user credentials have been created correctly:
      - `aws sts get-caller-identity --profile course-admin`
      - If it returns your UserId, Account, and Arn, then your local IAM profile is working.
        - From there your Python project (with boto3) can use it.
## Verify AWS CLI on Windows
 - `aws --version`
   - You should see something like `aws-cli/2.x.x`
 
# User Identity and Access Management: AWS Cognito
## Typical microservice architecture including (Identity Provider) IDP
![Dashboard](hotel/images/Typical microservice architecture.png)
- **AWS Cognito:** 
  - Provides user identity and user authentication through email or federated access.
    - Federated access means the credentials are created outside of AWS Cognito.
  - Users can have attributes (E.g Name, address, phone number) and/or groups association
    - Groups can act as roles for a users, for role based authorisation.
  - Users are created manually my an admin or through a sign-up page.
  - Provides a built-in (hosted) sign-up and login page for web application, saving time.
  - Logins are based on the Open Authentication 2 protocol (OAuth 2.0).

## Setting up AWS Cognito for Hotel Booking System
- login:
  - signin.aws.amazon.com
  - Sign into console 
  - Sign in using root user
  - Search for **Cognito**
- Click hamburger menu (3 lines)
  - user pools 
  - Create **User pool**
    - Application Type: 
      - Traditional web application
    - Name your application: 
      - Python-Microservice-on-AWS
    - Configure options: 
      - E-mail
    - Required attributes for sign-up (OAuth2 Attributes): 
      - e-mail
      - given_name
      - family_name
      - address
    - Add a return URL
      - http://localhost:8080/hotel
    - Click on:
      - Create user directory
    - Click on:
      - Go to overview
- Rename
  - user pool name:
    - hotel-booking-users
- Users pools can have multiple apps:
  - Applications
    - Client Apps
    - Click on created app: python-microservies-on-aws
      - The application configuration
        - Note: client ID (aws_test_1_accessKeys.csv)
        - client secret: Not needed as we are using the AWS hosted site
        - Login Pages
          - Edit:
            - OAuth 2.0 grant types
              - Deselect: Authorization code grant
              - Select: Implicit grant (to use the AWS hosted UI)
              - OpenID connect scopes
                - OpenID: Keep to be given an ID token
                - Remove: Phone
                - Add: Profile
                  - To access user information
              - Click on Save changes
  - Domain
    - Note: Cognito domain (aws_test_1_accessKeys.csv)
    - If using our own site:
      - Actions -> Create custom domain
   User Mangement
    - Users
      - Create user
        - Email address:
          - Eg. admin@mydomain.com
            - Mark email as verified
        - Password:
          - Eg. Thefastway777!
        - Click on Create user
    - Groups
      - Create group
        - Group name:
          - Admin
            - Crate the hotels and upload the images
        - Click on Create group
      - Create group
        - Group name:
          - HotelManager
            - View the bookings and accept the bookings
        - Click on Create group
      - Select the group name
        - Admin
          - Add user to group
            - Select user
            - Add
        - Hotel Manager

## Sign in with AWS Cognito
- Use JS for connecting to Cognito to speed up development and have greater user interactions and security.
  - Insert into coginito.jw:
    - **User pool ID** into **identityPoolId**
    - Domain -> **Custom domain** into **cognitoDomain** (remove https://)
    - Application -> python-microservices-on-aws -> **ClientID** into **appId**

## Adding a Page for Creating Hotels
- addHotel.html: A page where a hotel administrator can create new hotels, into the system.
    - Name
    - Star rating
    - City
    - Picture
    - Price per night
    
# API Gateway
## API Gateway Pattern
  - Stops the consumer of a Microservice from directly accessing it.
  - Simplifies the system's interface by combining multiple APIs to one:
    - Instead of being dependent on multiple APIs it's only depandent on one API exposed by the gateway.
  - Can perform authentication and authorisation
    - Code doesn't have to be duplicated in every microservice.
  - Simplifies monitoring.
    - Code doesn't have to be duplicated in every microservice.
  - Simplifies catalogue and documentation.
    - As APIs are not scattered amongst the network and infrastructure, they are in all in the API gateway.

## Creating a Mock API and AWS API Gateway
```HTML
    <!-- replace the 'action' attribute in the form below to the API's URL -->
    <div class="container">
        <form id="upload-form" enctype="multipart/form-data"
         method="post" action="<api url here>">
```
- Search and click on -> **API Gateway**
  - Create API
  - REST API
    - Build
      - New API
      - API name: NewHotel
      - Description: Add description of API
      - Endpoint Type: Leave as Regional -> Edge optimisation to be done later.
      - Create API
- Resources: All the API definitions will be here.
- Stages: To create the actual APIs, the resources must be deployed in stages.
- Create method
  - Method type: POST
  - Integration type: Mock (when you don't have the microservice build yet, but you can test the API).
  - Create method
    - Can click on the test menu and click Test and look for a status code of 200.
  - Deploy API
    - Deployment stage: E.g **New stage** or could be **Test** or **Production**
    - Stage name: Test
    - Deploy
  - To use the API: Invoke URL value
    - Paste this URL into action within the respective HTML section (E.g. **action** value) 
  - When entering details for a new hotel with an image, we get a 500 response
    - To fix this we go to:
    - Resources
    - Post
    - Top Integration request
      - Edit
      - Mapping templates
        - In our HTML (addHotel.HTML) we have:
        - `enctype="multipart/form-data"`
        - Add into mapping templates values: **multipart/form-data**
        - Template body: `{"statusCode": 200}`
        - Save
    - Deploy API again, as not deploying will not update the changes
      - Deploy

## Authenticating API Requests
- Currently, the API is available to the public.
  - This Admin API should only been available to authorised admin users.
- Authorizers
  - Create an authorizer
  - Name: **NewHotelAuth**
  - Type: Cognito (we can use the Cognito identity pool to authenticate users).
    - We can authorise users later using a Lambda function.
  - Cognito user pool: Select from available pools -> hotel-booking-users
  - Token source: Authorization
  - Create authorizer
  - Click on new authorizer name: NewHotelAuth
    - Token value -> Enter random string
    - Click -> Test authorizer
    - Authorizer test: NewHotelAuth 401
    - We need to build an authorizer using a Lambda function:
      - Resources -> Find method -> Post
        - Click on -> First **Method request**
        - Click **Edit** -> Change to **NewHotelAuth**
        - Authorization value: Empty (Default)
        - Save -> **Deploy API** -> Stage: **Test** -> **Deploy**
        - Will return a **401** status code as HTTP header does not have an authorization token:
          - ```HTML
            <div class="container">
            <form id="upload-form" enctype="multipart/form-data" method="post" action="https://q1qlp35y7j.execute-api.eu-west-2.amazonaws.com/Test">
            ````
          - We need to add a header, in an AJAX manner:
            - In a larger project the AJAX logic should account for this.
              - In this project this function: setAuthHeader() will handle this
              - In addHotel.html if this function is called before the page is loaded it will achieve the same goal.
                - Seeing as it adds the bearer token the header.
                - ```HTML 
                  setAuthHeader();
                  $("#userId").val(currentUserToken.currentUserId);
                  $("#idToken").val(currentUserToken.idToken);
                  ```
        - Click on -> First **Method request**
        - Click **Edit** -> Change to **NewHotelAuth**
        - Within the browser -> click on **Console** -> **idToken** value
        - Default: Authorization value: **idToken**
        - Save -> **Deploy API** -> Stage: **Test** -> **Deploy**
        - Will return a **200** status code as HTTP header has an authorization token.
    
## Adding CORS (Cross-origin Resource Sharing) header to APIs
- Certain headers must be presented within the response.
  - Those headers indicate whether the domain is trustworthy.
    - This policy is there to protect our API from being invoked from a domain we don't trust
      - The header value we must include is: Access-Control-Allow-Origin
  - To do this go to **Resources**:
    - API (post)
    - Click on -> **Enable-CORS**
    - Access-Control-Allow-Origin: Is * here. but usually we don't include all using * we specify our target fields for increased security.
    - Click on -> Save
      - This will create an OPTIONS API, which is called by the browser to check if the CORS headers are presented.
      - Options -> Integrations request -> Edit
        - Mapping templates: 
          ```json
          {"statusCode": 200,
           "headers": {
                "ACCESS-CONTROL-ALLOW-Headers": "*",
                "ACCESS-CONTROL-ALLOW-Origin": "*",
                "ACCESS-CONTROL-ALLOW-Methods": "OPTIONS,POST"
                }}
          ```
          - Click on -> Save
          - Click on -> Deploy API
            - Stage: Test
            - Click on -> Deploy
            - Once deployed, OPTIONS shows up in stages
- Go to: http://localhost:8080/hotel/addHotel.html
  - Using: 
    1. python -m http.server 8080
    2. python -m webbrowser -t "http://localhost:8080/hotel/addHotel.html"
  - Create a new entry and now the request will return **status code** of **200**.

# Building Serverless Microservices
- Parses the information from the submitted form
- Add it to a database


## Microservice Chassis: Serverless and Containerisation


- One approach is to use duplicated templates for multiple microservices, E.g: _Order service_, _consumer service_, _xyz service_
- Some **build logic** and **cross-cutting concerns** will be duplicated which is not efficient
- **Cross-cutting concerns**: _Security_,  _External configurations_, _Logging and monitoring_, _Health check_, _Tracing_
<br>
<br>
- We want to take out these cross-cutting concerns and leave them to another entity: this entity is called the **microservice chassis**
    - _A framework that can be used as a foundation, for developing microservices_
<br>
<br>
- We create a **service chassis** > **service template** > **xyz service**
  - A service template can be used for a set of all the required services 
  - The specifics are included when creating each individual microservice
<br>
<br>
>- Service chassis
>  - Build logic
>  - Cross-cutting concerns
```
                    ⬇
```               
>- Service template
>  - Template build logic
>  - Template cross-cutting concerns
>  - Sample Application logic
```
                    ⬇
```
>- Xyz Service
>  - Template build logic _(minimal duplication)_
>  - Template cross-cutting concerns _(minimal duplication)_
>  - Service-specific build logic
>  - Service-specific cross-cutting logic
>  - Application logic

### Serverless
- Specific to cloud environments
- The cloud provide (AWS) also provides the chassis (template, cross-cutting concerns, etc.)
- Scaling out is based on usage: Done and controlled by AWS.
- Fully integrated with other AWS services: IAM, Cloudwatch, etc.
- We do not have access to the execution environment.
- Development languages/frameworks are limited: Based on AWS compatibility.
<br>
<br>
- AWS framework (chassis and template) for creating serverless microservices: **AWS Lambda**

### Containerized
- The application and its operating system are packaged into one image.
  - E.g: **Docker image**.
- Must be deployed to a container orchestration platform.
  - E.g: **Kubernetes**
- We have access to execution environment
  - E.g: **SSH**
- No limitation for development.
  - E.g: **Languages or technologies**
- Can support complex deployment scenarios effectively
  - E.g: **Blue/Green deployment**
<br>
<br>
- AWS platform (chassis and template) for creating container-based microservices: **Elastic Container Service (ECS)**
  - AWS supports Kubernetes (as a managed service)

## Creating and Deploying as AWS Lambda Microservice

- Lambda functions in AWS:
> VPC (**default**: _access internet and other AWS services_)
> 
> - IAM Execution Role ▶ Permissions 
>> Execution environment: 
>>   - AWS Lambda ▶ Environment Variables (E.g. access to S3)
- 2-way relationship: **IAM Execution Role** 🔁 **AWS Lambda**

### Create a Lambda Function in AWS
- Lambda -> Create function
  - Function name: AddHotel
  - Runtime: Python (latest version)
  - Execution role: Create a new role with Basic Lambda permissions
  - Click **Create function**

- Two ways to enter the function:
  - Create the function locally in IDE then zip it then use the **Upload from** button.
    - Usually better as tests are run before uploading the function to AWS.
  - Create it directly in the AWS Lambda function console.
    - In this example we will enter it manually into the console, as it's a simple function.

- AWS has not created a SDK for python, so we will use BOTO3
  - Every **AWS Lambda function** requires a **handler**, we will rename it to: **lambda**
  - Update the value in Runtime settings -> Edit -> Handler renamed to: **lambda_function.handler**
```python
import json
import boto3

def handler(event, context):
    # CORS headers as we're not going to mock the API, so out API should return the CORS headers
    headers = {
      'Access-Control-Allow-Headers':'*',
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods':'*'
    }
    # TODO implement
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps('Hello from Lambda!')
    }
```
- Click **Deploy** -> We will see a green banner at the top of the page: Successfully updated the function **AddHotel**.
- Click **Test** -> Create new test event -> **Event name**: Test -> Save
  - Click on **Test** -> The output should have: **"statusCode": 200**
  - In the test there will be a JSON -> {"key1": "value1", "key2": "value2", "key3": "value3"}
  - To use the values from this JSON use **event**:
```python
import json
import boto3

def handler(event, context):
    # CORS headers as we're not going to mock the API, so out API should return the CORS headers
    headers = {
      'Access-Control-Allow-Headers':'*',
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods':'*'
    }
    # TODO implement
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(event['key1'])
    }
```
- Click **Deploy**
- Click **Test** -> The output should have: **"body": "\"value1\""**
- Setting logging logic -> The output should have: **[INFO] ... Some information will be presented.**:
```python
import json
import boto3
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    # CORS headers as we're not going to mock the API, so out API should return the CORS headers
    headers = {
      'Access-Control-Allow-Headers':'*',
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods':'*'
    }
    logger.info('Some information will be presented.')
    # TODO implement
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(event['key1'])
    }
```

## Capturing the Request Body in AWS Lambda as an API Backend

- We would like to see, in AWS, the data we send using this form tag and parse it:
```HTML
addHotel.html
<form id="upload-form" enctype="multipart/form-data"
```
- The **enctype** here is **"multipart/form-data"**, but it can also be **JSON**.
- For the data sent by the form to AWS the values in the HTML tag **name** are used:
  - hotelName 
  - hotelRating
  - hotelCity
  - hotelPrice
  - photo
  - userId
  - idToken
<br>
<br>
- **import multipart as python_multipart**
  - As the form type sent is: **multipart/form-date**
- **import base64**
  - As the photo maybe encoded to base64 by AWS (check for a form field in the multipart-form)
<br>
<br>
- The form data sent to AWS are caught by the **event** variable, the data will be in under the key: **body**:
```python
  request_headers = event['headers']
  body = event["body"]
```
- The binary photo uploaded is encoded to base64 by AWS, have a check for that
```python
  is_base64_encoded = bool(event["isBase64Encoded"])
  if is_base64_encoded:
      body = base64.b64decode('body')
  else:
      body = body.encode('utf-8')
```
- To parse the multipart form as function will have to be made: **parse_form()**.
```python
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
```

## Performing Authorisation in a Backend-Lambda

- Before storing the extracted information into a database and file storage.
- Make sure the user that invokes the backend Lambda has the **access rights** and **privileges** to create a hotel.
- As customers should not have this ability.
- To achieve this we use a **JSON Web Token (JWT)**
  - **import jwt**

```python
token = jwt.decode(id_token, verify=False)
```
- A decoded jwt token will have claims, E.g: Name,address, group memberships
- If a user is a member of more than one group this value is comma separated.
```python
group = token.get("cognito:groups")
```
- Some user who are only browsing the website may be part of no groups.
```python
if group is None or group != "Admin":
    return {
            "statusCode": 401,
            "body": json.dumps({
                "Error": "You are not a member of the Admin group.",
            })
        }
```
## Storing Data and Files in AWS

### Databases in AWS:
  - Relational databases:
    - **RDS** (Offers managed services for MySQL, etc.)
  - NO-SQL databases:
    - **AWS Dynamo DB** (Data is stored as a JSON.)
<br>
<br>
> One RDS for the entire system is OK.
>> - However, each microservice must have its own database.
   >>   - Microservices can not share a database.
   >>     - No cross-database queries or access.

### File Storage
- Storing files: **S3** (Simple Storage Service)
- Fast read/write for short term storage: **EFS** (Elastic File Storage)

### Storing data with API Gateway and Lambda
> **User**  
⬇  
> **Accesses hotel app**  
⬇  
> **Post a hotel by pushing it through an API, using API Gateway**  
⬇  
> **API Gateway forwards the request to AWS Lambda**  
⬇  
> **API Lambda uploads the image to S3**  
⬇  
> **API Lambda stores the text information to DynamoDB**  

- By **default**, AWS Lambda:
  - **Does not** have access to **S3** or **DynamoDB**.
  - It **does** have access to **CloudWatch** and **execution details**.
  > To **grant access** to **AWS Lambda** use: **IAM** Execution role (Identity and Access Management.)
  > - Create an **execution role** in **IAM** to **give permissions**:
  > - **Create** a **role** with **access** to **S3** and **DynamoDB**.



## Creating an Execution IAM Role for Lambda


## Create and Configure S3 Buckets


## Uploading Files and Images to AWS S3


## Creating and Configuring a DynamoDB Table


## Storing Information in DynamoDB


## Deploying AWS Lambda with Python Dependencies


## Connecting API Gateway to Lambda using a Proxy Resource


## Testing Proxy API with Lambda


## Creating a RESTful GET API in API Gateway with a Lambda Microservice


## Practice Creating and Configuring an AWS Lambda Function


## Practice Creating a Proxy REST API in AWS API Gateway


## Review Your Practice Results


## Exploring JSON Web Tokens (JWT) and JSON Web Key Sets (JWKS)


## Lambda Authorizer: Performing Authentication


## Deploying and Using Lambda Authorizer with AWS API Gateway


## The CORS Pattern


## The "Fan Out" and "Idempotent Consumer" Pattern


## Storing the Event Information in Elasticsearch


## Practice: Deploy the Updater Service


## Subscribing a Microservice to Event Bus


# Building Containerised Microservices


## The Search Microservice


## Testing Search API Locally in IDE


## Creating and testing a Docker Microservice


## Pushing a Docker image to Amazon Elastic Container Registry (ECR)


## Deploying a Microservice to AWS ECS with Fargate Launch Type


## Creating a Proxy API for a Containerised Microservice


## Creating an API for a Containerised Microservice with a Private IP


## Search Microservice in Action


## Introduction to the Circuit Breaker Pattern


## Implementing Circuit Breaker Pattern in Search API


## The Event Sourcing Pattern for Ultimate System Resiliency


## Event Sourcing Microservice: Hotel Created Event Handler - Order Domain


## Practice: Deploy Hotel Created Event Handler for Order Domain


## Subscribing the Hotel Created Event Handler Order Domain to SNS Topic


## Booking Microservice - Command


## Deploying a Containerised Microservice with AWS Fargate Service Model


## Creating and Securing an HTTP API and AWS API Gateway


## CORS: Building a Query Microservice with Docker and ECS



# Service Discovery


## The Service Discovery Pattern and AWS Cloud Map


## Deploying a Microservice to AWS ECS and AWS Cloud Map


## Creating an HTTP API in AWS API Gateway and AWS CLoud Map


## View and Confirm Hotel Bookings


## Create a Review and Confirm Bookings Microservice


## Deploying a Docker Microservice to AWS ECS with EC2 Launch Type


## Creating an HTTP API for the ECS Microservice with EC2 Launch Type 


## The Sidecar Pattern


## Booking Review Sidecar Microservice


## Deploy Booking Review Microservice 


## Booking Review - Website Demo


# Logging for Microservices


## Logging Solutions in AWS


## AWS CLoudWatch


## Setting up AWS Cognito Identity Identity Pool for Kibana


## Creating ELK Stack with AWS OpenSearch


## Shipping LOgs from AWS CLoudWatch to ELK (Elasticsearch and Kibana)



# The Saga Pattern



## Events vs. Messages



## Introduction to Saga Pattern - Orchestration vs. Choreography



## Deep Dive into Choreography Pattern



## Deep Dive into Orchestration Pattern



## Orchestration and Choreography Patterns Comparison



# Questions


## What are the alternatives to Monolithic applications?


## What's the anatomy of a microservice-based system?


## Explain the Monolithic, SOA and Microservices Architectures


## Explain Bounded Context


## Explain the Benefits of the Microservice Architecture 


## Explain the Role of Containers in Microservices 


