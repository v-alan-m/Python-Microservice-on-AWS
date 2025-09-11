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
![Dashboard](images/Overview.png)
## Flowchart
![Dashboard](images/Flowchart.png)

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
![Dashboard](images/Typical%20microservice%20architecture.png)
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


## Adding a Page for Creating Hotels



# API Gateway

# Serverless Microservices

# Containerised Microservices

# Service Discovery

# Logging for Microservices

# The Saga Pattern

# Questions

