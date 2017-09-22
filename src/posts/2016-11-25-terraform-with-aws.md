---
title: Lambda on AWS via Terraform
summary: Terraform is a light-weight alternative to complex infrastructure management tools that encourages deployment from an authorized host to many providers. In this post I walk through setting up lambda function to interact with your existing infrastructure  and related infrastructure on Amazon Web Services.
categories: terraform aws lambda cloudwatch sns
---
Infrastructure management tools are not new and are on a continuum of complexity. Most sit at the end of high complexity, requiring nodes to facilitate resource coordination and authentication. Under Puppet, Chef and CFEngine nodes treat the networking mesh like a religious document. Almost assuming a side-channel process of architecture diagrams and VM budgeting, these frameworks assume the presence of distributed code and configuration stores, and authentication and autorization nodes. Recently, developers have been flocking to the other end of the spectrum with Ansible and Chef Solo promising to remove the headaches of key signing and set up getting in the way of doing actual work.

Enter [Terraform](http://terraform.io/).
With just environment variables exposed for access to infrastructure providers, the go binary draws a graph (an `execution plan`) of actions required to effect the desired state. It's able to perform simple dependency checks (have you created the VPC that your EC2 is apart of?) but doesn't cover off on all the rules of your target platform (it will not warn that '-'s are not allowed in instance names).

It's free-form text-based format provides no guidance as to the structure of multiple files and I find it's most useful to cat all its configuration together in one file. After running, you should find `.tfstate` and `.tfstate.backup` files with JSON representation of the state of your infrastructure.

# Step 0: Installation
If you're running a mac, `brew install terraform` works. Otherwise, Hashicorp puts out pre-built binaries for your platform. Do your hands a favour and alias to `tf` - `alias tf="terraform"`: commands can get verbose very quickly. Lastly, we'll be working with AWS so make sure you've set your environment variables for `AWS_REGION`, `AWS_KEY` and `AWS_SECRET` as these will be used by `tf` to authenticate you with your AWS account.

# Step 1: Workspace management
Earlier versions of Terraform did not provide workspace isolation. If you had 2 projects with different infrastructure requirements you could inadvertently `rm -rf /` your work with careless commands. To get around this, you had to create careful heirarchies of terraform state folders. Needless to say, this made observation, auditing and explanation hard. Terraform now ships with a notion of state isolation known as Workspaces. You can include all your terraform state in the single directory but avoid having the infrastructure resolver update configurations in other workspaces when building the plan.

That said, I still find it's generally easiest to maintain configurations by having project isolation and using workspaces to parameterize different constraints for dev, stage, prod.

```
/com.foo-company
  -projects/
    -dodgems/
        .tfstate
    -funhouse/
        .tfstate
    -zoo/
        .tfstate
```

With that said, let's create our first little project for our ficticious `foo-company`

```bash
$ mkdir -p /com.foo-company/projects/lambda && cd $_
$ terraform workspace new prod

$ find . | grep -i terraform
./.terraform
./.terraform/environment
./terraform.tfstate.d
./terraform.tfstate.d/prod
```

This creates the necessary state files necessary for evolving our state.

# Step 2: Start/Stop scripts
Next, lets add a script that uses [Amazon's Lambda service](https://aws.amazon.com/lambda/) to start and stop some of our pet instances to save ourselves some runway.

It's also time to add a `Makefile` we can give to ops staff to run the required terraform tasks

```bash
#!/bin/bash
## LCInstanceGen.sh

REGION=${REGION:-"ap-southeast-2"}
INSTANCE='HAL-TheBigPHPMachine'
SCRIPT_EXT=-$REGION$INSTANCE
cp StartEC2Instances.py.template StartEC2Instances$SCRIPT_EXT.py
sed -i '' 's/__REGION__/'${REGION}'/g' StartEC2Instances$SCRIPT_EXT.py
sed -i '' 's/__INSTANCE__/'${INSTANCE}'/g' StartEC2Instances$SCRIPT_EXT.py

cp StopEC2Instances.py.template StopEC2Instances$SCRIPT_EXT.py
sed -i '' 's/__REGION__/'${REGION}'/g' StopEC2Instances$SCRIPT_EXT.py
sed -i '' 's/__INSTANCE__/'${INSTANCE}'/g' StopEC2Instances$SCRIPT_EXT.py
```

This script uses GNU tools to create a pair of Python scripts for a given region and instance name based on the following templates.

```python
// StartEC2Instances.py.template
import boto3

region = '__REGION__'
instances = ['__INSTANCE__']

def lambda_handler(event, context):
    ec2 = boto3.client('ec2', region_name=region)
    ec2.start_instances(InstanceIds=instances)
    print 'started your instances: ' + str(instances)

```

```python
// StopEC2Instances.py.template
import boto3

region = '__REGION__'
instances = ['__INSTANCE__']

def lambda_handler(event, context):
    ec2 = boto3.client('ec2', region_name=region)
    ec2.stop_instances(InstanceIds=instances)
    print 'stopped your instances: ' + str(instances)
```

The python scripts just call through to a AWS library in Python - simple stuff! If you were building more sophisticated SDK's, you'd probably want to look at formalizing the infrastructure generation with an implementation in a general-purpose programming languge - like [`Go`](https://golang.org)!

# Step 3: Terraform - Lambda
Now that we've got something we want to run on Lambda, let's using Terraform to create the necessary infrastructure for us. Once the scripts are in place, we'll be able to commit everything to source control so the next time someone wants to update it, we can programatically determine their updates and not just rely on whatever's in the web gui.

```ruby
# main.tf

provider "aws" {
  region = "${var.region}"
  shared_credentials_file = "~/.aws/credentials"
}

variable "region" {
  type = "string"
  default = "ap-southeast-2"
}

resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "StopEC2Instances" {
  filename = "StopEC2Instances.zip"
  function_name = "StopEC2Instances"
  role = "${aws_iam_role.iam_for_lambda.arn}"
  handler = "exports.test"
  source_code_hash = "${base64sha256(file("StopEC2Instances.zip"))}"
  environment {
    variables = {
      foo = "bar"
    }
  }
}

```

Terraform's syntax is very ruby-like - with some differences. We can communicate to AWS the structure of our Lambda function using the ["aws_lambda_function"](https://www.terraform.io/docs/providers/aws/r/lambda_function.html) object.

Terraform also allows us to parameterize runs of the infrastructure planner with variables supplied on the command  line. In this instance, we will need to remember to pass through the variables for region and instance name on running the plan.

Keen observers will note that we could skip the step of using `sed` to parameterize our python template with variables! I CBF doing that right now but it'd be the approach to take.

Next, we'll need to pull down any plug-ins required by Terraform to run our script:
```
$ terraform init

Initializing provider plugins...
- Checking for available provider plugins on https://releases.hashicorp.com...
- Downloading plugin for provider "aws" (0.1.4)...

The following providers do not have any version constraints in configuration,
so the latest version was installed.

To prevent automatic upgrades to new major versions that may contain breaking
changes, it is recommended to add version = "..." constraints to the
corresponding provider blocks in configuration, with the constraint strings
suggested below.

* provider.aws: version = "~> 0.1"

Terraform has been successfully initialized!

You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.

If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.
```

Now that we've sketched out our functions we need to add configuration for calling them. This is done in AWS using the following services

- `CloudWatch`.
   - First you'll create a CloudWatch event rule that will be triggered using a `cron` syntax
- `SNS`
  - You'll need an SNS topic to multiplex the event onto its subscribers
- `Lambda`
  - Finally you'll configure your lambda functions with the appropriate permissions and subscriptions to fire in response to messages passed through the SNS topic

Doing this through the web gui or the AWS command line is troublesome. Remembering what failed and trying again is hard. As is trying to work out how different AWS components interact. Terraform provides a structure that overlays its providers to make implementing common requirements easy. Frequently objects will ask you for the id's of other objects they need to communicate with - prompting you to create them.

# Step 4: Terraform (the other bits)

We'll need to add the following bits to our `main.tf` file

```ruby
# CloudWatch Alarm -> CloudWatch Event Target -> Posts to SNS Topic ->
## Start
resource "aws_cloudwatch_event_rule" "fires_at_8am_each_business_day" {
  name = "fires_at_8am_each_business_day"
  description = "CloudWatch Even that fires at 8am each day"
  schedule_expression = "cron(0 8 * * MON-FRI *)"
}

resource "aws_cloudwatch_event_target" "sns_start_machines" {
  rule      = "${aws_cloudwatch_event_rule.fires_at_8am_each_business_day.name}"
  arn       = "${aws_sns_topic.start_machines.arn}"
}

resource "aws_sns_topic" "start_machines" {
  name = "start_machines"
}

resource "aws_sns_topic_subscription" "sns_start_machines" {
  topic_arn = "${aws_sns_topic.start_machines.arn}"
  protocol = "lambda"
  endpoint = "${aws_lambda_function.StartEC2Instances.arn}"
}

resource "aws_lambda_permission" "sns_start_machines" {
  statement_id = "AllowExecutionFromSNS"
  action = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.StartEC2Instances.arn}"
  principal = "sns.amazonaws.com"
  source_arn = "${aws_sns_topic.start_machines.arn}"
}

## Stop
resource "aws_sns_topic" "stop_machines" {
  name = "stop_machines"
}

resource "aws_cloudwatch_event_rule" "fires_at_8pm_each_business_day" {
  name = "fires_at_8pm_each_business_day"
  description = "CloudWatch Even that fires at 8pm each day"
  schedule_expression = "cron(0 20 * * MON-FRI *)"
}

resource "aws_cloudwatch_event_target" "sns_stop_machines" {
  rule      = "${aws_cloudwatch_event_rule.fires_at_8pm_each_business_day.name}"
  arn       = "${aws_sns_topic.stop_machines.arn}"
}

resource "aws_sns_topic_subscription" "sns_stop_machines" {
  topic_arn = "${aws_sns_topic.stop_machines.arn}"
  protocol = "lambda"
  endpoint = "${aws_lambda_function.StopEC2Instances.arn}"
}

resource "aws_lambda_permission" "sns_stop_machines" {
  statement_id = "AllowExecutionFromSNS"
  action = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.StopEC2Instances.arn}"
  principal = "sns.amazonaws.com"
  source_arn = "${aws_sns_topic.stop_machines.arn}"
}
```

# Step 5: Command line interface

Alrighty, so now we're ready to tell the infrastructure planner to prepare the DAG for our new set of services. Executing `terraform plan` followed by the required variables will show us the changes that will be introduced.

```
$ tf plan -var instance='HAL-TheBigPHPMachine' -var region=ap-southeast-2
Refreshing Terraform state in-memory prior to plan...
The refreshed state will be used to calculate this plan, but will not be
persisted to local or remote state storage.

------------------------------------------------------------------------

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  + aws_cloudwatch_event_rule.fires_at_8am_each_business_day
      id:                              <computed>
      arn:                             <computed>
      description:                     "CloudWatch Even that fires at 8am each day"
      is_enabled:                      "true"
      name:                            "fires_at_8am_each_business_day"
      schedule_expression:             "cron(0 8 * * MON-FRI *)"

  + aws_cloudwatch_event_rule.fires_at_8pm_each_business_day
      id:                              <computed>
      arn:                             <computed>
      description:                     "CloudWatch Even that fires at 8pm each day"
      is_enabled:                      "true"
      name:                            "fires_at_8pm_each_business_day"
      schedule_expression:             "cron(0 20 * * MON-FRI *)"

  + aws_cloudwatch_event_target.sns_start_machines
      id:                              <computed>
      arn:                             "${aws_sns_topic.start_machines.arn}"
      rule:                            "fires_at_8am_each_business_day"
      target_id:                       <computed>

  + aws_cloudwatch_event_target.sns_stop_machines
      id:                              <computed>
      arn:                             "${aws_sns_topic.stop_machines.arn}"
      rule:                            "fires_at_8pm_each_business_day"
      target_id:                       <computed>

  + aws_iam_role.iam_for_lambda
      id:                              <computed>
      arn:                             <computed>
      assume_role_policy:              "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Action\": \"sts:AssumeRole\",\n      \"Principal\": {\n        \"Service\": \"lambda.amazonaws.com\"\n      },\n      \"Effect\": \"Allow\",\n      \"Sid\": \"\"\n    }\n  ]\n}\n"
      create_date:                     <computed>
      force_detach_policies:           "false"
      name:                            "iam_for_lambda"
      path:                            "/"
      unique_id:                       <computed>

  + aws_lambda_function.StartEC2Instances
      id:                              <computed>
      arn:                             <computed>
      environment.#:                   "1"
      environment.0.variables.%:       "1"
      environment.0.variables.foo:     "bar"
      filename:                        "StartEC2Instances-ap-southeast-2HAL-TheBigPHPMachine.zip"
      function_name:                   "StartEC2Instances-ap-southeast-2HAL-TheBigPHPMachine"
      handler:                         "StartEC2Instances-ap-southeast-2HAL-TheBigPHPMachine.lambda_handler"
      invoke_arn:                      <computed>
      last_modified:                   <computed>
      memory_size:                     "128"
      publish:                         "false"
      qualified_arn:                   <computed>
      role:                            "${aws_iam_role.iam_for_lambda.arn}"
      runtime:                         "python2.7"
      source_code_hash:                "RlPZAYLuwiLpuM1/ZvMMG9IRnhtLwq2Qekd00TsEk/I="
      timeout:                         "3"
      tracing_config.#:                <computed>
      version:                         <computed>

  + aws_lambda_function.StopEC2Instances
      id:                              <computed>
      arn:                             <computed>
      environment.#:                   "1"
      environment.0.variables.%:       "1"
      environment.0.variables.foo:     "bar"
      filename:                        "StopEC2Instances-ap-southeast-2HAL-TheBigPHPMachine.zip"
      function_name:                   "StopEC2Instances-ap-southeast-2HAL-TheBigPHPMachine"
      handler:                         "StopEC2Instances-ap-southeast-2HAL-TheBigPHPMachine.lambda_handler"
      invoke_arn:                      <computed>
      last_modified:                   <computed>
      memory_size:                     "128"
      publish:                         "false"
      qualified_arn:                   <computed>
      role:                            "${aws_iam_role.iam_for_lambda.arn}"
      runtime:                         "python2.7"
      source_code_hash:                "lLinGda0Xe0ATQvZK4d5xGZNghPE0v+EFxxNXlsmhZY="
      timeout:                         "3"
      tracing_config.#:                <computed>
      version:                         <computed>

  + aws_lambda_permission.sns_start_machines
      id:                              <computed>
      action:                          "lambda:InvokeFunction"
      function_name:                   "${aws_lambda_function.StartEC2Instances.arn}"
      principal:                       "sns.amazonaws.com"
      source_arn:                      "${aws_sns_topic.start_machines.arn}"
      statement_id:                    "AllowExecutionFromSNS"

  + aws_lambda_permission.sns_stop_machines
      id:                              <computed>
      action:                          "lambda:InvokeFunction"
      function_name:                   "${aws_lambda_function.StopEC2Instances.arn}"
      principal:                       "sns.amazonaws.com"
      source_arn:                      "${aws_sns_topic.stop_machines.arn}"
      statement_id:                    "AllowExecutionFromSNS"

  + aws_sns_topic.start_machines
      id:                              <computed>
      arn:                             <computed>
      name:                            "start_machines"
      policy:                          <computed>

  + aws_sns_topic.stop_machines
      id:                              <computed>
      arn:                             <computed>
      name:                            "stop_machines"
      policy:                          <computed>

  + aws_sns_topic_subscription.sns_start_machines
      id:                              <computed>
      arn:                             <computed>
      confirmation_timeout_in_minutes: "1"
      endpoint:                        "${aws_lambda_function.StartEC2Instances.arn}"
      endpoint_auto_confirms:          "false"
      protocol:                        "lambda"
      raw_message_delivery:            "false"
      topic_arn:                       "${aws_sns_topic.start_machines.arn}"

  + aws_sns_topic_subscription.sns_stop_machines
      id:                              <computed>
      arn:                             <computed>
      confirmation_timeout_in_minutes: "1"
      endpoint:                        "${aws_lambda_function.StopEC2Instances.arn}"
      endpoint_auto_confirms:          "false"
      protocol:                        "lambda"
      raw_message_delivery:            "false"
      topic_arn:                       "${aws_sns_topic.stop_machines.arn}"


Plan: 13 to add, 0 to change, 0 to destroy.

------------------------------------------------------------------------

Note: You didn't specify an "-out" parameter to save this plan, so Terraform
can't guarantee that exactly these actions will be performed if
"terraform apply" is subsequently run.
```

Now to execute and create the infrastructure, run `terraform apply` and yay! We have our machines

```
$ tf apply -var instance='HAL-TheBigPHPMachine' -var region=ap-southeast-2
aws_sns_topic.start_machines: Creating...
  arn:    "" => "<computed>"
  name:   "" => "start_machines"
  policy: "" => "<computed>"
aws_sns_topic.stop_machines: Creating...
  arn:    "" => "<computed>"
  name:   "" => "stop_machines"
  policy: "" => "<computed>"
aws_iam_role.iam_for_lambda: Creating...
  arn:                   "" => "<computed>"
  assume_role_policy:    "" => "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Action\": \"sts:AssumeRole\",\n      \"Principal\": {\n        \"Service\": \"lambda.amazonaws.com\"\n      },\n      \"Effect\": \"Allow\",\n      \"Sid\": \"\"\n    }\n  ]\n}\n"
  create_date:           "" => "<computed>"
  force_detach_policies: "" => "false"
  name:                  "" => "iam_for_lambda"
  path:                  "" => "/"
  unique_id:             "" => "<computed>"
aws_cloudwatch_event_rule.fires_at_8am_each_business_day: Creating...
  arn:                 "" => "<computed>"
  description:         "" => "CloudWatch Even that fires at 8am each day"
  is_enabled:          "" => "true"
  name:                "" => "fires_at_8am_each_business_day"
  schedule_expression: "" => "cron(0 8 ? * MON-FRI *)"
aws_cloudwatch_event_rule.fires_at_8pm_each_business_day: Creating...
  arn:                 "" => "<computed>"
  description:         "" => "CloudWatch Even that fires at 8pm each day"
  is_enabled:          "" => "true"
  name:                "" => "fires_at_8pm_each_business_day"
  schedule_expression: "" => "cron(0 20 ? * MON-FRI *)"
aws_sns_topic.stop_machines: Creation complete after 0s (ID: arn:aws:sns:ap-southeast-2:374244565798:stop_machines)
aws_sns_topic.start_machines: Creation complete after 0s (ID: arn:aws:sns:ap-southeast-2:374244565798:start_machines)
aws_cloudwatch_event_rule.fires_at_8pm_each_business_day: Creation complete after 0s (ID: fires_at_8pm_each_business_day)
aws_cloudwatch_event_target.sns_stop_machines: Creating...
  arn:       "" => "arn:aws:sns:ap-southeast-2:374244565798:stop_machines"
  rule:      "" => "fires_at_8pm_each_business_day"
  target_id: "" => "<computed>"
aws_cloudwatch_event_rule.fires_at_8am_each_business_day: Creation complete after 0s (ID: fires_at_8am_each_business_day)
aws_cloudwatch_event_target.sns_start_machines: Creating...
  arn:       "" => "arn:aws:sns:ap-southeast-2:374244565798:start_machines"
  rule:      "" => "fires_at_8am_each_business_day"
  target_id: "" => "<computed>"
aws_cloudwatch_event_target.sns_start_machines: Creation complete after 1s (ID: fires_at_8am_each_business_day-terraform-0057cf509e1f64cf3e17508105)
aws_cloudwatch_event_target.sns_stop_machines: Creation complete after 1s (ID: fires_at_8pm_each_business_day-terraform-0057cf509e1f64cf3e17508104)
aws_iam_role.iam_for_lambda: Creation complete after 3s (ID: iam_for_lambda)
aws_lambda_function.StopEC2Instances: Creating...
  arn:                         "" => "<computed>"
  environment.#:               "" => "1"
  environment.0.variables.%:   "" => "1"
  environment.0.variables.foo: "" => "bar"
  filename:                    "" => "StopEC2Instances-ap-southeast-2HAL-TheBigPHPMachine.zip"
  function_name:               "" => "StopEC2Instances-ap-southeast-2HAL-TheBigPHPMachine"
  handler:                     "" => "StopEC2Instances-ap-southeast-2HAL-TheBigPHPMachine.lambda_handler"
  invoke_arn:                  "" => "<computed>"
  last_modified:               "" => "<computed>"
  memory_size:                 "" => "128"
  publish:                     "" => "false"
  qualified_arn:               "" => "<computed>"
  role:                        "" => "arn:aws:iam::374244565798:role/iam_for_lambda"
  runtime:                     "" => "python2.7"
  source_code_hash:            "" => "lLinGda0Xe0ATQvZK4d5xGZNghPE0v+EFxxNXlsmhZY="
  timeout:                     "" => "3"
  tracing_config.#:            "" => "<computed>"
  version:                     "" => "<computed>"
aws_lambda_function.StartEC2Instances: Creating...
  arn:                         "" => "<computed>"
  environment.#:               "" => "1"
  environment.0.variables.%:   "" => "1"
  environment.0.variables.foo: "" => "bar"
  filename:                    "" => "StartEC2Instances-ap-southeast-2HAL-TheBigPHPMachine.zip"
  function_name:               "" => "StartEC2Instances-ap-southeast-2HAL-TheBigPHPMachine"
  handler:                     "" => "StartEC2Instances-ap-southeast-2HAL-TheBigPHPMachine.lambda_handler"
  invoke_arn:                  "" => "<computed>"
  last_modified:               "" => "<computed>"
  memory_size:                 "" => "128"
  publish:                     "" => "false"
  qualified_arn:               "" => "<computed>"
  role:                        "" => "arn:aws:iam::374244565798:role/iam_for_lambda"
  runtime:                     "" => "python2.7"
  source_code_hash:            "" => "RlPZAYLuwiLpuM1/ZvMMG9IRnhtLwq2Qekd00TsEk/I="
  timeout:                     "" => "3"
  tracing_config.#:            "" => "<computed>"
  version:                     "" => "<computed>"
aws_lambda_function.StartEC2Instances: Still creating... (10s elapsed)
aws_lambda_function.StopEC2Instances: Still creating... (10s elapsed)
aws_lambda_function.StopEC2Instances: Creation complete after 18s (ID: StopEC2Instances-ap-southeast-2HAL-TheBigPHPMachine)
aws_sns_topic_subscription.sns_stop_machines: Creating...
  arn:                             "" => "<computed>"
  confirmation_timeout_in_minutes: "" => "1"
  endpoint:                        "" => "arn:aws:lambda:ap-southeast-2:374244565798:function:StopEC2Instances-ap-southeast-2HAL-TheBigPHPMachine"
  endpoint_auto_confirms:          "" => "false"
  protocol:                        "" => "lambda"
  raw_message_delivery:            "" => "false"
  topic_arn:                       "" => "arn:aws:sns:ap-southeast-2:374244565798:stop_machines"
aws_lambda_permission.sns_stop_machines: Creating...
  action:        "" => "lambda:InvokeFunction"
  function_name: "" => "arn:aws:lambda:ap-southeast-2:374244565798:function:StopEC2Instances-ap-southeast-2HAL-TheBigPHPMachine"
  principal:     "" => "sns.amazonaws.com"
  source_arn:    "" => "arn:aws:sns:ap-southeast-2:374244565798:stop_machines"
  statement_id:  "" => "AllowExecutionFromSNS"
aws_lambda_permission.sns_stop_machines: Creation complete after 0s (ID: AllowExecutionFromSNS)
aws_lambda_function.StartEC2Instances: Creation complete after 19s (ID: StartEC2Instances-ap-southeast-2HAL-TheBigPHPMachine)
aws_sns_topic_subscription.sns_start_machines: Creating...
  arn:                             "" => "<computed>"
  confirmation_timeout_in_minutes: "" => "1"
  endpoint:                        "" => "arn:aws:lambda:ap-southeast-2:374244565798:function:StartEC2Instances-ap-southeast-2HAL-TheBigPHPMachine"
  endpoint_auto_confirms:          "" => "false"
  protocol:                        "" => "lambda"
  raw_message_delivery:            "" => "false"
  topic_arn:                       "" => "arn:aws:sns:ap-southeast-2:374244565798:start_machines"
aws_lambda_permission.sns_start_machines: Creating...
  action:        "" => "lambda:InvokeFunction"
  function_name: "" => "arn:aws:lambda:ap-southeast-2:374244565798:function:StartEC2Instances-ap-southeast-2HAL-TheBigPHPMachine"
  principal:     "" => "sns.amazonaws.com"
  source_arn:    "" => "arn:aws:sns:ap-southeast-2:374244565798:start_machines"
  statement_id:  "" => "AllowExecutionFromSNS"
aws_lambda_permission.sns_start_machines: Creation complete after 0s (ID: AllowExecutionFromSNS)
aws_sns_topic_subscription.sns_stop_machines: Creation complete after 1s (ID: arn:aws:sns:ap-southeast-2:374244565798...s:1ff9edaf-bf4b-4d0f-9fb3-cfcb43d1792d)
aws_sns_topic_subscription.sns_start_machines: Creation complete after 2s (ID: arn:aws:sns:ap-southeast-2:374244565798...s:837d479c-7fd9-4a89-815e-069de625b087)

Apply complete! Resources: 13 added, 0 changed, 0 destroyed.
```

# Step 6: Having a look and some caveats

Now you can jump into the web console and check out your beautiful machines

<img src="/static/images/posts/functions.png" />
<img src="/static/images/posts/events_firing.png" />
<img src="/static/images/posts/start_fn.png" />
<img src="/static/images/posts/topics.png" />

Although Terraform goes a long way towards verifying the types of the infrastructure you provide are correct, you will see runtime errors for some classes of misconfiguration. However, most providers supportin Terraform have sophisticated enough error handling that you'll see the glaring typos and be able to fix them up

# Step 7: Terraform destroy

Now, to stop you racking up bills faster than that weekend you got super into Farmville, you can destroy your infrastructure. Don't fret because as quickly as we can destroy it, we can bring it back up again.

```
$ tf destroy -force -var instance='HAL-TheBigPHPMachine' -var region=ap-southeast-2
aws_sns_topic.start_machines: Refreshing state... (ID: arn:aws:sns:ap-southeast-2:374244565798:start_machines)
aws_iam_role.iam_for_lambda: Refreshing state... (ID: iam_for_lambda)
aws_cloudwatch_event_rule.fires_at_8pm_each_business_day: Refreshing state... (ID: fires_at_8pm_each_business_day)
aws_cloudwatch_event_rule.fires_at_8am_each_business_day: Refreshing state... (ID: fires_at_8am_each_business_day)
aws_sns_topic.stop_machines: Refreshing state... (ID: arn:aws:sns:ap-southeast-2:374244565798:stop_machines)
aws_cloudwatch_event_target.sns_start_machines: Refreshing state... (ID: fires_at_8am_each_business_day-terraform-0057cf509e1f64cf3e17508105)
aws_cloudwatch_event_target.sns_stop_machines: Refreshing state... (ID: fires_at_8pm_each_business_day-terraform-0057cf509e1f64cf3e17508104)
aws_lambda_function.StartEC2Instances: Refreshing state... (ID: StartEC2Instances-ap-southeast-2HAL-TheBigPHPMachine)
aws_lambda_function.StopEC2Instances: Refreshing state... (ID: StopEC2Instances-ap-southeast-2HAL-TheBigPHPMachine)
aws_lambda_permission.sns_start_machines: Refreshing state... (ID: AllowExecutionFromSNS)
aws_sns_topic_subscription.sns_start_machines: Refreshing state... (ID: arn:aws:sns:ap-southeast-2:374244565798...s:837d479c-7fd9-4a89-815e-069de625b087)
aws_sns_topic_subscription.sns_stop_machines: Refreshing state... (ID: arn:aws:sns:ap-southeast-2:374244565798...s:1ff9edaf-bf4b-4d0f-9fb3-cfcb43d1792d)
aws_lambda_permission.sns_stop_machines: Refreshing state... (ID: AllowExecutionFromSNS)
aws_sns_topic_subscription.sns_stop_machines: Destroying... (ID: arn:aws:sns:ap-southeast-2:374244565798...s:1ff9edaf-bf4b-4d0f-9fb3-cfcb43d1792d)
aws_cloudwatch_event_target.sns_start_machines: Destroying... (ID: fires_at_8am_each_business_day-terraform-0057cf509e1f64cf3e17508105)
aws_cloudwatch_event_target.sns_stop_machines: Destroying... (ID: fires_at_8pm_each_business_day-terraform-0057cf509e1f64cf3e17508104)
aws_lambda_permission.sns_stop_machines: Destroying... (ID: AllowExecutionFromSNS)
aws_lambda_permission.sns_start_machines: Destroying... (ID: AllowExecutionFromSNS)
aws_sns_topic_subscription.sns_start_machines: Destroying... (ID: arn:aws:sns:ap-southeast-2:374244565798...s:837d479c-7fd9-4a89-815e-069de625b087)
aws_cloudwatch_event_target.sns_stop_machines: Destruction complete after 0s
aws_cloudwatch_event_rule.fires_at_8pm_each_business_day: Destroying... (ID: fires_at_8pm_each_business_day)
aws_cloudwatch_event_target.sns_start_machines: Destruction complete after 0s
aws_cloudwatch_event_rule.fires_at_8am_each_business_day: Destroying... (ID: fires_at_8am_each_business_day)
aws_sns_topic_subscription.sns_stop_machines: Destruction complete after 0s
aws_sns_topic_subscription.sns_start_machines: Destruction complete after 0s
aws_cloudwatch_event_rule.fires_at_8am_each_business_day: Destruction complete after 0s
aws_lambda_permission.sns_stop_machines: Destruction complete after 0s
aws_lambda_permission.sns_start_machines: Destruction complete after 0s
aws_sns_topic.stop_machines: Destroying... (ID: arn:aws:sns:ap-southeast-2:374244565798:stop_machines)
aws_lambda_function.StopEC2Instances: Destroying... (ID: StopEC2Instances-ap-southeast-2HAL-TheBigPHPMachine)
aws_lambda_function.StartEC2Instances: Destroying... (ID: StartEC2Instances-ap-southeast-2HAL-TheBigPHPMachine)
aws_sns_topic.start_machines: Destroying... (ID: arn:aws:sns:ap-southeast-2:374244565798:start_machines)
aws_cloudwatch_event_rule.fires_at_8pm_each_business_day: Destruction complete after 1s
aws_lambda_function.StopEC2Instances: Destruction complete after 1s
aws_sns_topic.start_machines: Destruction complete after 1s
aws_sns_topic.stop_machines: Destruction complete after 1s
aws_lambda_function.StartEC2Instances: Destruction complete after 1s
aws_iam_role.iam_for_lambda: Destroying... (ID: iam_for_lambda)
aws_iam_role.iam_for_lambda: Destruction complete after 4s

Destroy complete! Resources: 13 destroyed.
```
# Conclusion and next steps

At this point we've seen some of what Terraform has to offer, however, for you, this is just the beginning. Here are some ideas of how to extend Terraform for use in your organization

- The `kops` package bootstraps a kubernetes cluster in EC2 using terraform as its specification. This way you can easily scale and modify your installation without worrying about editing cloud formation templates or losing track of state
- By comitting your terraform configuration for a project into source control you can implement continuous delivery via a webhook on your source control that instructs a machine to pull its latest configuration and `tf apply` it for a given workspace
- Terraform ships with a tool for importing existing provider installations into terraform so you can work with them. In the example above, you could pull in the big PHP machine and work with it like a terraform resource `aws_instance.big_php_machine.arn`

# tl;dr

[Here's the gist](https://gist.github.com/htmldrum/a6479e59f294fd93d874a9772761072c) for those who don't want to play along at home.

**Updated 22/09/2017:** Removed previous example of ECS stack with Terraform for something more grokkable and detailed. Contact me if you'd like to see that post again.
