import { ClientMetrics } from '@vinted/client-metrics'

import { serverSide } from '@marketplace-web/environment/environment-util'
import { logMessage } from '@marketplace-web/observability/logging-util'

const MS_PER_SECOND = 1000

const getLabels = (labels: Record<string, string | number | boolean> | undefined) => {
  const DEFAULT_LABELS = {
    env:
      window.location.host.includes('sandbox') || window.location.host.includes('localhost')
        ? 'sandbox'
        : 'production',
  }

  return {
    ...DEFAULT_LABELS,
    ...labels,
  }
}

/**
 * Helpers for tracking client-side metrics. Can be used for SLOs, Grafana dashboards, alerting.
 * All metric names will be automatically prefixed with marketplace_web
 * Important: can only be used in client-side environment. Using the same metric name server-side and client-side will result in having 2 separate metrics.
 * Implemented through OpenTelemetry SDK which sends an event to our OpenTelemetry collector, which then forwards the metric to Prometheus.
 */
const clientSideMetrics = {
  /**
   * Counter is a metric that can only go up.
   * @param name - The name of the counter metric. It can be dynamic, but should not have high cardinality, such as user ids.
   * @param labels - Labels that will be applied to the metric in prometheus. Avoid high cardinality labels, such as user ids.
   * @param unit - The unit of the metric. It has to be compliant with OpenTelemetry instrument units: https://opentelemetry.io/docs/specs/semconv/general/metrics/#instrument-units
   *
   * @example
   * clientSideMetrics.counter('muted_video_autoplay').increment()
   */
  counter: (name: string, labels?: Record<string, string | number | boolean>, unit?: string) => {
    return {
      increment: (value = 1) => {
        if (serverSide) {
          logMessage(`Client side metric ${name} was used server-side`)

          return
        }

        ClientMetrics.counter({
          name,
          value,
          labels: getLabels(labels),
          unit,
        })
      },
    }
  },
  /**
   * Gauge is a metric that can go up and down.
   * @param name - The name of the gauge metric. It can be dynamic, but should not have high cardinality, such as user ids.
   * @param labels - Labels that will be applied to the metric in prometheus. Avoid high cardinality labels, such as user ids.
   * @param unit - The unit of the metric. It has to be compliant with OpenTelemetry instrument units: https://opentelemetry.io/docs/specs/semconv/general/metrics/#instrument-units
   *
   * @example
   * clientSideMetrics.gauge('simultaneous_conversations').set(42)
   */
  gauge: (name: string, labels?: Record<string, string | number>, unit?: string) => {
    return {
      set: (value: number) => {
        if (serverSide) {
          logMessage(`Client side metric ${name} was used server-side`)

          return
        }

        ClientMetrics.gauge({
          name,
          value,
          labels: getLabels(labels),
          unit,
        })
      },
    }
  },
  /**
   * Histogram is a metric type that counts how many times a value falls into a certain range (buckets)
   * Allows calculating percentiles, averages and other aggregations.
   * Commonly used for measuring duration, e.g. how long a loader is displayed
   * @param name - The name of the histogramic metric. It can be dynamic, but should not have high cardinality, such as user ids.
   * @param labels - Labels that will be applied to the metric in prometheus. Avoid high cardinality labels, such as user ids.
   * @param buckets - Buckets of the histogram. Depending on the buckets, the accuracy of aggregations (such as percentiles) will vary.
   * @param unit - The unit of the metric. It has to be compliant with OpenTelemetry instrument units: https://opentelemetry.io/docs/specs/semconv/general/metrics/#instrument-units
   *
   * @example
   * // Measuring how many messages were sent per conversation
   * clientSideMetrics.histogram('message_sent_per_conversation').observe()
   *
   * // Measuring duration of API requests
   * const stopMetricTimer = clientSideMetrics.histogram('home_page_parallel_requests_duration').startTimer()
   * await Promise.all(requests)
   * stopMetricTimer()
   */
  histogram: (
    name: string,
    labels?: Record<string, string | number | boolean>,
    buckets = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20],
    unit?: string,
  ) => {
    return {
      observe: (value: number) => {
        if (serverSide) {
          logMessage(`Client side metric ${name} was used server-side`)

          return
        }

        ClientMetrics.histogram({
          name,
          value,
          buckets,
          labels: getLabels(labels),
          unit,
        })
      },
      /**
       * Start a timer. Calling the returned function will observe the duration in
       * seconds in the histogram.
       * @param value - The value to set.
       * @return Function to invoke when timer should be stopped. The value it returns is the timed duration.
       */
      startTimer: () => {
        const startTime = performance.now()

        return () => {
          if (serverSide) {
            logMessage(`Client side metric ${name} was used server-side`)

            return 0
          }

          const endTime = performance.now()
          const value = (endTime - startTime) / MS_PER_SECOND

          clientSideMetrics.histogram(name, labels).observe(value)

          return value
        }
      },
    }
  },
}

export default clientSideMetrics
