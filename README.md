ElectroShop

Project Setup and Containerisation

Backend-

Install mongo db & mongodb compass for the database.

Running backend application on local machine

Running frontend application on Local machine

We can see application on port localhost:3000

Docker-

Created Dockerfile for frontend and Backend. Also created docker-compose file for local orchestration.

Dockerfile for frontend is located in frontend/Dockerfile

Dockerfile for backend is located in backend/Dockerfile

Docker-compose file is located in root path

Command-  docker-compose up –build

Docker compose up or docker composer up -d

Open

Validation-

Application successfully running on

Check database—

Week 2— Aws infrastructure and provisioning

Virtual private network setup -

Go to vpc-> create vpc-> click on VPC and More -> tag - electroshop-vpc -> availability zone 2-> public subnet 2-> private subnet 2 (default configuration)

VPC look like

Creating nat gateway—

Name tag: electroshop-nat-gw

Subnet: Select one of your public subnets.

Elastic IP: Click “Allocate Elastic IP”, then “Create a new one” and select it.

Go Back to Route Table and Add NAT Route

Go back to your private route table (e.g., electroshop-rtb-private1-ap-south-1a)

Edit Routes-

For destination 0.0.0.0/0, the NAT Gateway should now appear in the dropdown

Select it and save changes

Repeat for the second private route table

Create IAM Roles and attached policy:

IAM > Roles > Create Role -> AWS Service → Use Case: Elastic Container Service ->

Next-> Role name:  ECS_Task_Execution_Role -> create role

Add permission/ policy ->  AmazonECSTaskExecutionRolePolicy , CloudWatchLogsFullAccess

Create Elastic Container Registry-

Go to Amazon ECR > Create Repository

Create:

electroshop/frontend

electroshop/backend

Set them to Private Repositories

Create ECS Cluster

Go to ECS > Clusters > Create Cluster

Launch type: Fargate

Cluster name: electroshop-cluster

create security group

Go to AWS Console → Search for “EC2” → Open EC2 Dashboard

In the sidebar, go to “Security Groups” under the “Network & Security” section

Click “Create security group”

Security Group 1: electroshop-alb-sg (For Load Balancer)

Security group name: electroshop-alb-sg

Description: Allow inbound HTTP/HTTPS for ALB

VPC: Select your electroshop-vpc

Outbound Rules:  Default is All traffic (Anywhere) — keep as is. Click Create security group

Create a second one:

Security group name: electroshop-ecs-sg

Description: Allow traffic from ALB to ECS tasks

VPC: Same as above (electroshop-vpc)

Week 3 : Manual Deployment to AWS-

aws configure

Push container image

aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.ap-south-1.amazonaws.com

Replace <your-account-id> with your actual AWS account ID.

Tag and Push Docker Images

Before build and push image to ecr just change below line-

Frontend :

npm run build

ls build/index.html

docker build -t electroshop-frontend .

docker tag electroshop-frontend:latest 448704111492.dkr.ecr.ap-south-1.amazonaws.com/electroshop/frontend

docker push 448704111492.dkr.ecr.ap-south-1.amazonaws.com/electroshop/frontend

Backend :

docker build -t electroshop-backend .

docker tag electroshop-backend:latest 448704111492.dkr.ecr.ap-south-1.amazonaws.com/electroshop/backend

docker push 448704111492.dkr.ecr.ap-south-1.amazonaws.com/electroshop/backend

Connection for database:

Login to

Create new project-> your project name -> next -> create project

Create cluster -> select free tier -> clustername-> provider -aws -> create deployment.

Create user -> done ->

Click on cluster -> select details which you have need -> copy url

Create ECS Task Definitions

ECS > Task Definitions > Create new > Fargate

Create new task definition
a) electroshop-backend-task :

AWS Fargate

Container – backend

Image uri--  448704111492.dkr.ecr.ap-south-1.amazonaws.com/electroshop/backend

Port 5000 HTTP

Environment variable –

MONGO_URI

Special characters (like @) must be URL-encoded:

@ → %40

Use log collection –

mongodb+srv://Jyotiraul74:Jyoti%401994@database-cluster.ixtjrot.mongodb.net/electroshop?ssl=true&authSource=admin&retryWrites=true&w=majority

Create Application Load Balancer (ALB)

EC2 > Load Balancers > Create- Application Load Balancer-

Loadbalancer name : electroshop-alb, select internet facing, ipv4, electroshop vpc, Availability Zones and subnets (choose 2) , security group- electroshop-alb-sg, port 80, Default Rule → forward to frontend-target-group

+create target group 1  ip address, frontend-target-group, http 80, electroshop vpc ,

+create target group 2 ip address, backend-target-group, http 5000, electroshop vpc ,

Add the /api/* Rule for Backend Routing-

  View/edit rules” or a section called “Rules”

  Click on “View/edit rules” for Listener: HTTP:80

Deploy ECS Services

Go to: ECS > Clusters > Your Cluster > Create Service

Create two services: one for frontend, one for backend

Service Setup:

Launch Type: Fargate

Task Definition: select respective one

Cluster: your ECS cluster

Service name: e.g., frontend-service

Number of tasks: 1 or 2

Load Balancer: Yes

ALB: select your ALB

Listener: HTTP 80

Target Group: corresponding one (frontend or backend)

Also choose the correct subnets (private) and attach the electroshop-ecs-sg

Note:  for debugging and if application failed, follow below step for deployment.

Go to ECS > Task Definitions (Revision)

Click electroshop-backend-task / electroshop-backend-task

Click Create new revision

Do changes if needed

Save the revision.

Redeploy Backend Service if need-

Go to ECS > Clusters > electroshop-cluster > Services

Click backend-service/ frontend service

Click Update

Choose the new task definition revision

Leave all other settings as-is → Update service

Validate

Phase 2-  CI/CD, monitoring & security

CI/CD Pipeline automation

Added Thank you so much !!! in aboutUsPage.jsx

Changes reflect automatically.

Week 5- Monitoring and logging

Centeralized logging –

Logs appears in CloudWatch under ecs/

Performace Dashboards

Go to  Cloudwatch -> Dashboard -> create Dashboard

Add Ecs metrics –

Click on + -> Widget Configuration -> metrics -> lines-> … > create widget.

Automated alerting –

Go to sns -> create topic (ElectroShopAlerts)

Add your email as subscription and confirm it

Add your email as subscription and confirm it.

Cloudwatch -> alarm -> create alaram ->

For cpu utilization—backend frontend

Week 6. Security hardening and final review

Secure secret handling-

Go to aws console -> secrets manager

Click -store a new secret

Choose – other type of secret

Add key value pair –

Key Mongo_URI and value

Key JWT_secret and value

Name it and store.

Automated Vulnerability scanning-

I have added code for trivy in .github/workflow/deploy.yml file.

Note: you can check report in pipeline also.

Network Protection

Aws console -> WAF & shield

Security is applied. It will gives error. Site is not secured.

So I disassociate aws resource to continue website.

# Detailed Project Enhancements

## Phase 1: Project Setup and Containerisation

In this phase, the application was set up locally and containerized using Docker for portability. MongoDB was installed and used for database storage. Dockerfiles and docker-compose configurations were created for frontend and backend orchestration.

## Phase 2: AWS Infrastructure and Provisioning

AWS services such as VPC, NAT Gateway, IAM, ECR, ECS, and security groups were configured. The infrastructure supported secure and scalable deployment using ECS Fargate and private/public subnets.

## Phase 3: Manual Deployment to AWS

Application containers were pushed to ECR and deployed using ECS Task Definitions and Fargate Services. MongoDB Atlas was used for managed cloud database hosting. ALB was configured for traffic routing and domain-level access.

## Phase 4: CI/CD Automation

GitHub Actions was integrated for automatic build and deployment. Any committed changes were deployed to AWS ECS automatically without manual steps.

## Phase 5: Monitoring and Logging

AWS CloudWatch was configured to collect and visualize application logs and metrics. Dashboards and alarms were created for ECS service monitoring and alerts were sent using SNS.

## Phase 6: Security Hardening

Application secrets such as Mongo_URI and JWT Secret were moved to AWS Secrets Manager. Trivy was added to GitHub workflows for vulnerability scanning. AWS WAF and Shield provided network protection.

## System Architecture Overview

The system uses a microservices architecture with React (frontend), Node.js/Express (backend), and MongoDB Atlas (database). Docker containers are deployed on AWS ECS using Fargate. Application traffic is routed via an ALB. CI/CD and monitoring are handled through GitHub Actions and CloudWatch respectively.

## Challenges Faced

- Configuring VPC routing and NAT Gateway correctly.
- Securing secrets during deployment.
- Debugging ECS task definition and service failures.
- Setting up proper CloudWatch alarms and logs.

## Key Achievements

- Complete CI/CD pipeline integration with security checks.
- Fully containerized and cloud-deployed infrastructure.
- Real-time monitoring and alerting setup.
- Secrets management and hardened cloud deployment.