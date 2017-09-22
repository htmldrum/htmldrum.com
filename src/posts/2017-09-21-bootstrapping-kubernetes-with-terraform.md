---
title: Bootstraping Kubernetes with Terraform
summary: There are many ways to configure a container cluster, here is the one I choose.
categories: terraform kubernetes docker
---
Kubernetes! Woah! Everyone loves new hot shit and this is the newest, hottest shit since Aaron Carter.

# Chapter 1: So you want to run Kubernetes
Having been through the ringer with it now, I'm less impressed and generally advise people to look at `rancher.os` or `Docker swarm` as they fit most people's workloads. However, when you have a clients or developers that want:
- An elasticsearch cluster?
- A Redis Sentinel cluster?
- A Maria DB (generally a horrendous idea for performance with lots of data but it's good enough for most applications)?
- A Ghost blogging node?
- A GraphQL backend?
- An ELK stack?
- Literally anything anyone could possibly squeeze into a Docker container?
Then Kubernetes is the tool for you.

You can get away with running it from 1 small master node with 2 medium workers but anything less than that and you may as well be on VPS. If you do have fancy-shmancy picky developers, it's a god-send. Trying to run these configurations on Deis or AWS OpsWorks or a shared host,  you are signing up your weekends and very late nights for debugging strange build errors and lots of head banging (your head aginst the keyboard, that is!). Did you spell every string in your Chef configuration correctly? Did your vendor manage to avoid all of the footguns involved in writing systems software in Python? The answer is usually 'No' so this is when Docker gets a seat at the big boy's table. UnionFS is to developers as communal wine is to anglican priests: you can never use it enough and it makes life worth living. Did something fuck up? YES?! Then just get a shell at the last known good configuration and proceed like any 10x JavaScript millionaire and bang commands into a prompt.

# Chapter 2: FINE
The best way to set up Kubernetes is `kops`. It's essentially a ton of functionality packed into a script and without too much fuss, it'll bootstrap you to fun times. I've used it to bootstrap 4 clusters and I'd be hosed without it. It allows you to parameterize the Kubernetes version, your cloud provider and instance types but best of all it persists its configuration to Terraform.

# Chapter 3: I"LL DO IT

I was never able to fully script up my interactions with KOPS but here's some ideas that should get you most of the way there:

```ruby
#!/usr/bin/env ruby
## rand_name.rb generates a name for the infrastructure cluster
animal = ["Abyssinian","AdeliePenguin","Affenpinscher","AfghanHound","AfricanBushElephant","AfricanCivet","AfricanClawedFrog","AfricanForestElephant","AfricanPalmCivet","AfricanPenguin","AfricanTreeToad","AfricanWildDog","AinuDog","AiredaleTerrier","Akbash","Akita","AlaskanMalamute","Albatross","AldabraGiantTortoise","Alligator","AlpineDachsbracke","AmericanBulldog","AmericanCockerSpaniel","AmericanCoonhound","AmericanEskimoDog","AmericanFoxhound","AmericanPitBullTerrier","AmericanStaffordshireTerrier","AmericanWaterSpaniel","AnatolianShepherdDog","Angelfish","Ant","Anteater","Antelope","AppenzellerDog","ArcticFox","ArcticHare","ArcticWolf","Armadillo","AsianElephant","AsianGiantHornet","AsianPalmCivet","AsiaticBlackBear","AustralianCattleDog","AustralianKelpieDog","AustralianMist","AustralianShepherd","AustralianTerrier","Avocet","Axolotl","AyeAye"]
part = ["arm","eye","eyebrow","belly","leg","breast","thumb","elbow","fist","finger","foot","ankle","buttocks","hair","neck","hand","wrist","hip","chin","knee","head","lip","mouth","nose","nostril","thigh","ear","bum","back","forearm","shoulder","forehead","waist","calf","cheek","eyelash","tooth","toe","tongue"]
puts "#{animal.sample}#{part.sample.capitalize}"

```

`rand_name.rb` is handy because you really don't want to be in the business of naming things. Imagine how hard it would be to come up with something that would please everyone! Now, all you have to do is pick something that isn't too long. With that said, I really should take out words like `AmericanStaffordshireTerrier` and `AmericanCockerSpaniel` because if you proceed with a name like `AfricanBushElephantFinger`, you're hands are going to tell you it was not a good idea.

One problem with `kops` at the moment is that it relies on you having an S3 bucket already to store its node configuration into. So, use this Terraform configuration to create the bucket prior to running `kops create`.

```ruby
## s3/main.tf

resource "aws_s3_bucket" "my_application_environment" {
  bucket = "${var.bucket_name}"
  acl = "public-read"
  policy = "${data.template_file.policy.rendered}"
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    expose_headers = ["ETag"]
    max_age_seconds = 3000
  }
  tags {
    my_application_environment = "k8s_host"
    environment = "environment"
  }
}

data "template_file" "policy" {
  vars {
    bucket_name = "${var.bucket_name}"
  }
  template = "${file("./s3/policies/s3_public_read.tpl")}"
}

variable "bucket_name" {
  type = "string"
  default = "KOPS_STATE_STORE"
}
```

```json
// s3/policies/s3_public_read.tpl
{
    "Version": "2008-10-17",
    "Statement": [
        {
            "Sid": "AllowPublicRead",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::KOPS_STATE_STORE/*"
        }
    ]
}
```

Now you're ready for `kops` to do its thing.
I've squashed a few scripts together here so give it environment variables as you will but make sure you keep the keys secret, you correctly associate the bucket with kops and you give it the appropriate environment name. Lastly, it helps to register the domain through AWS as you'll get more immediate access to route to it. Check out the `kops` source for more options you can provide the generator, that's how I found `admin_cidr_ingress`

```bash
#!/bin/bash

export MYDOMAIN="my-datacenter.com"
export CLUSTER_NAME="africanbushelephantfinger"
export AWS_S3_REGION=ap-southeast-2
export KUBE_AWS_ZONE=ap-southeast-2b
export MASTER_SIZE=t2.small
export NODE_SIZE=t2.medium
export NUM_NODES=3
export NODE_ROOT_DISK_SIZE=30
export KUBE_AWS_INSTANCE_PREFIX=$CLUSTER_NAME
export KUBERNETES_PROVIDER=aws
export KOPS_STATE_STORE=s3://KOPS_STATE_STORE
export NAME=$CLUSTER_NAME.$MYDOMAIN
export KOPS_TARGET=terraform
export OFFICE_SUBET="10.0.0.1/32"

ssh-keygen -t rsa -N "" -f $NAME

kops create cluster\
   --admin_cidr_ingress=$OFFICE_SUBNET
   --name=$NAME\
   --target=$KOPS_TARGET\
   --cloud=$KUBERNETES_PROVIDER\
   --zones=$KUBE_AWS_ZONE\
   --master-size=$MASTER_SIZE\
   --node-size=$NODE_SIZE\
   --node-count=$NUM_NODES\
   --yes\
   --kubernetes-version=1.5.1\
   --ssh-public-key=./$NAME.pub\
   --alsologtostderr

pushd out/terraform
terraform get; terraform plan; terraform apply
popd
```

Out of the box, KOPS doesn't include kubernetes dashboard or node monitoring add ons. Install these, they are nice.

```bash
#!/bin/bash

kubectl create -f https://rawgit.com/kubernetes/dashboard/master/src/deploy/kubernetes-dashboard.yaml
kubectl create -f https://raw.githubusercontent.com/kubernetes/kops/master/addons/monitoring-standalone/v1.2.0.yaml

```

The next kubernetes configuration is handy dandy as it will allow you to automatically assign DNS entries to your hosted zone, based on metadata read from your Kubernetes nodes.

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: route53-kubernetes
  namespace: kube-system
  labels:
    app: route53-kubernetes
spec:
  replicas: 1
  selector:
    app: route53-kubernetes
  template:
    metadata:
      labels:
        app: route53-kubernetes
    spec:
      containers:
        - image: quay.io/molecule/route53-kubernetes:v1.3.0
          name: route53-kubernetes

```

Speaking of DNS, `kops` won't be able to know the structure of your network. Whilst it will be able to assert a network name for itself, you rarely want this to host production traffic as you want the ability to rely CNAMEs to swap the underlying cluster from time to time. In case of outages or sunsetting old configuration, you can switch the CNAME on your production records to point users to the new hosts. All the provisos about relying on DNS cacheing apply.

Essentially, you create CNAMEs to resolve your well known applications to their cluster names as follows:
  * blog.foobar.com => blog.africanbushelephantfinger.foobar.com
  * api.foobar.com => api.africanbushelephantfinger.foobar.com
  * monitoring.foobar.com => monitoring.africanbushelephantfinger.foobar.com
  * pet_name_1.foobar.com => pet_name_1.africanbushelephantfinger.foobar.com

```ruby
# ./dns/main.tf
# *.${var.environment_name}.${var.domain_name} - Public environment
resource "aws_route53_zone" "environment" {
  name = "${var.environment_name}.${var.domain_name}."
  comment = "Public Environment"
  force_destroy = false
}
resource "aws_route53_record" "NS" {
  zone_id = "${var.root_zone_id}"
  name = "${var.environment_name}.${var.domain_name}."
  type = "NS"
  records = [
    "${aws_route53_zone.cluster_name.name_servers.0}",
    "${aws_route53_zone.cluster_name.name_servers.1}",
    "${aws_route53_zone.cluster_name.name_servers.2}",
    "${aws_route53_zone.cluster_name.name_servers.3}"
  ]
  ttl = "300"
}

# *.${var.cluster_name}.${var.domain_name} - Developer Kubernetes Cluster
resource "aws_route53_zone" "cluster_name" {
  name = "${var.cluster_name}.${var.domain_name}"
  comment = "Developer Kubernetes Cluster"
  force_destroy = false
}
resource "aws_route53_record" "cluster_nameNS" {
  zone_id = "${var.root_zone_id}"
  name = "${var.cluster_name}.${var.domain_name}"
  type = "NS"
  records = [
    "${aws_route53_zone.cluster_name.name_servers.0}",
    "${aws_route53_zone.cluster_name.name_servers.1}",
    "${aws_route53_zone.cluster_name.name_servers.2}",
    "${aws_route53_zone.cluster_name.name_servers.3}"
  ]
  ttl = "1800"
}

# Application CNAMEs
resource "aws_route53_record" "${var.environment_name}CNAMEpet_name_1" {
  zone_id = "${aws_route53_zone.${var.environment_name}.zone_id}"
  name = "pet_name_1.${var.environment_name}.${var.domain_name}."
  type = "CNAME"
  records = ["pet_name_1.${var.cluster_name}.${var.domain_name}."]
  ttl = "1800"
}
resource "aws_route53_record" "${var.environment_name}CNAMEpet_name_2" {
  zone_id = "${aws_route53_zone.${var.environment_name}.zone_id}"
  name = "pet_name_2.${var.environment_name}.${var.domain_name}."
  type = "CNAME"
  records = ["pet_name_2.${var.cluster_name}.${var.domain_name}."]
  ttl = "1800"
}
resource "aws_route53_record" "${var.environment_name}CNAMEpet_name_3" {
  zone_id = "${aws_route53_zone.${var.environment_name}.zone_id}"
  name = "pet_name_3.${var.environment_name}.${var.domain_name}."
  type = "CNAME"
  records = ["pet_name_3.${var.cluster_name}.${var.domain_name}."]
  ttl = "1800"
}
resource "aws_route53_record" "${var.environment_name}CNAMEpet_name_4" {
  zone_id = "${aws_route53_zone.${var.environment_name}.zone_id}"
  name = "pet_name_4.${var.environment_name}.${var.domain_name}."
  type = "CNAME"
  records = ["pet_name_4.${var.cluster_name}.${var.domain_name}."]
  ttl = "1800"
}
variable "root_zone_id" {
  type = "string"
}
variable "environment_name" {
    type = "string"
    default = "production"
}
variable domain_name {
  type = "string"
  default = "my-datacenter.com"
}
```

Next, you'll need to create an ECR configuration for storing your Docker images. Once built, they are the last stop on the train between dev and prod.

```ruby
# ./ecr/main.tf

# ECR per application per region
resource "aws_ecr_repository" "pet_name_1" {
  name = "pet_name_1"
}
resource "aws_ecr_repository" "pet_name_2" {
  name = "pet_name_2"
}
resource "aws_ecr_repository" "pet_name_3" {
  name = "pet_name_3"
}
resource "aws_ecr_repository" "pet_name_4" {
  name = "pet_name_4"
}

```

Next, you'll need to update your projects to build to Docker containers, to push these containers to a registry and to invite the Kubernetes cluster to pull the new images

```bash
#!/bin/bash
## deploy.sh
set -x
aws ecr get-login --registry-ids ${registry_id} >> /tmp/docker_login && chmod +x /tmp/docker_login && /tmp/docker_login && rm /tmp/docker_login
docker build . -t pet_name_1
docker tag pet_name_1 ${ECS_URL}/pet_name_1
docker push ${ECS_URL}/pet_name_1
kubectl replace --force -f ./k8s/staging/pet_name_1_dep.yml
kubectl delete pod -l 'service=pet_name_1'
```

Here's an example implementation of a K8s service and deployment object for a Rails-based API. For a more complete example, [see my GitHub repo](https://github.com/htmldrum/mk_rp_gra_ne_demo).

```yaml
# ./k8s/env/pet_name_1-dep.yml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  creationTimestamp: null
  name: pet-name-1
spec:
  replicas: 1
  template:
    metadata:
      creationTimestamp: null
      labels:
        service: pet-name-1
        product: pet-name
        tier: frontend
    spec:
      containers:
      - name: web
        image: ${ECR_ID}.dkr.ecr.ap-southeast-2.amazonaws.com/pet-name-1:latest
        args:
        - ./bin/start
        env:
        - name: DATABASE_PORT
          value: "5432"
        - name: DATABASE_URL
          value: "postgres://dec7d9c6c7a886de1af6:c0f72750a94da715618edfeea7802cbdc55b5a7fd90c1335cd5e02c6fc09@staging2.cztbodtqjwpy.ap-southeast-2.rds.amazonaws.com/oet-name-1"
        - name: RACK_ENV
          value: "staging"
        - name: RAILS_ENV
          value: "staging"
        - name: SECRET_KEY_BASE
          value: "dca6444d234d46b73becb94ab03ed200e90d43d8d5e7db6ea90761d735840abd85ed2b7e00171cf1481d9cf409e35cfd47fbffd51e0d8d1ebaab52f4bb8f2781"
        - name: TENANT_ID
          value: "6b8e26de-e518-4628-aba3-415ebace303a"
        ports:
        - containerPort: 80
          protocol: TCP
      restartPolicy: Always
```

```yaml
# ./k8s/env/pet_name_1-svc.yml
apiVersion: v1
kind: Service
metadata:
  name: pet-name-1
  creationTimestamp: null
  labels:
    service: pet-name-1
    tier: web
    dns: route53
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: "arn:aws:acm:ap-southeast-2:${ECR_ID}:certificate/ae176dd5-533b-4f67-8ce4-bcc312240da3"
    service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443"
    domainName: "pet-name-1.environment.mydomain.com"
spec:
  clusterIP: 100.64.86.221
  type: LoadBalancer
  ports:
  - name: "http"
    port: 80
    targetPort: 80
    protocol: "TCP"
  - name: "https"
    port: 443
    targetPort: 80
    protocol: "TCP"
  selector:
    service: pet-name-1
    product: pet-name
status:
  loadBalancer:
    ingress:
    - hostname: a7530f8f0d38e11e6adc106e48f687c9-200816236.ap-southeast-2.elb.amazonaws.com
```
# Conclusion

If it seems like a lot to set up, it is! It starts paying off after around ~10 different services. Then, having the same interface to perform atomic updates, rollbacks, monitoring, DNS resolution accrue. Before then, just grab something like `capistrano` and save yourself some late nights.
