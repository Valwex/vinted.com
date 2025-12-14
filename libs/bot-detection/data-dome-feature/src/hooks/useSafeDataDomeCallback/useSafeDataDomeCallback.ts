'use client'

import { useCallback, useEffect, useRef } from 'react'

import { useEnvs } from '@marketplace-web/environment/environment-util'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { logWarning } from '@marketplace-web/observability/logging-util'
import { DD_READY_EVENT } from '@marketplace-web/bot-detection/data-dome-util'

import useDataDomeContext from '../useDataDomeContext/useDataDomeContext'

const BACKUP_TIMEOUT = 5000

const useSafeDataDomeCallback = () => {
  const { isDataDomeScriptReady } = useDataDomeContext()
  const isDataDomeScriptReadyRef = useRef(isDataDomeScriptReady)
  const dataDomeClientSideKey = useEnvs('DATADOME_CLIENT_SIDE_KEY')
  const isDataDomeModuleEnabled = useFeatureSwitch('datadome_assessment')
  const isCallbackWhenDataDomeReadyEnabled = useFeatureSwitch('callback_when_datadome_ready')
  const backupTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    isDataDomeScriptReadyRef.current = isDataDomeScriptReady
  }, [isDataDomeScriptReady])

  const callbackWhenDataDomeReady = useCallback(
    (callback: () => Promise<void> | void) => {
      if (
        isDataDomeScriptReadyRef.current ||
        !isCallbackWhenDataDomeReadyEnabled ||
        !dataDomeClientSideKey ||
        !isDataDomeModuleEnabled
      ) {
        callback()

        return
      }

      const handleEventCallback = () => {
        callback()

        if (backupTimeoutRef.current) clearTimeout(backupTimeoutRef.current)

        logWarning(`${DD_READY_EVENT} event was received and callback finished`, {
          feature: 'safe-datadome-callback',
        })
      }

      window.addEventListener(DD_READY_EVENT, handleEventCallback, { once: true })

      backupTimeoutRef.current = setTimeout(() => {
        callback()

        window.removeEventListener(DD_READY_EVENT, handleEventCallback)

        logWarning(
          `${DD_READY_EVENT} event was not received in ${BACKUP_TIMEOUT}ms and callback finished manually`,
          {
            feature: 'safe-datadome-callback',
          },
        )
      }, BACKUP_TIMEOUT)
    },
    [dataDomeClientSideKey, isCallbackWhenDataDomeReadyEnabled, isDataDomeModuleEnabled],
  )

  return { callbackWhenDataDomeReady }
}

export default useSafeDataDomeCallback
