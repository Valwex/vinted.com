'use client'

import { serverSide } from '@marketplace-web/environment/environment-util'
import { initializeAppHealth } from '@marketplace-web/observability/logging-util'

export function initialiseMonitoring() {
  if (serverSide) return
  if (process.env.NODE_ENV !== 'production') return

  const PRODUCTION_ENV = 'production'
  const SANDBOX_ENV = 'sandbox'

  // TODO: also check if run in local env to avoid triggering production logs locally
  const version = process.env.NEXT_PUBLIC_RELEASE_VERSION || 'unknown'
  const env = window.location.host.includes(SANDBOX_ENV) ? SANDBOX_ENV : PRODUCTION_ENV

  initializeAppHealth(process.env.NEXT_PUBLIC_SERVICE_CLIENT_NAME || 'core-next', version, env)
}
