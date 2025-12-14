'use client'

import Script from 'next/script'
import { useEffect, useRef } from 'react'
import { useEventListener } from 'usehooks-ts'

import { useEnvs } from '@marketplace-web/environment/environment-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { logWarning } from '@marketplace-web/observability/logging-util'
import { dataDomeScriptActionEvent } from '@marketplace-web/bot-detection/data-dome-data'
import { getFingerprint } from '@marketplace-web/session-management/audit-util'
import {
  DD_BLOCKED_EVENT,
  DD_READY_EVENT,
  DD_RESPONSE_DISPLAYED_EVENT,
  DD_RESPONSE_ERROR_EVENT,
  DD_RESPONSE_UNLOAD_EVENT,
  dataDomeInitializationTimer,
} from '@marketplace-web/bot-detection/data-dome-util'

const SCRIPT_SOURCE = {
  LATEST: 'https://dd.vinted.lt/tags.js',
  SANDBOX: 'https://static-assets.vinted.com/datadome/5.1.10/tags.js',
  PRODUCTION: 'https://static-assets.vinted.com/datadome/5.1.9/tags.js',
}

const DataDomeScript = () => {
  const { track } = useTracking()
  const blockedEndpoint = useRef('')

  const dataDomeClientSideKey = useEnvs('DATADOME_CLIENT_SIDE_KEY')
  const isDataDomeModuleEnabled = useFeatureSwitch('datadome_assessment')
  const isScriptTrackingEnabled = useFeatureSwitch('datadome_script_tracking')
  const isOverrideAbortFetchEnabled = useFeatureSwitch('datadome_web_override_abort_fetch')
  const isSandboxScriptSourceEnabled = useFeatureSwitch('datadome_sandbox_script_source')
  const isProductionScriptSourceEnabled = useFeatureSwitch('datadome_production_script_source')

  const getScriptSource = () => {
    if (isSandboxScriptSourceEnabled) return SCRIPT_SOURCE.SANDBOX
    if (isProductionScriptSourceEnabled) return SCRIPT_SOURCE.PRODUCTION

    return SCRIPT_SOURCE.LATEST
  }

  const datadomeOptions = {
    ajaxListenerPath: true,
    disableAutoRefreshOnCaptchaPassed: true,
    enableTagEvents: true,
    abortAsyncOnCaptchaDisplay: false,
    endpoint: 'https://dd.vinted.lt/js',
    overrideAbortFetch: isOverrideAbortFetchEnabled,
  }

  const getCommonTrackingData = async () => {
    return {
      fingerprint: await getFingerprint(),
      endpointName: blockedEndpoint.current,
    }
  }

  useEventListener(DD_BLOCKED_EVENT, async event => {
    if (!isScriptTrackingEnabled) return

    blockedEndpoint.current = event.detail.url

    const commonTrackingData = await getCommonTrackingData()

    track(dataDomeScriptActionEvent({ ...commonTrackingData, actionType: 'blocked' }))
  })

  useEventListener(DD_RESPONSE_DISPLAYED_EVENT, async event => {
    if (!isScriptTrackingEnabled) return

    const trackingData = await getCommonTrackingData()

    track(
      dataDomeScriptActionEvent({
        ...trackingData,
        actionType: 'response_displayed',
        responseType: event.detail.responseType,
      }),
    )
  })

  useEventListener(DD_RESPONSE_UNLOAD_EVENT, async event => {
    if (!isScriptTrackingEnabled) return

    const commonTrackingData = await getCommonTrackingData()

    track(
      dataDomeScriptActionEvent({
        ...commonTrackingData,
        actionType: 'response_passed',
        responseType: event.detail.responseType,
      }),
    )
  })

  useEventListener(DD_RESPONSE_ERROR_EVENT, async () => {
    if (!isScriptTrackingEnabled) return

    const commonTrackingData = await getCommonTrackingData()

    track(dataDomeScriptActionEvent({ ...commonTrackingData, actionType: 'response_error' }))
  })

  useEffect(() => {
    if (!isDataDomeModuleEnabled || dataDomeClientSideKey) return

    logWarning('DataDome client-side key is not set')
  }, [dataDomeClientSideKey, isDataDomeModuleEnabled])

  useEffect(() => {
    const stopInitializationTimer = dataDomeInitializationTimer()

    window.addEventListener(DD_READY_EVENT, stopInitializationTimer)

    return () => {
      window.removeEventListener(DD_READY_EVENT, stopInitializationTimer)
    }
  }, [isDataDomeModuleEnabled, dataDomeClientSideKey])

  if (!isDataDomeModuleEnabled) return null
  if (!dataDomeClientSideKey) return null

  return (
    <Script id="data-dome-script" strategy="afterInteractive">
      {`!function(a,b,c,d,e,f){a.ddjskey=e;a.ddoptions=f||null;var m=b.createElement(c),n=b.getElementsByTagName(c)[0];m.async=1,m.src=d,n.parentNode.insertBefore(m,n)}(window,document,"script","${getScriptSource()}","${dataDomeClientSideKey}", ${JSON.stringify(
        datadomeOptions,
      )});`}
    </Script>
  )
}

export default DataDomeScript
