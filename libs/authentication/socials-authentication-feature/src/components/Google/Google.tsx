'use client'

import { useCallback, useState } from 'react'

import { useSuccessUrl } from '@marketplace-web/auth-flow/success-url-feature'
import { useDataDomeCaptcha } from '@marketplace-web/bot-detection/data-dome-feature'
import {
  AuthenticateProvider,
  transformAuthenticateUserError,
  authenticateFailEvent,
  authenticateSuccessEvent,
  getCurrentUser,
} from '@marketplace-web/authentication/authentication-data'
import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { ResponseCode } from '@marketplace-web/core-api/api-client-util'
import {
  GoogleTagManagerEvent,
  useGoogleTagManagerTrack,
} from '@marketplace-web/google-track/google-track-feature'
import { useSystemConfiguration } from '@marketplace-web/shared/system-configuration-data'
import {
  AuthExternalRegisterView,
  useAuthenticationContext,
} from '@marketplace-web/auth-flow/auth-context-feature'
import { useAuthTracking } from '@marketplace-web/auth-flow/auth-tracking-feature'

import useSocialLogin from '../../hooks/useSocialLogin/useSocialLogin'
import GoogleOauthButton from '../GoogleOauthButton'
import { OnGoogleLoginSuccess } from '../../types/google'

type Props = {
  setError: (error?: string) => void
}

type SuccessFields = {
  email: string
  name?: string
}

const Google = ({ setError }: Props) => {
  const { track } = useTracking()
  const translate = useTranslate('auth.select_type')
  const { googleTagManagerTrack } = useGoogleTagManagerTrack()
  const [googleToken, setGoogleToken] = useState('')
  const [googleFields, setGoogleFields] = useState<SuccessFields>()
  const [decodedUrl, setDecodedUrl] = useState<string>()
  const successUrl = useSuccessUrl()
  const authenticateSocial = useSocialLogin()
  const { handleViewExternalRegister, handleViewTwoFactorLogin } = useAuthenticationContext()
  const { trackClickEvent } = useAuthTracking()
  const userCountry = useSystemConfiguration()?.userCountry

  function handleLoginWithoutEmail(controlCode: string, email?: string) {
    handleViewExternalRegister({
      view: AuthExternalRegisterView.PasswordVerification,
      data: {
        idToken: controlCode,
        email,
      },
    })
  }

  const handleButtonClick = () => {
    trackClickEvent({
      target: 'login_with_google',
      targetDetails: JSON.stringify({ country: userCountry }),
    })
  }

  const handleSuccess = async ({
    token,
    fields: { email, name },
    redirectUrl,
  }: OnGoogleLoginSuccess) => {
    setGoogleToken(token)
    setGoogleFields({ email, name })
    setDecodedUrl(redirectUrl)

    const response = await authenticateSocial(AuthenticateProvider.Google, token)
    const is2FARequired =
      response.code === ResponseCode.Required2FA ||
      response.code === ResponseCode.VerifierSecondFactorRequired

    if ('errors' in response) {
      // TODO: handle ResponseCode.SessionFromTokenError
      if (response.code === ResponseCode.NotFound) {
        handleViewExternalRegister({
          view: AuthExternalRegisterView.GoogleRegister,
          data: {
            idToken: token,
            realName: name,
            email,
          },
        })
      } else if (
        response.code === ResponseCode.LoginWithoutEmail &&
        response.payload &&
        'control_code' in response.payload
      ) {
        handleLoginWithoutEmail(response.payload.control_code, email)
      } else if (is2FARequired && response.payload) {
        handleViewTwoFactorLogin({
          ...transformAuthenticateUserError(response.payload),
          refUrl: successUrl,
        })
      } else {
        setError(response.message)
      }

      return
    }

    const getCurrentUserResp = await getCurrentUser()
    const userId = 'errors' in getCurrentUserResp ? undefined : getCurrentUserResp.user.id

    googleTagManagerTrack(GoogleTagManagerEvent.Login, {
      auth_type: 'google',
      user_email: email,
    })
    track(authenticateSuccessEvent({ type: 'google', userId, country: userCountry }))
    navigateToPage(redirectUrl || successUrl)
  }

  useDataDomeCaptcha(() => {
    if (!googleToken || !googleFields) return

    setError(undefined)
    handleSuccess({ token: googleToken, fields: googleFields, redirectUrl: decodedUrl })
  })

  const handleFailure = useCallback(() => {
    setError(translate('social_login_error'))
    track(
      authenticateFailEvent({
        type: 'google',
        error: 'User closed screen or did not provide permissions',
        country: userCountry,
      }),
    )
  }, [track, setError, translate, userCountry])

  return (
    <GoogleOauthButton
      onSuccess={handleSuccess}
      onFailure={handleFailure}
      onClick={handleButtonClick}
      redirectUri={successUrl}
    />
  )
}

export default Google
