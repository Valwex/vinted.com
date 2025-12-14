import { isUndefined, omitBy } from 'lodash'

import { logError, logMessage } from '@marketplace-web/observability/logging-util'
import { clientSideMetrics } from '@marketplace-web/observability/client-metrics-util'

const HOME_PREFIX = 'Home'
const MS_PER_SECOND = 1000

export const logHomeError = (error: Error | null, feature?: string) => {
  if (!(error instanceof Error)) return

  const loggedFeature = feature ? `${HOME_PREFIX}_${feature}` : HOME_PREFIX

  logError(error, { feature: loggedFeature })
}

export const logHomeMessage = (message: string, extra?: string) => {
  logMessage(message, { feature: HOME_PREFIX, extra })
}

export const incrementPageLoadFailureCounter = (labels: {
  tab: string
  homepage_reason: string
}) => {
  clientSideMetrics
    .counter('home_page_client_load_failure', omitBy(labels, isUndefined))
    .increment()
}

const BUCKETS = [0.05, 0.1, 0.15, 0.25, 0.4, 0.6, 0.8, 1, 1.2, 1.6, 2, 3.5, 5, 7, 10]

export const observeFetchDuration = (
  loadTimeMs: number,
  labels: {
    isError: boolean
    isFirstPage?: boolean
  },
) => {
  clientSideMetrics
    .histogram(
      'home_page_client_load_duration',
      {
        state: labels.isError ? 'failure' : 'success',
      },
      BUCKETS,
    )
    .observe(loadTimeMs / MS_PER_SECOND)
}
