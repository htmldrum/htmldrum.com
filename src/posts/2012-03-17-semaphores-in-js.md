---
layout: post 
title: Semaphores in JavaScript
categories: semaphore javascript
summary: Simple script for generating Sempahores in JS
---

Semaphores are syntactical control structures used to coordinate access to a shared resource.

{% highlight javascript %}

 /**
  * Semaphore
  * @author James Meldrum <htmldrum@tutanota.com>
  * @desc Semaphore
  * @param { function } callback - Function to call on success of semaphore
  * @param { number } flags - Number of flags to semaphore
  * @param { object } context - Context in which to evaluate the callback
  *
  */

  var Semaphore = function(callback, flags, context, name){
    this.flags = flags || 0;
    this.callback = callback;
    this.context = context || this;
  };
  Semaphore.prototype.increment = function( n ){
    this.flags += n || 1;
  };
  Semaphore.prototype.execute = function(){
    this.flags -= 1;
    if(this.flags <= 0 && this.callback){
      this.callback.apply(this.context, arguments);
    }
  };

}}{% endhighlight %}

**Update 6/26/2016:** Added syntax highlighting.