import { useCallback, useContext } from 'react'
import IncogniaWebSdk from '@incognia/web-sdk'

import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { stringToSha256 } from '@marketplace-web/crypto/crypto-util'
import { useSession } from '@marketplace-web/shared/session-data'
import type { ResponseError } from '@marketplace-web/core-api/api-client-util'

import { logIncogniaWarning } from '../../utils/observability'
import { CustomEventTag } from '../../types/sdk'
import { parseEventStatusFromResponse, parseUserIdFromResponse } from '../../utils/parsers'
import { IncogniaContext } from '../../containers/IncogniaContext'

const INCOGNIA_REQUEST_TOKEN_HEADER = 'X-Incognia-Request-Token'

export type IncogniaHeaders = Partial<{
  'X-Incognia-Request-Token': string
}>

const useIncogniaTracking = () => {
  const isIncogniaRequestTokenEnabled = useFeatureSwitch('web_incognia_request_token')
  const isIncogniaEventTrackingEnabled = useFeatureSwitch('web_incognia_event_tracking')
  const { user } = useSession()
  const incogniaContext = useContext(IncogniaContext)

  const getIncogniaRequestHeaders = useCallback(async (): Promise<IncogniaHeaders> => {
    if (!isIncogniaRequestTokenEnabled) return {}

    try {
      await incogniaContext?.initializationPromiseRef.current

      const token = await IncogniaWebSdk.generateRequestToken()

      return {
        [INCOGNIA_REQUEST_TOKEN_HEADER]: token,
      }
    } catch (error) {
      logIncogniaWarning('Error generating Incognia request token', { error: error.message })

      return {}
    }
  }, [incogniaContext, isIncogniaRequestTokenEnabled])

  const trackIncogniaEvent = useCallback(
    async (
      { tag }: { tag: CustomEventTag },
      { response }: { response: Record<string, unknown> | ResponseError },
    ) => {
      if (!isIncogniaEventTrackingEnabled) return

      try {
        const userId = user?.id || parseUserIdFromResponse(response)
        const status = parseEventStatusFromResponse(response)

        if (!status) return

        if (!userId && status === 'AUTHORIZED') {
          logIncogniaWarning('User ID is not available for the tracking event', {
            tag,
            response,
            userId: user?.id,
            status,
          })

          return
        }

        const hashedUserId = userId ? await stringToSha256(userId.toString()) : undefined

        await incogniaContext?.initializationPromiseRef.current

        await IncogniaWebSdk.sendCustomEvent({
          tag,
          accountId: hashedUserId,
          properties: { status },
        })
      } catch (error) {
        logIncogniaWarning('Error tracking Incognia event', {
          error: error.message,
          tag,
          typeofResponse: typeof response,
          responseKeys: response && Object.keys(response),
        })
      }
    },
    [incogniaContext, isIncogniaEventTrackingEnabled, user],
  )

  return { getIncogniaRequestHeaders, trackIncogniaEvent }
}

export default useIncogniaTracking
