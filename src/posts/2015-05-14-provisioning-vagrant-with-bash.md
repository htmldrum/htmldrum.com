---
layout : post 
title: Provisioning Vagrant with bash
categories: bash provisioning
summary: When you're in a hurry...
---
A lot is made of Chef and Puppet being able to provision bare-metal, VM's, containers and virtualized nodes. But what they don't tell you is that their open source 'manifests' or 'recipes' are a pit of snakes. It can take up to 8 hours just to provision a rails host with the application_ruby cookbook, that is if you can live with the [limited documentation](https://github.com/poise/application_ruby), the [examples that don't build] (http://api.berkshelf.com/cookbooks/application_ruby#berkshelf) and you like the Java-scale stacktraces.

Recently, I've just said fuck it. I'm sick of burning time trying to debug the communities cookbooks and I've just begun to prepare my boxes with bash. I don't care about portability. If I need a new OS (like that ever happens), I'll just write a new provisioning script. This will take me on the order of an hour and is guaranteed to produce a useable node, unlike my experiences with ChefDK and Vagrant where the examples claim universality but basic [recipes have *HUGE* GitHub error lists](https://github.com/svanzoest-cookbooks/apache2/issues).

Bash is portable. With that said, here's a provisioning script for a recent API I built.

- `.env`: repo-local settings that are read by the bash provisioner
- `Vagrantfile`: Vagrant configuration
- `provision.sh`: The bash provisioner
- `vagrant_provision.sh`: A simple middleware script

.

<script src="https://gist.github.com/htmldrum/20b202ed216762a841eb.js"></script>