---
layout: post 
title: Service-Oriented Architecture
summary: SOA is a tool. It's not the solution.
categories: api-design soa architecture
---
The phrase "SOA" gets thrown about a lot. It's important to remember that it's a business buzz word. It's a framework for organizing web services that appeals to marketing and business types. They're able to logically partition work into 'services' that can be marketed by a wider organisation as 'products'. In reality, there is no logical partitioning of these 'services' into sepparate 'things': they are aspects, offering different logical presentation of the same underlying resource. This logical mapping provides a means for users to access

But agian: SOA is a *business model*, not guidance on *computer architecture*. It's advice is frequently contrary to the efficiently operating a system. This is the danger of modern infrastructure orchestration tools: they present a logical interface to networks of operating system but not an efficient one. It has appeal to marketers who are able to map evolving market trends to system domains in a predictable way.

There are alternative problem solving models: 
   - Ad Hoc Architecture. Features  and services are unplanned. Effort is allocated in clandestine ways. Managers will allocate developers to respond to perceived threats. Occam's Razor. Is useful when services are unsophisticated or short-lived.
   - Specific-Purpose Architecture - Here, a more dominant operational model determines the implementation of the solution. Conway's Law pervails here as organisations implement short-lived or niche systems for specific use. Proprietary algorithms and hardware protocols determine the allocation of specific hardware. More suited to problems that do not have the overhead of corporate pressures and time constraints. More suited to problems without a large degree of accountability or operational structure.
   - Resource-Oriented Architecture - Partitioning software use cases amongst competiting implementation teams with incongruent interfaces and concerns
   - Service-Oriented  Architecture - "Services" in an SOA are modules of business or application functionality with exposed interfaces, invoked by messages. 

Service-Oriented Architecture is useful is you have to provide a taxonomy of services with reliability guarantees. It helps organisations budget and implement standardised approaches to solving IT infrastructure needs. More organisations are turning to SOA as a response to increased demand for IT process integration - people automation in a very general, very real sense. Organisations begin by hiring a architect and technical team and delegate responsibility for change management entirely to that group. However, in order to get the most out of your IT dollar you must understand System Integration vs Service-Enabling.

# System Integration

In previous years we encouraged large amount of time to go between releases, punting integration work to before the system was to be used. We siloed process and people along taxonomies that were logical to the organisation. These lead mostly to failed projects and bad user experiences as integrations were left until the last minute. With agile we've taken on Service-Oriented agility were value is derived from pivoting development effort to the most value-creating exercises and repurposing existing services to meet new needs. Service Enabling views operational changes as common and provides facilities to enable clients to gracefully transition between service definitions in line with their terms of service.

# Service Goals
Organisations should aim for:
- Generally-applicable Services
- Well-Defined Service Contracts - for interfaces and availability
- Loosely Coupled interfaces with exportable representations
- Composability
- Discoverability
- Durablility
- Interoperablility
- Reusablility

# Service Model

It's important for organisations to develop a service model that describes the needs they will be expected to provide in a given period. This model should not be a drawing that gets stuffed in a draw somewhere, it should be interacted with by all employees. It should be used to solve problems, answer questions and resolve confusion about goals, strategy and implementation. Service interfaces become the lingua franca of operational staff and their experience in these domains inform the development process to enrich these private domains with new tools for expressivity.

With a well defined Service Architecture organisations are better able to face changing organizational technological needs.