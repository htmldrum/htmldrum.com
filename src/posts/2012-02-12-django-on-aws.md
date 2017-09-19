---
layout : post 
title: Django on AWS
categories: django apache python-2.7
summary: A look at my light-weight hybrid cloud.
---
Through the week I decided that I'd migrated my current home network to the cloud. Currently the setup works like this:

Home LAN: 
    Devices: A tower and a laptop
    Services: Git bare repo, Fileserver
    Roles: Development, Entertainment, SCM

Portable: 
    Devices: Macbook Pro, iPhone.
    Services: N/A
    Roles: Development, Git Client

Taking a step back I thought that if I ever let my work networks get like that I'd shot myself. But I get the feeling that's the way with technology. When you sandbox at home, it just needs to work. It doesn't need to be extensible, reliable, ordered or defensible outside your context because the work you do is frequently specific to an interpreter or environment.

I also wanted to ensure that I wasted as little time dealing with manipulating environments as possible. I want all my tech work to be data driven. I'll keep all my configuration files in separate directories, all versioned and kept in cloud storage (S3 or Dropbox). That way when I needed to set up a new machine or work on an existing project in a new environment I only need to use a package manager for my environment.

With an eye for setting an environment up for the next few years at least I took the step of reorganizing and came up with the following set up.

    Home Lan
        Tower
            Entertainment only
            Clean reinstall of Ubuntu 12.04 (hate unity, but hate fedora more, would've gone with GNOME if I didn't have a disk lying around) and Win 7
        Laptop
            Development only
            Clean reinstall of Ubuntu 12.04
    Portable
        Macbook Pro
            Development only
            Clean upgrade to Mountain Lion
    Cloud Lan
        Dropbox
            When setting up all the development services I've been using recently (vi, tmux, symfony, virtualenv, django) on my laptop I made sure I was symlinking their key conf files from my Dropbox.
            This set up only works because they are interpreted resources. Should any O/S specific confs come up in the future I will be in trouble. For now, party on Wayne.
        AWS
            One server with two roles
                SCM
                Web Hosting
            I understand that VPN's within the cloud are easy but I wanted cheap. I pay nothing and I get 5gb's a month of SCM and Web Hosting that took 30 minutes to set up and commit to.
            That said, the two roles will be filled with different Unix users/groups.

With that said, here's how I set it up my AWS rig:

1. Register an account. You'll need a credit card. If you can't find one, get in touch with me on @freenode - #Annon
2. Go to the EC2 tab, set up the Red Hat instance, accept all the defaults. Keep a track of where you downloaded your key. You'll not be able to get a new one without creating a new instance. Keep this key somewhere safe - you'll need it when you lock yourself out of your house (we all do it). My suggestion is  ~/.ec2/personal/XXX.pem. Make sure the perms are 600 (chmod 600 XXX.pem)
3. Go to the the Elastic IP's tab and create and assign a public IP to your instance ( necessary only for addressing the server publically )
4. Now, if your instances have been launched and it has the default EBS drive mounted you should be able to get in:

{% highlight bash %}
ssh -i /PATH/TO/KEY.PEM ROOT-USER-NAME@PUBLIC-IP

# PATH/TO/KEY.PEM - The path to the ec2 key you downloaded when setting up the instance
# ROOT-USER-NAME - The username of the root specific to your distro. If you went with the red hat AMI it's root, if you went with the default Amazon ami it's ec2-user.
# PUBLIC-IP - The Elastic IP you created and assigned in step 3
# RHEL uses Yum for package management. While I prefer Debian, we'll use this server to keep up on our Yum skills. Let's install some packages:
echo "Installing Git, setting up repo directory"
yum install git
groupadd SCM
useradd -m git
usermod -G SCM git

echo '#### Main SCM directory ' > /home/git/README.MD 

echo "Installing MySQL"
yum grouplist | grep -i mysql
yum groupinstall "MySQL Database server"
sudo apt-get install python-dev libmysqlclient-dev
yum install -y python-devel

service mysqld start
ps -A | grep "mysql"; grep mysql /etc/passwd
mysql> set password for 'root'@'localhost' = PASSWORD('DERP')
mysql> set password for 'root'@'127.0.0.1' = PASSWORD('derp')
mysql> create user 'guest'@'localhost' IDENTIFIED BY 'derpFUCKbag'
CREATE DATABASE $DB_NAME
mysql> GRANT ALL ON $DB_NAME.* TO guest

python manage.py startapp app
echo "Installing apache"
yum group -y install "Development Tools"
yum install -y zlib-devel bzip2-devel openssl-devel ncurses-devel httpd mod_wsgi
wget http://www.python.org/ftp/python/2.7.3/Python-2.7.3.tar.bz2
tar xf Python-2.7.3.tar.bz2
cd Python-2.7.3
./configure --prefix=/usr/local
get http://pypi.python.org/packages/source/d/distribute/distribute-0.6.27.tar.gz
tar xf distribute-0.6.27.tar.gz
cd distribute-0.6.27
/usr/local/bin/python2.7 setup.py install
/usr/local/bin/easy_install-2.7 virtualenv
/usr/local/bin/easy_install-2.7 pip
/usr/local/bin/pip install virtualenvwrapper
/usr/local/bin/pip install MySQL-python 
useradd -m j
passwd j
sudo su j

# SCP in your public keyss
# Then back on the server:
chmod go-wrx .ssh

restorecon -R -v /path/to/.ssh

# http://www.sysarchitects.com/ssh_and_rhel6#comment-811
echo -e "\nUSER\tALL=(ALL)\tALL\n" >> /etc/sudoers

echo "testing install"
mkdir /home/git/test
cd /home/git/test
git init . --bare --shared

cd /var/www/django-sites
git init .
echo -e "*.swp\n*.pyc" > .gitignore
git add .
git commit -am "Init"
git checkout -b "init"
v.mk $SITE_NAME
sudo apachectl start

ps -A | grep "httspd"{% endhighlight %}

And we're good.