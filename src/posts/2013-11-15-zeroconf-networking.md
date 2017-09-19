---
layout: post
title: Zeroconf Networking
summary: Hands-free configuration is the goal for all systems
categories: dns dhcp networking
---

In DNS and IPv6 we have the ability to implemenet sophisticated messaging frameworks. In order to reach lower levels of latency and higher levels of sophistication we need to implement higher information throughput, at lower latency, at lower levels of the OSI model. Industry leaders need to continue to encourage standards-based approaches to feature development. Zeroconf is an example of a previous industry-standard protocol that ambitiously solved a host of user-facing issues relating to network access.

Zeroconf is the mutlicast DNS daemon developed and open sourced by Apple after a failed effort at the IETF to introduce "Networking in the Small". Known also as "Bonjour" (when referenced from an Apple marketing context), it extends existing DNS and DHCP facilities to provide semantics for structuring for link-local networking services. Zeroconf's makes user-centric networking decisions explicit in the operation of the network.

As the number of network participants increases, Zeroconf reverts to DNS to allow a user to define semantic hierarchies of services. This dynamic resolution of names to services is desireable in modern networking. The smaller we can make the time slice between *naming the application* and having it respond meaningfully to that service, the more dynamism we can leverage in network components.

It's implementation as a host protocol covers over several properties useful to application developers
- Centrally aggregated services via DNS zoning
- DNS Dynamic Update provides a Service Registration Protocol
- Existing DNS Query Protocol is extended with structured text querying
- DNSSEC
- Multicast IP addressing
- Service discovery: Symbolic identifiers nominate nodes in the network mesh. These nodes are address by symbolic identifiers ("names") instead of machine
- Open Protocol implementations: The need for cooperative protocols facilitating the communication of independent processes forces 
- Reduced barrier to entry for web services: Removes the need to manage 'web' (port 80) infrastructure. CRUD API's have so much inertia (in terms of brain power and maintenance resources) that we look to it as a solution to the overhead it causes.
{% raw %}<p></p>{% endraw %}
{% raw %}<p></p>{% endraw %}
{% raw %}<hr />{% endraw %}

It's important to acknowledge this as a cluster of companies are making it their business to leverage the fact that users cannot organize and manage networks beyond their router. Everything will automagically connect to the router and begin yelling your details at remote servers but few devices will operate together in ways that are transparent (hence able to be leveraged by) the user.

Google/Facebook/Amazon form a cluster of cloud providers all doing the same thing: NAT. If we wish the web to grow beyond its current limits, we need to encourage more dynamic network partcipation by more people in more places. To do this, we must implement NAT formally as a core part of network membership. NAT semantics should be as well-known as ips, urls and acks.

Applications would then allow the user to communicate and organize in a more performant way as the network topology would be a more relevant interval reflecting a user's "connections" than their "Friends List" - which everyone seems to think is cannonical. The solution will have to integrate with existing protocols in the way Zeroconf integrates with DHCP. And could benefit similarly: GraphQL mDNS queries?

Lots of guidance from RFCs in this space:

- [RFC3489 - STUN - Simple Traversal of User Datagram Protocol (UDP) Through Network Address Translators (NATs)](http://www.rfc-base.org/rfc-3489.html)
- [RFC5766 - Traversal Using Relays around NAT (TURN): Relay Extensions to Session Traversal Utilities for NAT (STUN) - 2010] (http://www.rfc-base.org/rfc-5766.html)
- [RFC5218 - State of Peer-to-Peer (P2P) Communication across Network Address Translators (NATs) - 2008](http://www.rfc-base.org/rfc-5128.html)
- [RFC4065 - Instructions for Seamoby and Experimental Mobility Protocol IANA Allocations](http://www.rfc-base.org/rfc-4065.html)
- [RFC4066 - Candidate Access Router Discovery (CARD)](http://www.rfc-base.org/rfc-4066.html)
- [RFC3971 - SEcure Neighbor Discovery (SEND)](http://www.rfc-base.org/rfc-3971.html)
- [RFC3261 - SIP: Session Initiation Protocol](http://www.rfc-base.org/rfc-3261.html)
- [RFC3263 - Session Initiation Protocol (SIP): Locating SIP Servers](http://www.rfc-base.org/rfc-3263.html)

Maybe we need to standardised behind a service provider instead? Whatever the case may be, the tsunami of IPs that the Internet of Things will bring nmay force the answer.

{% raw %}<hr />{% endraw %}

Sophistication in the state of implementation today outside of the Evil 4 (Google, Facebook, Amazon, Baidu) is poor and largely reflective of the lack of standard tools. Providers are leveraging packed plain-text state transfers on top of managed state-machine semantics and producing slow, buggy, inuintuitive experiences. The effort of drawing together a stack of technology to produce an ordered response that is on specification using the current tools, seems to defeat the effort of delivering the player a connected experience. Buffering, spinning, waiting, lock-step message exchange is forcing us to spend too much time staring at spinners. At the moment, GTA Online takes ~20m to match me with ~4 other players to play a game for only 10m. It's a joke. Smarter networing decisions and better game design should  be able to glean more detailed information at lower latency. They've realized this recently as they've abandoned the 'dungeon' matchmaking multiplayer experience in favour of the persistent world.

How can they have both?

### 1. State goals
Taking some liberties here as a Product Manager, I'll restate my critique as a user story demanding 'lower latency matchmaking' and 'lower barriers to gameplay'. Wrapping this in the standard Descartes predicates for effecting any change produces:

- Lower latency matchmaking.
- Lower barriers to gameplay.
- A means of measuring these 'latencies' and 'barriers'.
{% raw %}<p></p>{% endraw %}
{% raw %}<p></p>{% endraw %}
### 2. Explore implementation space
Lots of solutions are thrown at the wall here. The important thing is to encourage broad domain problem solving. Extend the range of suggestions to all possible things and limit the range of implementations to a viable solution. Some ideas:
- Increased information density at lower throughputs.
  - Helps predictive gameplay responses that can make up for perceived latency on the client. Combine prior knowledge of participant behavior with recent knowledge of participant actions in the presence of network failure.
  - Richness of actor events - footsteps, fog of war, user-visible environment changes.
- Decreased need to exchange information.
- Revisualizing the multiplayer experience.
  - Make gameplay with lower consistency guarantees and network overhead more anppealing or attractive. UI/gameplay design leads here.
- Decentralizing matchmaking.
  - Implement network topology leaving any coordination work external to network participants to be guaranteed to be completed within a reasonable time. This can be implemented using traditional spidering and probing automata.
  - Minimize the amount of work coordinating nodes are responsible for.
    - Facilitate independent querying and coordination by allowing nodes to act as independently addressable directories of services. Here's how you'd let players host their own web pages with `dns-sd`.
{% raw %}<p></p>{% endraw %}
{% raw %}<p></p>{% endraw %}
{% raw %}<p></p>{% endraw %}
{% highlight text %}
; Invite clients to browse this domain
b._dns-sd._udp	    	   	       PTR  	  @
lb.dns-sd._udp			       PTR  	  @

; Advertise our web page
_http._tcp			       PTR	Our\ Web\ Page._http._tcp
Our\ Web\ Page._http._tcp	       SRV	0 0 80 www
          			       TXT	path=/
{% endhighlight %}

### 3. Implement
Lots of open source tools here to help with implementation. `Go` and `Rust` are excellent systems languages with support for static and dynamic analysis of compilation and performance. Native interop is largely trivial with composable LLVM toolchains.

In order to write the next generation of applications we need to leverage several technologies. Whilst SMP is front-of-mind in today's programming languages, we must continue to develop sophisticated open protocols and tools to ease the development of systems that need them. These protocols can tranpsarently organize information for hands-free execution.