---
layout : post 
title: RabbitMQ the best friend you never knew
categories:  python rabbitmq
summary: Evaluating RabbitMQ
---
    Bin: RabbitMQ Client / Server
    Env: Mac OSX (available to all env)
    Desc: RabbitMQ

Summary
-------

I've used RabbitMQ for quite a while without actually knowing what it was. It came as the default message queuer on Celery. All along I thought Celery was the juice but after spending an afternoon debugging a messaging protocol we'd written for AWS, I was surprised to learn that I wasn't taking advantage of a queuer correctly. RabbitMQ is O/S, has primary language bindings in Python and Java (my 2 fav langs for Enterprise), is stable and kicks a whole lot of ass.

Installation instructions for RabbitMQ
---------------------------------------

This tute is mainly for OSX users but as it's the defacto standard, the same commands and set up should work on all environments.

1. Install RabbitMQ and Erlang
{% highlight bash %}sudo port install rabbitmq-server
sudo port install erlang{% endhighlight %}

2. Path
One big problem with macports is that the bin installs are frequently all over the place. So I added the following line to my `.zshrc` (if you don't use zsh or use bash or don't know what I'm talking about add the following lines to `~/.bashrc`)
{% highlight bash %}PATH=$PATH:/opt/local/lib/rabbitmq/bin
PATH=$PATH:/opt/local/lib/erlang/bin{% endhighlight %}
and ensure you reload your conf
{% highlight bash %}source ~/.zshrc{% endhighlight %}

3. Run
{% highlight bash %}sudo rabbitmq-server -detached{% endhighlight %}

4. Make sure it's running

{% highlight bash %}ps -A | grep -i "rabbit"
    
# => 83724 ??         0:01.68 /opt/local/lib/erlang/erts-5.9.2/bin/beam.smp -W w -K true -A30 -P 1048576 -- -root /opt/local/lib/erlang -progname erl -- -home /Users/jrm -- -noshell -noinput -sname rabbit@Exhibit-E -boot /opt/local/var/lib/rabbitmq/mnesia/rabbit@Exhibit-E-plugins-expand/rabbit -kernel inet_default_connect_options [{nodelay,true}] -sasl errlog_type error -sasl sasl_error_logger false -rabbit error_logger {file,"/opt/local/var/log/rabbitmq/rabbit@Exhibit-E.log"} -rabbit sasl_error_logger {file,"/opt/local/var/log/rabbitmq/rabbit@Exhibit-E-sasl.log"} -os_mon start_cpu_sup false -os_mon start_disksup false -os_mon start_memsup false -mnesia dir "/opt/local/var/lib/rabbitmq/mnesia/rabbit@Exhibit-E" -noshell -noinput{% endhighlight %}

Intro to RabbitMQ as a queuing service
--------------------------------------

RabbitMQ is a message broker. The principal idea is pretty simple: it accepts and forwards messages. You can think about it as a post office: when you send mail to the post box you're pretty sure that Mr. Postman will eventually deliver the mail to your recipient. Using this metaphor RabbitMQ is a post box, a post office and a postman. The major difference between RabbitMQ and the post office is the fact that it doesn't deal with paper, instead it accepts, stores and forwards binary blobs of data ‒ messages. RabbitMQ, and messaging in general, uses some jargon.

Producing means nothing more than sending. A program that sends messages is a producer. We'll draw it like that, with "P":

![Node P]({{ site.url }}/media/images/p.png)

A queue is the name for a mailbox. It lives inside RabbitMQ. Although messages flow through RabbitMQ and your applications, they can be stored only inside a queue. A queue is not bound by any limits, it can store as many messages as you like ‒ it's essentially an infinite buffer. Many producers can send messages that go to one queue, many consumers can try to receive data from one queue. A queue will be drawn as like that, with its name above it:

 ![Queue P]({{ site.url }}/media/images/p_q.png)

Consuming has a similar meaning to receiving. A consumer is a program that mostly waits to receive messages. On our drawings it's shown with "C":

![Node C]({{ site.url }}/media/images/c.png)

Note that the producer, consumer, and broker do not have to reside on the same machine; indeed in most applications they don't.

![Queue P tasks Node C]({{ site.url }}/media/images/p_q_c.png)

Producer sends messages to the "hello" queue. The consumer receives messages from that queue.

Uses of RabbitMQ as a queuing service
------------------------------------

If you're new to queueing services, I suggest just setting up a simple to-do list with Celery. Once you're up to speed, here are a few things I use queueing services to perform:

    1. Nightly rotations / BI / parsing for logs. It's a lot friendlier than running a script in nice mode or arbitrarily setting a cron execution
    2. Distributing tasks amongst workers for continuous processing of blobs
    3. RPC's