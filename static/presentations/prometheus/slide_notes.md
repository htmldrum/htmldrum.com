### Outline
# Slide 1
  - Safedome requirements
  - Assurance in banking integrations
# Slide 2
  - Cloud Native Computing Foundation project
    - Organization responsible for advancing the development of cloud native technology and services by creating a new set of common container technologies informed by technical merit and end user value, and inspired by Internet-scale computing. Optimized for modern distributed systems environments capable of scaling to tens of thousands of self healing multi-tenant nodes.
    - Lift application resilience and good development practises above the application layer. In the way 12 Factor gave us a vocabulary to split good deployment behaviors from the code, CNCF applications gives us language-agnostic patterns for scalability and flexibility in solution deployment
    - The more you can pull application behaviors above the application plane, the easier they are to implement generically and apply more broadly
    - Not applicable to the majority of applications but to highly trafficked applications with multiple development teams. Overkill if you're working on enterprise applications.
- Could/Should do talks on all these tools. Vital to running modern SASS
  - Lift application resilience and good development practises above the application layer
    - In the way 12 Factor gave us a vocabulary to split good deployment behaviors from the code, CNCF applications gives us language-agnostic patterns for scalability and flexibility in solution deployment
    - The more you can pull application behaviors above the application plane, the easier they are to implement generically and apply more broadly
    - Not applicable to the majority of applications but to highly trafficked applications
      - This is overkill if you're running an enterprise application with 1-1000 users
    - Implemented in sidecar services for nodes in Netflix (TODO think of other services)
  - In the way that gems encapsulate common language-level facilities and gives us a rising tide to to lift all boats - this tooling gives us that above the language level
    - Like HTTP semantics
    - Ruby still a great implementation language
    - Rails still a great framework for resource-oriented web service description
- https://www.cncf.io/ projects
  - CoreDNS - DNS service discovery for the cloud
  - Fluentd - Unified logging layer - collection and consumption
  - gRPC - 'RPC framework'
    - Write service definition
    - Generate Protocol buffers and clients for use
  - K8s
    - Automated deployment, scaling and management of containerized applications
  - Linkerd
    - Service mesh
    - Transparent proxy for service discovery, routing, failure handling and visibility
    - Runtime traffic routing
      -
  - OpenTracing
    - Vendor-netural open standard for distributed tracing
  - Prometheus
    - Metrics and alerting

# Slide 3
  - Lots of high profile users
    * Production readyness
    * Switching from Nagios/Munin installations
      - Better served by simpler logical model
      - Cloud-readyness
      - Replacing Munin, Nagios, Graphite/Statsd, Scope, OpenTSDB with single integrated stack
      - Timeseries defined by metric name and set of key/value dimensions. More flexible reporting and more layers
        - Application
        - Machine
        - Network

# Slide 4
- Nori Heikken gave a talk on time working as an SRE for Google and HealthCare.gov called Too Big To Fail
  - Things will always go wrong
    - You cannot predict what will go wrong next but you can make sure you have an appropriate strategy for response
  - Path to stable service provision is primarily governed by
    - Response - Incident Response and Monitoring
    - Analysis - Post Mortems
    - Preparation - Capacity planning and Testing/Release cycles
    - Sytem Design - UX and Development
  - What do we focus on?

# Slide 5
- Capacity Planning
- Query language flexible data model
  - Histogram of latency - bucketting response times
  - Disk usage projection
  - Which services are top 5 users of CPU?
  - Rulesets for each target scraped from site - store in TSDB
  - Use metrics, not checks, to get Big Data
  - Allow prometheus to aggregate data - it maintains state, not your service
- Manageability and reliabilty
  - Small footprint - 3.5b per data point
  - Millions of metrics
  - Hundreds of thousands of datapoints per second ~ 500K per second
  - Sharding / federation to scale out
- Capacity planning and ahead-of-time analysis is difficult with the current generation of tooling
- Prometheus aggregates and exports data at many levels - drawing inspiration from borgmon
  - Competitors to prometheus: Bosun, Heka, Riemann

# Slide 6
- Prometheus' main distinguishing features as compared to other monitoring systems are:
  - a multi-dimensional data model (timeseries defined by metric name and set of key/value dimensions)
  - a flexible query language to leverage this dimensionality
  - no dependency on distributed storage; single server nodes are autonomous
  - timeseries collection happens via a pull model over HTTP
  - pushing timeseries is supported via an intermediary gateway
  - targets are discovered via service discovery or static configuration
  - multiple modes of graphing and dashboarding support
  - support for hierarchical and horizontal federation
- Exporters
  - Google Analytics
  - Cloudwatch
  - Postgres
  - Ceph
  - Consul
  - Webdriver
- Move from blackbox to white box
  - Pingdom aliveness testing vs surfacing metrics through layers of calls
  - Not targeting a service - identified by a URL but collecting metrics on performance of fleet of services and composition
- Linear forecast vs absolute alerts
  - Monitoring storage capacity
- 3rd party integration
  - pagerduty, email, slack
- Alerting meta-data allows for auto-healing
  - Labelling

# Slide 7
- N/A

# Slide 8
  - Prometheus::Middleware::Exporter
        Exporter is a Rack middleware that provides a sample implementation of a
        Prometheus HTTP exposition endpoint.
                By default it will export the state of the global registry and expose it
        under `/metrics`. Use the `:registry` and `:path` options to change the
        defaults.
  - Prometheus::Middleware::Collector
        Collector is a Rack middleware that provides a sample implementation of a
        HTTP tracer.

        By default metrics are registered on the global registry. Set the
        `:registry` option to use a custom registry.

        The request counter metric is broken down by code, method and path by
        default. Set the `:counter_label_builder` option to use a custom label
        builder.

        The request duration metric is broken down by method and path by default.
        Set the `:duration_label_builder` option to use a custom label builder
- Ruby interface to prometheus server
  - Designed to be used with Rack-compliant frameworks - Rails, Grape, Sinatra
- 2 Rack middlewares:
  - Exposes a metrics endpoint for scraping by an Exporter (Prometheus Server component)
  - Trace all HTTP requests - Collector
  - ? What about a component to track all external requests?

# Slide 9
- Sketch of application
  - Walk through
    - Rails code
    - Prometheus config
    - Alertamanger config
    - Alerting rules
  - Screen casts
    - Kubernetes Dash
    - Prometheus Dash
    - Grafana
    - Prometeheus Demo
    - AlertManager

# Slide 10 - Alert configuration
- DSL for defining alerting rules
  - When alerts will fire
  - How long they fire for
  - Labels allow short, contextual information to be tagged to alerts
  - Annotations allow longer information such as descriptions or links to auto-healing runbooks or scripts to run in case the alert fires.
    - Clearing disk partitions
    - Restarting processes that consume too many inodes
    - Spinning up new workers or web servers
    - Or web hooks to update status pages
- Promtool parses rule sets to make sure they're syntactically valid. Alerting infrastructure should be checked into source control - can run promtool as part of CD/CI workflow

# Slide 11 - AlertManager
- Prometheus's alerting rules are good at figuring what is broken right now, but they are not a fully-fledged notification solution.
- Another layer is needed to add summarization, notification rate limiting, silencing and alert dependencies on top of the simple alert definitions.
- In Prometheus's ecosystem, the Alertmanager takes on this role.
- Thus, Prometheus may be configured to periodically send information about alert states to an Alertmanager instance, which then takes care of dispatching the right notifications. The Alertmanager instance may be configured via the -alertmanager.url command line flag.

# Slide 12 - Recording Rules
- Recording rules allow you to precompute frequently needed or computationally expensive expressions and save their result as a new set of time series.
Querying the precomputed result will then often be much faster than executing the original expression every time it is needed.
  - This is especially useful for dashboards, which need to query the same expression repeatedly every time they refresh.
- Has applications in request analysis / fraud detection

# Slide 14 - Remote Write
- Exporting data out of Prometheus is experimental
  - Curently uses custom Graphite solution for exporting graphing information
  - Remote Write API is the current, unstable solution for proxying data beyond the current custom integrations
- Useful in
  - Lambda architecture
    - High-throughput real-time queue processing with batch-processing
  - Long-term persistence
