'use client'

import { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import IncogniaWebSdk from '@incognia/web-sdk'

import { useEnvs } from '@marketplace-web/environment/environment-util'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useSession } from '@marketplace-web/shared/session-data'
import { stringToSha256 } from '@marketplace-web/crypto/crypto-util'

import { incogniaInitializationDurationTimer, logIncogniaWarning } from '../../utils/observability'
import { IncogniaContextValue } from '../../types/context'
import { IncogniaContext } from '../../containers/IncogniaContext'

const INCOGNIA_CUSTOM_DOMAIN = 'metrics.vinted.lt'

type Props = {
  children: ReactNode
}

const IncogniaScriptProvider = ({ children }: Props) => {
  const incogniaAppId = useEnvs('INCOGNIA_WEB_CLIENT_SIDE_KEY')
  const isIncogniaModuleEnabled = useFeatureSwitch('web_incognia_script')
  const { user } = useSession()
  const initializationPromiseRef = useRef<Promise<void> | null>(null)

  const setupAccountId = useCallback(async () => {
    if (user) {
      const encryptedUserId = await stringToSha256(user.id.toString())

      IncogniaWebSdk.setAccountId(encryptedUserId)

      return
    }

    IncogniaWebSdk.clearAccountId()
  }, [user])

  const initializeIncognia = useCallback(async () => {
    if (!incogniaAppId || !isIncogniaModuleEnabled) return

    const stopInitializationTimer = incogniaInitializationDurationTimer()

    try {
      await IncogniaWebSdk.init({ appId: incogniaAppId, customDomain: INCOGNIA_CUSTOM_DOMAIN })
      setupAccountId()
    } catch (error) {
      logIncogniaWarning('IncogniaWebSdk initialization failed', { error: error.message })
    }

    stopInitializationTimer()
  }, [incogniaAppId, setupAccountId, isIncogniaModuleEnabled])

  useEffect(() => {
    initializationPromiseRef.current = initializeIncognia()
  }, [initializeIncognia])

  useEffect(() => {
    if (!isIncogniaModuleEnabled || incogniaAppId) return

    logIncogniaWarning('Incognia web client side key is not set')
  }, [incogniaAppId, isIncogniaModuleEnabled])

  const contextValue = useMemo<IncogniaContextValue>(
    () => ({
      initializationPromiseRef,
    }),
    [initializationPromiseRef],
  )

  return <IncogniaContext.Provider value={contextValue}>{children}</IncogniaContext.Provider>
}

export default IncogniaScriptProvider
