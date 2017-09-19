Concurrent Ruby
======

- Concurrent ruby in Rails 5 - adds concurrency primatives. but in the way that C++ is a confusing mess of features, it adds a lot of 'features' without any guidance to use it. Concurrent Ruby is a footgun.

- Modern concurrency approach
  - Previous approaches - locking, coordination of shared state, threads, multi-thread, multi-process - unicorn/passenger/rack -> erlang/webmachine
    - Different model of computation that focuses on describing generic workflows with these primatives
    - Shared memory constraint was implicit with Ruby
      - large memory allocations by default - not good fit for mu-services 
      - stack-based semantics not easy to model processes of operations
      - nor class-based semantics
      - vector/map semantics not strict enough, no typing, no validation

    - Rails exposes these patterns as standard ruby classes
  - move to design patterns that implement shared memory access protocols

  - Dig open code example
  - Go through each class and give example of implementation

http://ruby-concurrency.github.io/concurrent-ruby/frames.html

Channels
======