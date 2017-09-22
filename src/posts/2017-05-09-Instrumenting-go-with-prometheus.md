---
title: Instrumenting Go with Prometheus
summary: Prometheus integration with Go projects is a quick way to get flexible metrics reporting for mission-critical systems.
categories: go prometheus
---
Runtime metrics collection with Prometheus seems like the most straight-forward approach out there. Whilst we've had a ton of approaches out there before, a scrape-based model that aggregates data into a central store that has options for monitoring and automatic recovery just makes sense. Instrumenting Go projects to use this is very easy. Here's how it's done.

# Step 1: Work out what metrics you want

It's important to back up the claims you make. In a Newtonian universe the only way you can do this is by constantly collecting data on the performance of the things you assert. If you can #X users per second, you need to have a reliable way to ask those #X users if they're using you. Enter Prometheus. After setting up metrics collection it provides libraries that are easy to integrate with your existing applications to track metrics that are important to your claims.

In a recent project, we decided we wanted to know the following things:
- 'Latency for mapping completion in ms' - How long did it take the mapping engine (whatever that is) to do its thing?
- 'Count of successful mapping completions' - For a given period of time, how many successes have we had?
- 'Count of failed mapping completions' - For a given period of time, how many failures have we had?

These questions translate directly into Prometheus metrics.

# Step 2: Creating the `/metrics` endpoint

All you need to do is specify the route name (whether that be `/metrics` or something more obscure) and the library provides a default implementation of common metrics

```go
import (
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

RunnerProducer = &s.OnefillServer{
  []*s.Endpoint{
    &s.Endpoint{
        "/metrics",
        promhttp.Handler(),
    },
    &s.Endpoint{
        "/",
        healthHandler(),
    },
    automation_dashboard.Driver,
    automation_dashboard.Drivers,
    automation_dashboard.Run,
    automation_dashboard.Runs,
    automation_dashboard.Site,
    automation_dashboard.Sites,
    automation_dashboard.Home,
    automation_dashboard.Add,
  },
}

```

# Step 3: Tell Prometheus what metrics you want tracked

At `init`, register the metrics as Prometheus data types. This way Prometheus is able to automatically provide value tracking. Also, we make sure we export the variables assigned to the metrics handlers so we may use them in other packages for recording.

```go
# runner/metrics.go
package runner

var (
    CompletionDurationFlowHistogram = prometheus.NewHistogram(prometheus.HistogramOpts{
        Name: 'completion_duration_histogram_ms',
        Help: 'Latency for mapping completion in ms',
        Buckets: prometheus.LinearBuckets(*normMean-5**normDomain, .5**normDomain, 20),
    })
    SuccessCounter = prometheus.NewCounter(prometheus.CounterOpts{
        Name: 'success_counter',
        Help: 'Count of successful mapping completions',
    })
    FailureCounter = prometheus.NewCounter(prometheus.CounterOpts{
        Name: 'failure_counter',
        Help: 'Count of failed mapping completions',
    })
)

func init() {
    prometheus.MustRegister(CompletionDurationFlowHistogram)
    prometheus.MustRegister(SuccessCounter)
    prometheus.MustRegister(FailureCounter)
}
```

# Step 4: Increment the counters in response to desired events

In my example, I want to record metrics after I know something has succeeded or failed. In your exmaples, you can attach metrics reporting to load balancers or caches or whatever you want to know about!

```go
# runner/site.go

import (
    mx "github.com/maxwellforest/onefill/prometheus/runner"
)
...
func (vr *VerRes) ExecuteFlows() ([]*WebDriverJob, error) {
    if !vr.Fetched() {
        return nil, fmt.Errorf("Flows not fetched for site_id %s", vr.site_id)
    }

    jobs := make([]*WebDriverJob, len(vr.flows))

    for n, f := range vr.flows {
        wdj := NewWebDriverJob(f.Url, vr.GetEngine, map[string]interface{}{})
        jobs[n] = wdj
    }

    results := RunJobs(jobs)

    var err error
    // Metrics recording
    for _, j := range results {
        if j.Failed() {
            mx.FailureCounter.Inc()
        } else {
            mx.SuccessCounter.Inc()
        }
        mx.CompletionDurationFlowHistogram.Observe(j.Duration())
    }

    if err != nil {
        return results, err
    }

    return results, nil
}

```

In the previous example, we call a method on a pointer to a VerificationResults (`VerRes`) object. This object contains a series of instructions to execute on a website. After it knows the result of each instruction execution, we iterate over the range of results and record, using the exported metric handlers, what the results were. At this stage, our Prometheus server is able to scrape our example service and update its records accordingly.

If you'd like to know more about Prometheus, check out [my recent talk](https://htmldrum.com/static/presentations/prometheus/index.html) on the subject.
