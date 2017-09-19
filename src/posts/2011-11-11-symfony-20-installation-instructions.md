---
layout : post 
title: Symfony 2.0 installation instructions
categories: symfony-2.0 php ubuntu
summary: Open Source LAMP stack implementation
---

At Work we're setting up a new PHP-based stack, here are my instructions for putting together a robust development environment from the ground up. The instructions are suitable for all web-based projects that are a more complicated than your basic Shopping Cart.

This 'stack' will include the following elements:
  - Ubuntu 
  - Symfony 2.0
  - PHP
  - Composer
  - MongoDB
  - AWS

1) If you're new to this web stack or operating system, start with a clean VM

2) Create the folder where our beautiful web application will live and open up the permissions for development. Make sure you limit this when your application is deployed.
{% highlight bash %}sudo mkdir -p /var/www/project_name
sudo chmod a+wrx /var/www/project_name{% endhighlight %}

2) Install some basic software, make sure you enter as the wheel user to avoid permissions issues

{% highlight bash %}sudo su
apt-get install php
apt-get install curl
apt-get install git
exit{% endhighlight %}

3) Download Composer into your system bin path

{% highlight bash %}sudo su  
curl -s http://getcomposer.org/installer | php -- --install-dir=/usr/bin/composer
exit{% endhighlight %}

4) Create a config file for Composer that will list our dependencies. It's okay that it's empty (for now!)

{% highlight bash %}echo "{'require':{}}" > /var/www/project_name/composer.json{% endhighlight %}

5) Navigate to `/var/www` and intialize Composer:

{% highlight bash %}php /usr/bin/composer/composer.phar install{% endhighlight %}

6) Download Symfony 2.0 (http://symfony.com/download) and unpack to `/var/www/SymProj`

7) Verify install in `app/check.php`

8) Install and enable the SQLite3 or PDO_SQLite extension and mongo

{% highlight bash %}sudo apt-get install sqlite3
php bin/vendors instal
sudo apt-get install mongodb-server{% endhighlight %}

9) Lastly, a generic apache config

{% highlight bash %}ServerName 127.0.0.1
NameVirtualHost *
<VirtualHost 127.0.0.1:80>
        ServerName james.dev
        DocumentRoot "/var/www/SymProj"
        Options +ExecCGI +Indexes +FollowSymLinks
        AddHandler application/x-httpd-php .php
</VirtualHost>{% endhighlight %}

**Update 6/26/2016:** Added syntax highlighting.