---
layout: post 
title: Top-down, depth-first tree parser in JS
categories: tree-parser D3
summary: Tree building in D3
---
The easiest way to solve a problem was to construct a tree and implement a visitor pattern for building a representation of geographical wine regions. Hierarchies of regions formed an acyclic graph but it was locked behind a linear CRUD API. This script reconstructs the tree for graphing in D3.

Here's your first warning: *CRUD will lock your data behind sparse, inefficient interfaces* designed ostensibly to indicate progress and http cacheing. Do not fall into the trap of linearly scaling routes to describe your domain. This is lazy and results in a proliferation of 'names'. **CQRS!**

<script src="https://gist.github.com/htmldrum/6450c32f622f8d3a6da8.js"></script>

**Update 6/26/2016**: Added preface and rant on CRUD.