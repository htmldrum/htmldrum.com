---
layout : post 
title: Setting Up a GCE Environment
summary: Docker *hates* 32b
categories: networking docker gce
---
[No one cares](https://github.com/docker/docker/issues/136) that Docker hosts only run on 64b hardware. So, in order to keep my ThinkPad from the stone age, I've come up with a workflow in GCE using one development docker-based VM that builds another.

**Update 20/9/2017:** Original formatting on this was difficult to understand so I've ported it to a Gist. Shows how to use one Docker container as a build container for a ficticious server application. I've stripped out all the GCE-specific configuration as it's largely ad hoc and within their web-based tool. The guts is in [the gist](https://gist.github.com/htmldrum/fb925a10501837014372e1fe1abcdb19).

```
  --- Dockerfile - This is the definition for the build environment
  --- Makefile - This is the user's interface to produce the build artefact. You may supply arguments to tag artefacts
  --- _out - This folder stores the configuration for the artefact
    --- Dockerfile - This is the supplied bash script that configures the Dockerized process
    --- run
  --- main.go - This is the entrypoint to the ficticious service
```

It's a good idea when working with Go-based projects to have a sepparate build environment. These *"HERMETICALLY SEALED"* (oooooh!) environments come in handy when you want to deliver contiuously, provides an earliest known good artefact and saves your bacon when you have to take your junker into the Genius bar to replace the logic board.
