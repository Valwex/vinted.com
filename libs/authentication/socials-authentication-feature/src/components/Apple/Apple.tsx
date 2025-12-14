'use client'

import { useState } from 'react'

import { useSuccessUrl } from '@marketplace-web/auth-flow/success-url-feature'
import {
  AuthenticateProvider,
  transformAuthenticateUserError,
  authenticateFailEvent,
  authenticateSuccessEvent,
  getCurrentUser,
} from '@marketplace-web/authentication/authentication-data'
import { useDataDomeCaptcha } from '@marketplace-web/bot-detection/data-dome-feature'
import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import {
  GoogleTagManagerEvent,
  useGoogleTagManagerTrack,
} from '@marketplace-web/google-track/google-track-feature'

import { ResponseCode } from '@marketplace-web/core-api/api-client-util'
import { useSystemConfiguration } from '@marketplace-web/shared/system-configuration-data'
import {
  AuthExternalRegisterView,
  useAuthenticationContext,
} from '@marketplace-web/auth-flow/auth-context-feature'
import { useAuthTracking } from '@marketplace-web/auth-flow/auth-tracking-feature'

import useSocialLogin from '../../hooks/useSocialLogin/useSocialLogin'
import AppleButton from '../AppleButton'

type Props = {
  setError: (error?: string) => void
}

const Apple = ({ setError }: Props) => {
  const { track } = useTracking()
  const translate = useTranslate()

  const { googleTagManagerTrack } = useGoogleTagManagerTrack()
  const { trackClickEvent } = useAuthTracking()

  const [isLoading, setIsLoading] = useState(false)
  const [appleResponse, setAppleResponse] = useState<AppleSignInAPI.SignInResponseI>()
  const successUrl = useSuccessUrl()
  const authenticateSocial = useSocialLogin()
  const { handleViewExternalRegister, handleViewTwoFactorLogin } = useAuthenticationContext()
  const userCountry = useSystemConfiguration()?.userCountry

  function handleClick() {
    trackClickEvent({
      target: 'login_with_apple',
      targetDetails: JSON.stringify({ country: userCountry }),
    })
  }

  function trackError(message: string) {
    track(authenticateFailEvent({ type: 'apple', error: message, country: userCountry }))
  }

  function setExternalRegisterData(idToken: string, user: AppleSignInAPI.SignInResponseI['user']) {
    const realName = user?.name && `${user.name.firstName} ${user.name.lastName}`.trim()

    handleViewExternalRegister({
      view: AuthExternalRegisterView.AppleRegister,
      data: {
        idToken,
        realName,
        email: user?.email,
      },
    })
  }

  function handleLoginWithoutEmail(controlCode: string, email?: string) {
    handleViewExternalRegister({
      view: AuthExternalRegisterView.PasswordVerification,
      data: {
        idToken: controlCode,
        email,
      },
    })
  }

  async function handleSuccess(signInResponse: AppleSignInAPI.SignInResponseI) {
    setAppleResponse(signInResponse)
    setIsLoading(true)
    const {
      authorization: { id_token },
      user,
    } = signInResponse

    const response = await authenticateSocial(AuthenticateProvider.Apple, id_token)
    const is2FARequired =
      response.code === ResponseCode.Required2FA ||
      response.code === ResponseCode.VerifierSecondFactorRequired

    if ('errors' in response) {
      // TODO: handle ResponseCode.SessionFromTokenError
      if (
        response.code === ResponseCode.NotFound ||
        response.code === ResponseCode.ValidationError
      ) {
        setExternalRegisterData(id_token, user)
      } else if (
        response.code === ResponseCode.LoginWithoutEmail &&
        response.payload &&
        'control_code' in response.payload
      ) {
        handleLoginWithoutEmail(response.payload.control_code, user?.email)
      } else if (is2FARequired && response.payload) {
        handleViewTwoFactorLogin({
          ...transformAuthenticateUserError(response.payload),
          refUrl: successUrl,
        })

        return
      } else {
        setError(response.message)
        setIsLoading(false)
      }

      return
    }

    const getCurrentUserResp = await getCurrentUser()
    const userId = 'errors' in getCurrentUserResp ? undefined : getCurrentUserResp.user.id
    googleTagManagerTrack(GoogleTagManagerEvent.Login, {
      auth_type: 'apple',
      user_email: user?.email,
    })
    track(authenticateSuccessEvent({ type: 'apple', userId, country: userCountry }))
    navigateToPage(successUrl)
  }

  useDataDomeCaptcha(() => {
    if (!appleResponse) return

    setError(undefined)
    handleSuccess(appleResponse)
  })

  function handleFailure() {
    trackError('User closed screen or did not provide permissions')
  }

  return (
    <AppleButton
      text={translate('auth.select_type.actions.apple')}
      isLoading={isLoading}
      onClick={handleClick}
      onSuccess={handleSuccess}
      onFailure={handleFailure}
    />
  )
}

export default Apple
