import { useCallback } from 'react'

import {
  logBrazeError,
  logBrazeMessage,
  logConfigurationFailure,
  trackInitFailureMetrics,
} from '@marketplace-web/braze/braze-data'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useSession } from '@marketplace-web/shared/session-data'
import { useSystemConfiguration } from '@marketplace-web/shared/system-configuration-data'

import { FALLBACK_INITIALIZE_RETURN_VALUE, initializeBraze } from '../../initialize'
import { disableBraze } from '../../utils/async-utils'
import { removeAllDeferredBrazeCustomEvents } from '../../utils/custom-event'

const useInitializeBraze = (userExternalId: string | null | undefined) => {
  const { isWebview } = useSession()
  const { crm } = useSystemConfiguration() || {}
  const brazeConfig = crm?.brazeConfig
  const isBrazeEnabledFeatureSwitch = useFeatureSwitch('braze_sdk_enabled')
  const isLoggingToConsoleEnabled = useFeatureSwitch('web_braze_logging')
  const isLoggingToAppHealthEnabled = useFeatureSwitch('web_braze_log_app_health')
  const isBrazePushNotificationsEnabled = useFeatureSwitch('web_braze_push_notifications')
  const isNonErrorLoggingEnabled = useFeatureSwitch('web_braze_non_error_logging')
  const isBrazeInWebViewEnabled = useFeatureSwitch('braze_sdk_in_webview_enabled')
  const isCookieFSEnabled = useFeatureSwitch('braze_sdk_cookie_restriction_enabled')

  const isBrazeEnabled =
    isBrazeEnabledFeatureSwitch && ((isWebview && isBrazeInWebViewEnabled) || !isWebview)

  const { sdkEndpoint, sdkKey, safariWebsitePushId } = brazeConfig || {}

  return useCallback(async (): ReturnType<typeof initializeBraze> => {
    if (!isBrazeEnabled) {
      disableBraze()
      removeAllDeferredBrazeCustomEvents()

      return FALLBACK_INITIALIZE_RETURN_VALUE
    }

    if (!userExternalId || !sdkKey) {
      disableBraze()
      logConfigurationFailure({
        brazeSdkKey: sdkKey,
        userExternalId,
      })

      return FALLBACK_INITIALIZE_RETURN_VALUE
    }

    const isLoggingEnabled = isLoggingToAppHealthEnabled || isLoggingToConsoleEnabled

    const logger = (message: string) => {
      const errorKeywords = ['error', 'exception', 'fail', 'fatal']
      const isError = errorKeywords.some(keyword => message.toLowerCase().includes(keyword))

      if (isLoggingToAppHealthEnabled && (isNonErrorLoggingEnabled || isError)) {
        logBrazeMessage(`Braze_SDK_log: ${message}`)
      }

      // Default Braze behaviour that we want to keep
      // eslint-disable-next-line no-console
      if (isLoggingToConsoleEnabled) console.log(message)
    }

    return initializeBraze(
      {
        isCookieFSEnabled,
        userExternalId,
        apiKey: sdkKey,
        safariWebsitePushId: isBrazePushNotificationsEnabled ? safariWebsitePushId : undefined,
        baseUrl: sdkEndpoint || '',
        logger: isLoggingEnabled ? logger : undefined,
      },
      (error: unknown) => {
        disableBraze()
        if (error instanceof Error) {
          logBrazeError(error)
          trackInitFailureMetrics(error.message)
        }
      },
    )
  }, [
    isBrazeEnabled,
    isCookieFSEnabled,
    userExternalId,
    sdkKey,
    isLoggingToAppHealthEnabled,
    isLoggingToConsoleEnabled,
    isBrazePushNotificationsEnabled,
    safariWebsitePushId,
    sdkEndpoint,
    isNonErrorLoggingEnabled,
  ])
}

export default useInitializeBraze
