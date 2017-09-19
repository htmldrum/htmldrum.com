---
layout: post 
title: Basics of provisioning nodes with Puppet
summary: The basics of provisioning nodes with Vagrant and Puppet
categories: devops puppet vagrant ruby
---
Vagrant is a very powerful tool because of the two concepts it can manage for us:
- Virtualization
- Provisioning

Whilst Vagrant makes the process of spinning up VM's very easy, these virtual machines are dumb; they have very little software installed for us to use, and they are certainly not configured for our projects. This is where provisioning comes in. Provisioning automates the process of turning a base machine into one, which is configured for use with a specific project.

Puppet is a provisioning tool which we can use to set up a server for use for a project. The configuration which determines how the server needs to be set up can be stored within our Vagrant project and can be shared with teammates through a version control, ensuring everyone gets an up-to-date copy of the required development environment.

Information about how a server should be configured, that is, its software, files, users, and groups, is written into files known as the Puppet manifests. These manifests are written by using Puppet's own language, which is a Ruby Domain Specific Language. Puppet takes this information and compiles it into a catalog that is specific for the operating system it is being applied to.

Puppet modules typically consist of classes, which in turn utilize a number of resource types (in this example, the package resource type, to install a software package) to achieve a specific requirement for our server. It effectively allows us to bundle a number of these resource types in a way which means we can simply include the class by its name and have all of the instructions from within it executed. A class in its most basic form is structured as follows:

{% highlight python %}
class apache {
  package { "apache2":
  ensure => present,
  require => Exec['apt-get update']
  }
}
{% endhighlight %}

Puppet provides a range of resource types which we can utilize to create our
configuration files. These resource types are translated and compiled depending on the operating system being used. For example, if we were to use the package resource type to install some software, this would use apt-get on Ubuntu and Yum on Fedora operating systems. A small number of resource types are operating system specific, for example, the scheduled_task resource type is designed specifically for Windows, and the cron type is designed for Linux and UNIX based systems. Resource types available include:

- `cron` : To manage cron jobs on Linux and UNIX based systems
- `exec` : To run commands at the terminal/command prompt
- `file` : To manage and manipulate files and folders on the filesystem
- `group` : To manage user groups
- `package` : To install software
- `service` : To manage running services on the machine
- `user` : To manage user accounts on the machine

We can use the Package resource to ensure that Apache is installed, and if it isn't, it will be installed, as follows:

{% highlight python %}
package { "apache2":
  ensure => present,
  require => Exec['apt-get update']
}
{% endhighlight %}

Here we have told Puppet to ensure that the Apache2 package is present. We
have added our apt-get update command as a prerequisite, so we know that
our packages will be up-to-date.

Finally, make sure that Apache uses the Service resource. While Apache will
automatically run when we install it, we may connect to our new server and alter settings or services by mistake. If this happens, we can simply re-run the provisioner; as Apache will already be installed it won't re-install it, but the Service resource will force Puppet to ensure that the Apache service is running. Obviously, this can't be run if Apache isn't installed, so the Apache2 package is a prerequisite.

{% highlight python %}
service { "apache2":
  ensure => running,
  require => Package['apache2']
}
{% endhighlight %}

**Update 6/26/2016**: Added syntax highlighting.