---
layout: post
title: ECS on AWS via Terraform
summary: Terraform is a light-weight alternative to complex infrastructure management tools that encourages deployment from an authorized host to many providers. In this post I walk through setting up a container registry, host and related infrastructure on Amazon Web Services.
categories: terraform aws ecs docker
TODO: Gists for stages. Testing that the configuration works
---
*15/12/16 - In progress.*

Infrastructure management tools are not new and are on a continuum of complexity. Most sit at the end of high complexity, requiring nodes to facilitate resource coordination and authentication. Under Puppet, Chef and CFEngine nodes treat the networking mesh like a religious document. Almost assuming a side-channel process of architecture diagrams and VM budgeting, these frameworks assume the presence of distributed code and configuration stores, and authentication and autorization nodes. Recently, developers have been flocking to the other end of the spectrum with Ansible and Chef Solo promising to remove the headaches of key signing and set up getting in the way of doing actual work.

Enter [Terraform](http://terraform.io/).
With just environment variables exposed for access to infrastructure providers, the go binary draws a graph (an `execution plan`) of actions required to effect the desired state. It's able to perform simple dependency checks (have you created the VPC that your EC2 is apart of?) but doesn't cover off on all the rules of your target platform (it will not warn that '-'s are not allowed in instance names).

It's free-form text-based format provides no guidance as to the structure of multiple files and I find it's most useful to cat all its configuration together in one file. After running, you should find `.tfstate` and `.tfstate.backup` files with JSON representation of the state of your infrastructure.

# Step 0: Source control
No doubt you'll want to keep all this stuff under SCM. Choose your flavor. I'll be using Git and a folder called `swag_cluster`. Also create a Makefile to avoid entering the same commands again

# Step 1: Environment variables
Before we can run the script, expose the following environment variables in your shell. I find this easiest to accomplish by throwing the following in a file and sourcing it with `source $FILENAME`.

```
export AWS_ACCESS_KEY_ID=$AWS_KEY
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET
export AWS_DEFAULT_REGION=$AWS_REGION
```

You'll also need to create an AWS keypair associated with your `$AWS_KEY`. Mine's called `gangsters_paradise.kp`.

At this point you can save yourself some typing by entering the following into your makefile

```
plan:
  terraform plan -var admin_cidr_ingress='"14.203.105.56/32"' -var key_name=gangsters_paradise
apply:
  terraform apply -var admin_cidr_ingress='"203.87.26.38/32"' -var key_name=gangsters_paradise
destroy:
  terraform destroy
.PHONY: plan apply destroy
```

And your project should look like this:

```
/Users/htmldrum/Desktop/swag_cluster:
  total used in directory 8 available 23254575
  drwxr-xr-x   5 htmldrum  staff  170 25 Nov 22:10 .
  drwxr-xr-x   6 htmldrum  staff  204 25 Nov 22:08 ..
  drwxr-xr-x  10 htmldrum  staff  340 25 Nov 22:10 .git
  -rw-r--r--   1 htmldrum  staff  226 25 Nov 22:08 Makefile
  -rw-r--r--   1 htmldrum  staff    0 25 Nov 22:10 gangsters_paradise.kp
```

# Step 2: The Cluster, Registry and virtual networking layer

- ECR
- RDS
- Subnet
- VPC
  - Gateway
  - Route table
    - Route table associations from route table to subnet
  - Security group
    - lb
    - containers
    - rds
- Subnet
- IAM
  - ecs service
  - instance profile
  - role
    - role policy
- Auto-scaling group
- ECS cluster
  - AMI
    - launch configuration
  - Task definition
  - ECS services
- ALB
  - target group
  - alb listener
- Cloudwatch
  - app
  - cluster

# Step 3: Uploading your Docker images

# Step 4: Boot your containers

# Step 5:
