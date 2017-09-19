---
layout: post 
title: Clustering in Node.js
categories: node.js clustering parallelism
summary: Node.js follows both Erlang and C's fork facilities in expanding beyond a single process.
---
Node is an asynchronous, single-process interpreter. Its speed comes from [libuv](https://github.com/libuv/libuv), the asynchronous I/O library, implemented in C which implements [existing syscalls](https://github.com/libuv/libuv/blob/v1.x/src/unix/linux-syscalls.c) for [a variety of OS' and kernels](https://github.com/libuv/libuv/tree/v1.x/src) that uses [queueing primatives](https://github.com/libuv/libuv/blob/v1.x/src/unix/async.c#L42-L57) to implement standard kernel behaviours in a more efficient manner. It features:

  -  Full-featured event loop backed by epoll, kqueue, IOCP, event ports.
  -  Asynchronous TCP and UDP sockets
  -  Asynchronous DNS resolution
  -  Asynchronous file and file system operations
  -  File system events
  -  ANSI escape code controlled TTY
  -  IPC with socket sharing, using Unix domain sockets or named pipes (Windows)
  -  Child processes
  -  Thread pool
  -  Signal handling
  -  High resolution clock
  -  Threading and synchronization primitives

There's nothing special about Node's use of libuv as it has been implemented in [Python](https://github.com/saghul/pyuv), [Ruby](https://github.com/avalanche123/uvrb) and for lots of other platforms.

An interesting feature of Node is that by default it is single process (and single threaded). Node application response times can shoot up when slammed with large numbers of uncached requests. Short of dropping the nice on your process or increasing its timeslices, a solution to alleviating this is to extend the server process to multiple processes using the cluster module. In its implementation it resembles the fork/exec implementation in Unix. Joyent's encouragement for developers to spin up large numbers of processes to scale applications resembles Erlang's process model.

Here's a quick Node script that spins up 2 workers under a process leader. Strange that it doesn't reference the process global to indicate what processes are the parents but it does localize this decision to the cluster module.

<script src="https://gist.github.com/htmldrum/8943122.js"></script>