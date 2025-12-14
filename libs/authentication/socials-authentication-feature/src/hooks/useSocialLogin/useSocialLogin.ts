import { useCallback } from 'react'

import { getFingerprint } from '@marketplace-web/session-management/audit-util'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { isBlockedByDataDome } from '@marketplace-web/bot-detection/data-dome-util'
import {
  AuthenticateGrantType,
  AuthenticateProvider,
  authenticateUser,
} from '@marketplace-web/authentication/authentication-data'
import { useIncogniaTracking } from '@marketplace-web/bot-detection/incognia-feature'

import { isNetworkError, isTimeoutError } from '../../utils/errors'

const useSocialLogin = () => {
  const translate = useTranslate('auth.select_type')
  const errorsTranslate = useTranslate('errors')
  const { trackIncogniaEvent } = useIncogniaTracking()

  const loginWithSocial = useCallback(
    async (provider: AuthenticateProvider, token: string) => {
      const fingerprint = await getFingerprint()

      const response = await authenticateUser({
        grantType: AuthenticateGrantType.Assertion,
        assertion: token,
        provider,
        fingerprint,
      })

      await trackIncogniaEvent({ tag: 'login' }, { response })

      if (isNetworkError(response)) {
        response.message = translate('errors.offline')
      }

      if (isTimeoutError(response)) {
        response.message = errorsTranslate('generic')
      }

      if (isBlockedByDataDome(response)) {
        response.message = translate('errors.datadome')
      }

      return response
    },
    [translate, errorsTranslate, trackIncogniaEvent],
  )

  return loginWithSocial
}

export default useSocialLogin
