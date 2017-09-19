---
layout : post 
title: Setting Up a GCE Environment
summary: Docker *hates* 32b
categories: networking docker gce
---
[No one cares](https://github.com/docker/docker/issues/136) that Docker hosts only run on 64b hardware. So, in order to keep my ThinkPad from the stone age, I've come up with a workflow in GCE that virtualizes

- ssh into machine
- create folder with docker image
- create github repo
- create dockerfile
- run docker container
- ssh into docker container to configure what?
- upload to docker daemon
- 
