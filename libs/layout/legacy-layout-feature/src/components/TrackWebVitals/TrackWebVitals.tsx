'use client'

import { useEffect, useRef, useState } from 'react'
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { PageId } from '@marketplace-web/environment/page-configuration-util'

import {
  getEffectiveConnectionType,
  logLCPElement,
  observeHistogramMetric,
  observeScoreMetric,
} from './utils'
import { CLS_BUCKETS, INP_BUCKETS } from './constants'

const MS_PER_SECOND = 1000

type Props = {
  screen: string
  pageId: PageId
  prefix?: string
  labels?: Record<string, string>
  disableSystemTimingEvent?: boolean
}

const TrackWebVitals = ({
  screen,
  pageId: page,
  prefix = '',
  labels,
  disableSystemTimingEvent,
}: Props) => {
  const { track } = useTracking()
  const isLcpTracked = useRef(false)
  // we are using `useState` here to initialise a client-only constant value
  // eslint-disable-next-line react/hook-use-state
  const [connection] = useState(getEffectiveConnectionType)

  useEffect(() => {
    onLCP(metric => {
      if (isLcpTracked.current) return

      const name = 'largest_contentful_paint'

      const observationOptions = {
        prefix,
        labels: { ...labels, page, connection },
      }

      observeHistogramMetric(name, metric.value / MS_PER_SECOND, observationOptions)
      observeScoreMetric(name, metric.value, observationOptions)

      logLCPElement(metric, page)

      if (disableSystemTimingEvent) return

      track({
        event: 'system.timing',
        extra: {
          section: name,
          duration: metric.value,
          completion_state: 'succeeded',
          data: screen,
        },
      })
      isLcpTracked.current = true
    })
  }, [screen, track, page, prefix, labels, disableSystemTimingEvent, connection])

  useEffect(() => {
    onCLS(metric => {
      const name = 'cumulative_layout_shift'

      const observationOptions = {
        buckets: CLS_BUCKETS,
        prefix,
        labels: { ...labels, page, connection },
      }

      observeHistogramMetric(name, metric.value, observationOptions)
      observeScoreMetric(name, metric.value, observationOptions)
    })
  }, [page, prefix, labels, connection])

  useEffect(() => {
    onINP(metric => {
      const name = 'interaction_to_next_paint'

      const observationOptions = {
        buckets: INP_BUCKETS,
        prefix,
        labels: { ...labels, page, connection },
      }

      observeHistogramMetric(name, metric.value / MS_PER_SECOND, observationOptions)
      observeScoreMetric(name, metric.value, observationOptions)
    })
  }, [page, prefix, labels, connection])

  useEffect(() => {
    onTTFB(metric => {
      const name = 'time_to_first_byte'

      const observationOptions = {
        prefix,
        labels: { ...labels, page, connection },
      }

      observeHistogramMetric(name, metric.value / MS_PER_SECOND, observationOptions)
    })
  }, [page, prefix, labels, connection])

  useEffect(() => {
    onFCP(metric => {
      const name = 'first_contentful_paint'

      const observationOptions = {
        prefix,
        labels: { ...labels, page, connection },
      }

      observeHistogramMetric(name, metric.value / MS_PER_SECOND, observationOptions)
      observeScoreMetric(name, metric.value, observationOptions)
    })
  }, [page, prefix, labels, connection])

  return null
}

export default TrackWebVitals
