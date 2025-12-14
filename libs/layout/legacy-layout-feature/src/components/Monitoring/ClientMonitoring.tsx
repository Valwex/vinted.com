'use client'

import { useEffect } from 'react'
import { ClientMetrics } from '@vinted/client-metrics'

import {
  clientSideMetrics,
  getInjectedOtelToken,
} from '@marketplace-web/observability/client-metrics-util'
import { PageId } from '@marketplace-web/environment/page-configuration-util'

import { serverSide } from '@marketplace-web/environment/environment-util'

import { universalEnvs } from '@marketplace-web/environment/environment-util/server'

import { initialiseMonitoring } from './utils'

initialiseMonitoring()

if (!serverSide) {
  const isSandbox =
    window.location.host.includes('sandbox') || window.location.host.includes('localhost')

  const params = new URLSearchParams(window.location.search)
  const isOtelTestEnabled = params.get('otel_test') !== null

  const env = isSandbox ? 'sandbox' : 'production'
  const samplingRate = 1

  // TODO: Setup as a single env variable on kube-rollout
  // and control `collectorUrl` through there.
  const collectorUrl = isSandbox
    ? process.env.NEXT_PUBLIC_OTEL_COLLECTOR_SANDBOX_URL
    : process.env.NEXT_PUBLIC_OTEL_COLLECTOR_URL
  const injectedOtelToken = getInjectedOtelToken()

  if (collectorUrl && injectedOtelToken) {
    ClientMetrics.initialize({
      serviceName: 'marketplace_web',
      version: process.env.NEXT_PUBLIC_RELEASE_VERSION,
      samplingRate: isOtelTestEnabled ? 1 : samplingRate,
      collectorUrl,
      env,
      token: injectedOtelToken,
      shouldUseBeacon: Boolean(universalEnvs.SHOULD_USE_BEACON_FLAG),
    })
  }
}

type Props = {
  pageId: PageId
}

const Monitoring = ({ pageId }: Props) => {
  useEffect(() => {
    clientSideMetrics.counter('page_load', { page: pageId }).increment()
  }, [pageId])

  return null
}

export default Monitoring
