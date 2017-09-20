---
layout: post 
title: Object construction in JavaScript
categories: javascript prototypical-inheritence
summary: A summary of traditional object inheritence in JavaScript
---
The most popular way of defining Prototype behavior is to first assign a constructor function to the Prototype, then access the inheritence tree through the object via the *.prototype* method.

```javascript
var MyShoe = function( properties ){
 this.tied = properties.tied || false;
};

MyShoe.prototype.tie = function(){
  this.tied = true;
};
 
MyShoe.prototype.untie = function(){
  this.tied = false;
};
 
var shoe = new MyShoe();
shoe.untie();
```
[Gist](https://gist.github.com/htmldrum/e728954c94a75379fd44)

However, another way exists where a function is assigned to the pseudo-class and is treated as a constructor, giving the programmer explicit control over the order of method binding.

```javascript
var MyShoe = function( properties ){

  this.tie = function(){
    this.tied = true;
  }

  this.untie = function(){
    this.tied = false;
  }

  this.tied = properties.tied || false;

};

var shoe = new MyShoe();
shoe.untie();
```
[Gist](https://gist.github.com/htmldrum/39e622d3eb8c18047297)

**Updated 9/20/2017:** Approaches are equivalent. Only real difference is that the assignment of methods via is more useful when composing prototypes together. The 2nd approach is not composable as it insists on an atomic constructor. That said, the first has no means of resolving conflicts in key names on composition other than overwriting them. That said, this is all ancient. [Object#create](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create) is the way it should be done nowadays.
