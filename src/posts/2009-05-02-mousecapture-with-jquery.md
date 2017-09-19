---
layout: post
title: Mousecapture with jQuery
summary: An old, old stack overflow answer
categories: jquery mouse
---
This post demonstrates an approximation of how to access mouse events as a stream from the browser. The example below binds an event listener to a DOM element that is called asynchronously as the user mouses over the element. The mouse co-ordinates are given in an event object. When you mouse outside the block, the co-ordinates are no longer updated. Implemented via a callback to jquery's mouse-handling facilities. When cross browser support comes, it will be possible to implement these methods with higher fidelity.

{% highlight javascript %}
$('#foo').mousemove(function(e){ 
  $('#mouse-xy').html("X: " + e.pageX + " Y: " + e.pageY); 
});
{% endhighlight %}

**Update 6/26/2016:** Cleaned up tone. As of 2016, 'consistent' event handling for categories of input device is handled by the forrest of web API's. A starting point is [here][MDN:Web#Events]. These events can be composed and intercepted in various ways. 2 popular ways are via manually binding event listeners to the DOM through the [EventTarget API]. Usual JS stuff here: it exposes a callback that returns an event object you can prod for cartesian info.

{% highlight javascript %}
var foo = document.getElementById("foo");
foo.addEventListener("mousemove", (e)=>{ 
  console.log([`X: ${e.clientX}`,
               `Y: ${e.clientY}`,
               `foo: ${e.target}`]);}, false);
{% endhighlight %}

[MDN:Web#Events]: https://developer.mozilla.org/en-US/docs/Web/Events
[requestAnimationFrame]: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
[EventTarget API]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener