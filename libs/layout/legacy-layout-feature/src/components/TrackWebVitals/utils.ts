import { type LCPMetric } from 'web-vitals'

import type { PageId } from '@marketplace-web/environment/page-configuration-util'
import { clientSideMetrics } from '@marketplace-web/observability/client-metrics-util'
import { getInitialBreakpoints } from '@marketplace-web/breakpoints/breakpoints-feature'
import { logMessage } from '@marketplace-web/observability/logging-util'

import { getLogNormalScore } from './math'
import { DEFAULT_DURATION_BUCKETS, SCORE_BUCKETS, WEB_VITALS_TRESHOLDS } from './constants'

export const deviceFromBreakpoints = () => {
  const breakpoints = getInitialBreakpoints()

  if (breakpoints.phones || breakpoints.tablets) return 'mobile'
  if (breakpoints.desktops) return 'desktop'

  return 'unknown'
}

type NavigatorWithConnection = Navigator & {
  connection?: {
    effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'
  }
}

const isNavigatorWithConnection = (navigator: Navigator): navigator is NavigatorWithConnection =>
  'connection' in navigator && typeof navigator.connection === 'object'

const FALLBACK_CONNECTION_TYPE = 'unknown'

export const getEffectiveConnectionType = () => {
  if (!('navigator' in globalThis)) return FALLBACK_CONNECTION_TYPE
  if (!isNavigatorWithConnection(globalThis.navigator)) return FALLBACK_CONNECTION_TYPE

  return globalThis.navigator.connection?.effectiveType ?? FALLBACK_CONNECTION_TYPE
}

function createLCPElementLogger() {
  const loggedElements = new Set<Element>()

  return async (metric: LCPMetric, page: PageId) => {
    try {
      const [{ element } = { element: null }] = metric.entries

      if (!element) return
      if (loggedElements.has(element)) return

      const { getCssSelector } = await import('css-selector-generator')

      const selector = getCssSelector(element, { selectors: ['tag', 'class', 'id'] })

      logMessage('Found LCP element', { extra: JSON.stringify({ selector, page }) })

      loggedElements.add(element)
      // eslint-disable-next-line no-empty
    } catch {}
  }
}

export const logLCPElement = createLCPElementLogger()

type ObserveHistogramMetricOptions = {
  labels: Record<string, string>
  prefix?: string
  suffix?: string
  buckets?: Array<number>
}

export function observeHistogramMetric(
  name: string,
  value: number,
  {
    labels,
    prefix = '',
    suffix = '',
    buckets = DEFAULT_DURATION_BUCKETS,
  }: { labels: Record<string, string>; prefix?: string; suffix?: string; buckets?: Array<number> },
) {
  const device = deviceFromBreakpoints()

  clientSideMetrics
    .histogram(`${prefix}${name}${suffix}`, { ...labels, device }, buckets)
    .observe(value)
}

export function observeScoreMetric(
  name: keyof typeof WEB_VITALS_TRESHOLDS,
  value: number,
  options: Omit<ObserveHistogramMetricOptions, 'buckets' | 'suffix'>,
) {
  const device = deviceFromBreakpoints()
  const strictDevice = device === 'unknown' ? 'desktop' : device

  const score = getLogNormalScore(WEB_VITALS_TRESHOLDS[name][strictDevice], value)

  observeHistogramMetric(name, score, {
    ...options,
    buckets: SCORE_BUCKETS,
    suffix: '_score',
  })
}
