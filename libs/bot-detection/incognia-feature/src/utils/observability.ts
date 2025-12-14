import { clientSideMetrics } from '@marketplace-web/observability/client-metrics-util'
import { logWarning } from '@marketplace-web/observability/logging-util'

const INCOGNIA_FEATURE_NAME = 'incognia'

export const logIncogniaWarning = (message: string, extra?: Record<string, unknown>) => {
  logWarning(message, {
    feature: INCOGNIA_FEATURE_NAME,
    extra: extra ? JSON.stringify(extra) : undefined,
  })
}

export const incogniaInitializationDurationTimer = () =>
  clientSideMetrics.histogram('web_incognia_initialization_duration').startTimer()
