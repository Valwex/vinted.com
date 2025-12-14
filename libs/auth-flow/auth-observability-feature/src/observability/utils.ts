import { clientSideMetrics } from '@marketplace-web/observability/client-metrics-util'
import { logError } from '@marketplace-web/observability/logging-util'
import { AuthExternalRegisterView, AuthView } from '@marketplace-web/auth-flow/auth-context-feature'

import { ComponentLocation, ErrorReason } from './constants'

export const handlePageLoadFailure = ({
  authView,
  componentLocation,
  reason,
  error,
}: {
  authView: AuthView | AuthExternalRegisterView
  componentLocation: ComponentLocation
  reason: ErrorReason
  error?: Error | null
}) => {
  const feature = `${componentLocation}_load_failure`

  clientSideMetrics.counter(feature, { auth_view: authView, reason }).increment()

  if (!(error instanceof Error)) return

  logError(error, { feature, extra: JSON.stringify({ auth_view: authView, reason }) })
}

export const incrementPageLoadInitiatedCounter = ({
  authView,
  componentLocation,
}: {
  componentLocation: ComponentLocation
  authView: AuthView | AuthExternalRegisterView
}) => {
  clientSideMetrics
    .counter(`${componentLocation}_load_initiated`, { auth_view: authView })
    .increment()
}
