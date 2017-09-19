---
layout: post 
title: Object construction in JavaScript
categories: javascript prototypical-inheritence
summary: A summary of traditional object inheritence in JavaScript
---
The most popular way of defining Prototype behavior is to first assign a constructor function to the Prototype, then access the inheritence tree through the object via the *.prototype* method.

<script src="https://gist.github.com/htmldrum/e728954c94a75379fd44.js"></script>

However, another way exists where a function is assigned to the pseudo-class and is treated as a constructor, giving the programmer explicit control over the order of method binding.

<script src="https://gist.github.com/htmldrum/39e622d3eb8c18047297.js"></script>