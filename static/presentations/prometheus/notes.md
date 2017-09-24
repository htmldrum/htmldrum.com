 # TODO
x Finish talk
  x Licensing
  x Issues / Watchers / Stars / Contributors
  x Follow up talks
    x SoundCloud prometheus talk
  x Look through previous RoRo's to get a feel for what's been on offer
  x PromCon
x Do screen casts   x Screencasts for Presentation
  x Recording Rules
  x AlertManager
    x Firing Slack
    x Example queries
      x Sum of 500 or 400 series errors
      x Liveness x up/down
      x High request latency
      x kubelet_running_pod_count
  x Grafana
  x Prometheus
  x Rails custom metrics x /metrics endpoint / get/set
  x Kubernetes/Minikube integration
  - Postgresql Exporter

# Prometheus
## Proposal
- Motivation / Use Case
  - Monitoring
  - Alerting
  - Querying
  - Alternative to vendors / SASS
- What it is
  - For
    - Monitoring system and TSDB
    - Focus: Operational systems monitoring for dynamic cloud environments
  - Not for
    - log collection
      - Aggregators
    - request tracing
    - durable storage
    - user/auth mgmt
- Where it’s used
  - Rack middleware
  - Counter: Sum or value that can only go up
  - Gauge: Counts that can go up and down
  - Histogram: samples observations (usually things like request durations
               or response sizes) and counts them in configurable buckets
  - Summary: Histogram + sum over all observed values
  - https://prometheus.io/docs/concepts/metric_types/
- What it’s good for
- grafana integration
- How to use it in Rails
  - High frequency data input
  - Request logging
- Live example
- Libraries / Reference / Extra reading
  - Google Analytics exporter: https://github.com/infinityworksltd/gar-exporter
  - Cloudwatch exporter: https://github.com/prometheus/cloudwatch_exporter
  - Prometheus Ruby client: https://github.com/prometheus/client_ruby
  - Postgres exporter: https://github.com/wrouesnel/postgres_exporter
  - Ceph exporter: https://github.com/digitalocean/ceph_exporter
  - Consul exporter: https://github.com/prometheus/consul_exporter
  - Webdriver exporter: https://github.com/mattbostock/webdriver_exporter

## Outline
1. Start with CNCF toolset as a a collection of utilites to aid SASS
2. Prometheus description
3.

## Research
### Prometheus GitHub
  -
### Use in other projects
- KOPS
  - /Users/htmldrum/code/maxwellforest/kops/vendor/github.com/prometheus
- Kubernetes
  - /Users/htmldrum/code/maxwellforest/reference_provision/staging_1/kubernetes/docs/proposals/metrics-plumbing.md
- /Users/htmldrum/code/maxwellforest/kops/vendor/k8s.io/kubernetes/test/integration/metrics/metrics_test.go
- /Users/htmldrum/code//maxwellforest/kops/vendor/k8s.io/kubernetes/pkg/client/metrics/prometheus
- Kubelet
  - /Users/htmldrum/code/maxwellforest/kops/vendor/k8s.io/kubernetes/cmd/kubelet/kubelet.go: _ "k8s.io/kubernetes/pkg/client/metrics/prometheus"

- Google CAdvisor
  - /Users/htmldrum/code//maxwellforest/kops/vendor/github.com/google/cadvisor/collector/config/sample_config_prometheus.json
- Onefill
  - /Users/htmldrum/code//maxwellforest/onefill_provision/components/prometheus.md

A short recap of PromCon 2016, the first-ever Prometheus conference that took place in August 25-26 in Berlin.

### https://www.youtube.com/watch?v=fSJs-lvegtI
- `confd` - file-based configuration templating
- Prometheus as replacement for `Nagios` / `collectd`
  - Instead of writing probes (check scripts) as blackbox tests into the state of a system
  - Minimal configuration
- *is* a monitoring and alerting system for distributed systems and infrastructure
  - incident response
  - performance analysis
  - capacity planning
  - failure detection
- *is not* a long-term achival system, bi reporting or data-mining back end

### Alterting heartbeats - alerting on alerting https://docs.google.com/presentation/d/1xMnqKHNfBS1DWcnMQ6S3iTS10_DMISoDfNt6If4ihe4/pub?start=false&loop=false&delayms=3000#slide=id.p

### AlertManager
- Linear forecast vs absolute alerts
  - Monitoring storage capacity
- 3rd party integration
  - pagerduty, email, slack

### An introduction to monitoring and alerting with timeseries at scale with Prometheus - https://www.youtube.com/watch?v=gNmWzkGViAY
- Linux.conf.au
  - Alert of good practises for responding to alerts and
- Draws inspiration from borgmon
  - Large-scale cluster management at Google with Borg paper reveals secret sauce of borgmon for use in Prometheus
- Competitors to prometheus: Bosun, Heka, Riemann
- Rulesets for each target scraped from site - store in TSDB
- Effective metrics set up
  - Allow prometheus to aggregate data - it maintains state, not your service
  - Prefer numbers of text
  - Avoid timestamps
  - Initializa variables on program start
- Use labels to partition information
- github.com/jaqx0r/blts
- Recap
  - Use 'higher level abstractions' to lower cost of maintenace
  - Use metrics, not checks, to get Big Data
  - Design alerts based on Service Objectives

### CNCF - Cloud Native Computing Foundation
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

### client_ruby - https://github.com/prometheus/client_ruby
x Read 5 more articles
- Boot example repo
   x Monitoring kubernetes with prometheus
  - Grafana graphing
  - AlertManager
  - NodeExporter
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
- Example application: https://github.com/prometheus/client_ruby/blob/master/examples/rack/README.md
- Pushgateway
  - For use in batch jobs or where it's not feasible to let a Prometheus server scrape a process - instead you push the payload to the Prometheus server
  - https://github.com/prometheus/client_ruby/blob/master/examples/rack/README.md#pushgateway
- Metric types
  - Counter
  - Gauge
  - Histogram
    - Bucketting
    - Mention the Strange Loop talk on histogram libraries
  - Summary
- Benefits above using Redis as a generic shared data structure
  - Adds statistical calculations
  - Adds value classes, semantics for values relevant to an application

### prometheus - https://github.com/prometheus/prometheus
- Prometheus' main distinguishing features as compared to other monitoring systems are:
  - a multi-dimensional data model (timeseries defined by metric name and set of key/value dimensions)
  - a flexible query language to leverage this dimensionality
  - no dependency on distributed storage; single server nodes are autonomous
  - timeseries collection happens via a pull model over HTTP
  - pushing timeseries is supported via an intermediary gateway
  - targets are discovered via service discovery or static configuration
  - multiple modes of graphing and dashboarding support
  - support for hierarchical and horizontal federation

### node_exporter - https://github.com/prometheus/node_exporter
- Prometheus exporter for hardware and OS metrics for Nix kernels
  - LOTS of options for

### minikube-prometheus-demo - https://github.com/bakins/minikube-prometheus-demo
- Minikube
  - Local version of kubernetes for running containers in a kubernetes environment
  - `minikube start --vm-driver=xhyve`
  - `minikube dashboard`
- Deploy k8s services into the monitoring namespace
  - `kubectl create -f monitoring-namespace.yaml`
- Use config map to define prometheus config (pretty much defaults)
  - `kubectl create -f prometheus-config.yaml`
- Expose prometheus deployment
  - `kubectl create -f prometheus-deployment.yaml`
- Expose the service
  - `kubectl create -f prometheus-service.yaml`
- Deploy grafana
  - `kubectl create -f grafana-deployment.yml && kubectl create -f grafana-service.yml`
- Expand definition to daemon set
  - `kubectl create -f node-exporter-daemonset.yml`
### Monitoring Kubernetes with Prometheus - https://github.com/bakins/minikube-prometheus-demo
- Monitoring is the base of the hierarchy of reliability
  - https://coreos.com/blog/monitoring-kubernetes-with-prometheus.html
    - "Monitoring is a must have for responding to incidents, detecting and debugging systemic problems, planning for the future, and generally understanding your infrastructure."
      - https://www.infoq.com/news/2015/06/too-big-to-fail
      - Modelling ahead of time is essential, and techniques such as load testing, capacity planning and regression analysis allow an SRE team to understand how the system should behave given specific conditions.
    - It’s not enough to watch load and activity on a particular machine when the work assigned to that machine may change with the requirements of the cluster and application as a whole. If your architecture is designed to allow for processes to fail, you can’t tell if a failure is critical by monitoring individual processes.

### Prometheus GitHub documentation - https://github.com/prometheus/docs
- Prometheus is pretty cool

### https://www.youtube.com/watch?v=cwRmXqXKGtk
- Move from blackbox to white box
  - Pingdom aliveness testing vs surfacing metrics through layers of calls
  - Not targeting a service - identified by a URL but collecting metrics on performance of fleet of services and composition
- Query language flexible data model
  - Histogram of latency - bucketting response times
  - Disk usage projection
  - Which services are top 5 users of CPU?
- Manageability and reliabilty
  - Small footprint - 3.5b per data point
  - Millions of metrics
  - Hundreds of thousands of datapoints per second ~ 500K per second
  - Sharding / federation to scale out
  - https://github.com/RobustPerception/demo_prometheus_ansible

### Linkerd - http://linkerd.io

### OpenTracing - http://Opentracing.io
- Developers and engineering organizations are trading in old, monolithic systems for modern microservice architectures, and they do so for numerous compelling reasons: system components scale independently, dev teams stay small and agile, deployments are continuous and decoupled, and so on.
- docker run --rm -ti -p 8080:8080 -p 8700:8700 bg451/opentracing-example

### RED monitoring - https://www.weave.works/prometheus-and-kubernetes-monitoring-your-applications/
Request rate, Error rate and request Duration,

### USE monitoring - http://www.brendangregg.com/usemethod.html

### Minikube commands

### https://github.com/RobustPerception/demo_prometheus_ansible

