'use client'

import { useState } from 'react'

import { useSuccessUrl } from '@marketplace-web/auth-flow/success-url-feature'
import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import {
  GoogleTagManagerEvent,
  useGoogleTagManagerTrack,
} from '@marketplace-web/google-track/google-track-feature'

import { ResponseCode } from '@marketplace-web/core-api/api-client-util'
import {
  AuthenticateProvider,
  transformAuthenticateUserError,
  getCurrentUser,
  authenticateFailEvent,
  authenticateSuccessEvent,
} from '@marketplace-web/authentication/authentication-data'
import { useDataDomeCaptcha } from '@marketplace-web/bot-detection/data-dome-feature'
import { useSystemConfiguration } from '@marketplace-web/shared/system-configuration-data'
import {
  AuthExternalRegisterView,
  useAuthenticationContext,
} from '@marketplace-web/auth-flow/auth-context-feature'
import { useAuthTracking } from '@marketplace-web/auth-flow/auth-tracking-feature'

import useSocialLogin from '../../hooks/useSocialLogin/useSocialLogin'
import FacebookButton from '../FacebookButton'

type Props = {
  setError: (error?: string) => void
}

type SuccessFields = {
  email?: string
  birthday?: string
  gender?: string
  name?: string
  first_name?: string
  last_name?: string
}

const Facebook = ({ setError }: Props) => {
  const { track } = useTracking()
  const translate = useTranslate()
  const { googleTagManagerTrack } = useGoogleTagManagerTrack()
  const successUrl = useSuccessUrl()
  const authenticateSocial = useSocialLogin()
  const { trackClickEvent } = useAuthTracking()
  const userCountry = useSystemConfiguration()?.userCountry

  const [isLoading, setIsLoading] = useState(false)
  const [facebookToken, setFacebookToken] = useState('')
  const [facebookFields, setFacebookFields] = useState<SuccessFields>()
  const { handleViewExternalRegister, handleViewTwoFactorLogin } = useAuthenticationContext()

  const isFacebookRegistrationWithoutEmailEnabled = useFeatureSwitch(
    'facebook_registration_without_email',
  )

  function handleClick() {
    trackClickEvent({
      target: 'login_with_facebook',
      targetDetails: JSON.stringify({ country: userCountry }),
    })
  }

  function trackError(error: string) {
    track(authenticateFailEvent({ type: 'facebook', error, country: userCountry }))
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

  async function handleSuccess(token: string, fields: SuccessFields) {
    setFacebookToken(token)
    setFacebookFields(fields)
    setIsLoading(true)

    const response = await authenticateSocial(AuthenticateProvider.Facebook, token)
    const is2FARequired =
      response.code === ResponseCode.Required2FA ||
      response.code === ResponseCode.VerifierSecondFactorRequired

    if ('errors' in response) {
      // TODO: handle ResponseCode.SessionFromTokenError
      if (
        response.code === ResponseCode.NotFound &&
        (isFacebookRegistrationWithoutEmailEnabled || fields.email)
      ) {
        const realName =
          fields.name ||
          [fields.first_name, fields.last_name].filter(Boolean).join(' ') ||
          undefined

        handleViewExternalRegister({
          view: AuthExternalRegisterView.FacebookRegister,
          data: {
            idToken: token,
            realName,
            email: fields.email,
          },
        })
      } else if (
        response.code === ResponseCode.LoginWithoutEmail &&
        response.payload &&
        'control_code' in response.payload
      ) {
        handleLoginWithoutEmail(response.payload.control_code, fields.email)
      } else if (is2FARequired && response.payload) {
        handleViewTwoFactorLogin({
          ...transformAuthenticateUserError(response.payload),
          refUrl: successUrl,
        })

        return
      } else {
        if (fields.email) {
          trackError(response.message)
        } else {
          trackError("FB API didn't return an email")
        }

        setIsLoading(false)
        setError(response.message)
      }

      return
    }

    const getCurrentUserResp = await getCurrentUser()
    const userId = 'errors' in getCurrentUserResp ? undefined : getCurrentUserResp.user.id

    googleTagManagerTrack(GoogleTagManagerEvent.Login, {
      auth_type: 'facebook',
      user_email: fields.email,
    })
    track(authenticateSuccessEvent({ type: 'facebook', userId, country: userCountry }))
    navigateToPage(successUrl)
  }

  useDataDomeCaptcha(() => {
    if (!facebookToken || !facebookFields) return

    setError(undefined)
    handleSuccess(facebookToken, facebookFields)
  })

  function handleFailure() {
    trackError('User closed screen or did not provide permissions')
  }

  return (
    <FacebookButton
      text={translate('auth.select_type.actions.facebook')}
      isLoading={isLoading}
      onClick={handleClick}
      onSuccess={handleSuccess}
      onFailure={handleFailure}
    />
  )
}

export default Facebook
