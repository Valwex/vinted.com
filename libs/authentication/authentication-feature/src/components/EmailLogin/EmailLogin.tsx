'use client'

import { MouseEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Cell, InputText, Spacer, Text } from '@vinted/web-ui'

import { useSuccessUrl } from '@marketplace-web/auth-flow/success-url-feature'
import { getFingerprint } from '@marketplace-web/session-management/audit-util'
import {
  useDataDomeCaptcha,
  useSafeDataDomeCallback,
} from '@marketplace-web/bot-detection/data-dome-feature'
import { isBlockedByDataDome } from '@marketplace-web/bot-detection/data-dome-util'
import {
  AuthenticateGrantType,
  authenticateUser,
  oauth2UserLogin,
  transformAuthenticateUserError,
  getCurrentUser,
} from '@marketplace-web/authentication/authentication-data'
import {
  useBrowserNavigation,
  navigateToPage,
} from '@marketplace-web/browser/browser-navigation-util'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'

import {
  GoogleTagManagerEvent,
  useGoogleTagManagerTrack,
} from '@marketplace-web/google-track/google-track-feature'
import { ResponseCode } from '@marketplace-web/core-api/api-client-util'
import { useSession } from '@marketplace-web/shared/session-data'
import { useIncogniaTracking } from '@marketplace-web/bot-detection/incognia-feature'
import { useAbTest, useTrackAbTest } from '@marketplace-web/feature-flags/ab-tests-data'
import { AuthView, useAuthenticationContext } from '@marketplace-web/auth-flow/auth-context-feature'
import { useAuthTracking } from '@marketplace-web/auth-flow/auth-tracking-feature'

import PasswordField from '../PasswordField'
import { isNetworkError, isTimeoutError } from '../../utils/errors'
import {
  FORGOT_PASSWORD_URL,
  LOGIN_RESET_PASSWORD,
  SIGNUP_HELP_ENTRIES_URL,
} from '../../constants/routes'

type FormData = {
  username: string
  password: string
}

const EmailLogin = () => {
  const { login, login_challenge } = useBrowserNavigation().searchParams

  const username = typeof login === 'string' ? login : undefined
  const challenge = typeof login_challenge === 'string' ? login_challenge : undefined
  const [isLoading, setIsLoading] = useState(false)

  const translate = useTranslate('auth.email.login')
  const errorsTranslate = useTranslate('errors')
  const selectTypeTranslate = useTranslate('auth.select_type')
  const { register, handleSubmit } = useForm<FormData>({ defaultValues: { username } })
  const { googleTagManagerTrack } = useGoogleTagManagerTrack()
  const { setAuthView, handleViewTwoFactorLogin, isAuthPage } = useAuthenticationContext()
  const isOauth2Enabled = useFeatureSwitch('svc_iam_oauth_web')
  const { isWebview } = useSession()

  const [error, setError] = useState('')
  const [formData, setFormData] = useState<FormData>()
  const successUrl = useSuccessUrl()
  const { trackClickEvent } = useAuthTracking()
  const { trackIncogniaEvent } = useIncogniaTracking()
  const updatedLoginPlaceholderAbTest = useAbTest('updated_login_email_placeholder_web_2')
  const updatedLoginSpacingAbTest = useAbTest('updated_login_spacing_web_2')
  const isUpdatedLoginPlaceholderEnabled = updatedLoginPlaceholderAbTest?.variant === 'on'
  const isUpdatedLoginSpacingEnabled = updatedLoginSpacingAbTest?.variant === 'on'
  const updatedLoginSpacer = isUpdatedLoginSpacingEnabled ? 'x-large' : null

  useTrackAbTest(updatedLoginSpacingAbTest)
  useTrackAbTest(updatedLoginPlaceholderAbTest)

  const { callbackWhenDataDomeReady } = useSafeDataDomeCallback()

  function handleForgotPasswordClick(event: MouseEvent) {
    event.preventDefault()

    trackClickEvent({ target: 'switch_to_reset_password' })
    setAuthView(AuthView.ResetPassword)
  }

  async function authenticate(data: FormData) {
    const fingerprint = await getFingerprint()

    if (isOauth2Enabled && challenge) {
      return oauth2UserLogin({
        login: data.username,
        password: data.password,
        challenge,
        provider: 'credentials',
        fingerprint,
      })
    }

    return authenticateUser({
      grantType: AuthenticateGrantType.Password,
      username: data.username,
      password: data.password,
      fingerprint,
    })
  }

  async function performLogin(data: FormData) {
    setIsLoading(true)

    const response = await authenticate(data)
    const redirectUrl = 'redirect_to' in response ? (response.redirect_to as string) : successUrl

    const is2FARequired =
      response.code === ResponseCode.Required2FA ||
      response.code === ResponseCode.VerifierSecondFactorRequired

    await trackIncogniaEvent({ tag: 'login' }, { response })

    if (isNetworkError(response)) {
      setError(selectTypeTranslate('errors.offline'))
      setIsLoading(false)

      return
    }

    if (isTimeoutError(response)) {
      setError(errorsTranslate('generic'))
      setIsLoading(false)

      return
    }

    if (isBlockedByDataDome(response)) {
      setError(selectTypeTranslate('errors.datadome'))

      return
    }

    if (is2FARequired && 'payload' in response && response.payload) {
      handleViewTwoFactorLogin({
        ...transformAuthenticateUserError(response.payload),
        refUrl: successUrl,
      })

      return
    }

    if ('errors' in response) {
      // TODO: handle ResponseCode.SessionFromTokenError
      setError(response.message)
      setIsLoading(false)

      return
    }

    const userResp = await getCurrentUser()
    const user = 'errors' in userResp ? null : userResp.user

    googleTagManagerTrack(GoogleTagManagerEvent.Login, {
      auth_type: 'email',
      user_email: user?.email,
    })

    navigateToPage(redirectUrl)
  }

  function handleFormSubmit(data: FormData) {
    setIsLoading(true)
    setError('')
    setFormData(data)

    callbackWhenDataDomeReady(() => performLogin(data))
  }

  useDataDomeCaptcha(() => {
    if (!formData) return

    handleFormSubmit(formData)
  })

  function renderDescription() {
    return (
      <div className="u-ui-margin-horizontal-large">
        <Text
          as="h1"
          id="auth_modal_title"
          text={translate('title')}
          type="heading"
          width="parent"
          alignment={isAuthPage ? 'left' : 'center'}
        />
        <Spacer size={isAuthPage ? 'x-large' : updatedLoginSpacer ?? 'large'} />
        {!!error && (
          <Text as="span" text={error} theme="warning" width="parent" alignment="center" html />
        )}
      </div>
    )
  }

  function renderFields() {
    return (
      <>
        <InputText
          {...register('username', {
            required: true,
          })}
          placeholder={
            isUpdatedLoginPlaceholderEnabled
              ? translate('fields.login_updated')
              : translate('fields.login')
          }
          disabled={!!username}
        />
        {!!username && <input type="hidden" {...register('username')} value={username} />}
        <PasswordField
          {...register('password', {
            required: true,
          })}
          placeholder={translate('fields.password')}
        />
      </>
    )
  }

  function renderActions() {
    return (
      <Cell>
        <Button
          text={translate('actions.submit')}
          type="submit"
          styling="filled"
          disabled={isLoading}
          isLoading={isLoading}
          onClick={(event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
            if (isLoading) {
              event.preventDefault()
            }
          }}
        />
        <Spacer size="x-large" />
        <Text as="span" width="parent" alignment="center">
          <a
            data-testid="forgot-password-link"
            href={isAuthPage ? LOGIN_RESET_PASSWORD : FORGOT_PASSWORD_URL}
            onClick={handleForgotPasswordClick}
            className="u-disable-underline"
          >
            {translate('actions.forgot_password')}
          </a>
        </Text>
        <Spacer size={isAuthPage ? 'x-large' : updatedLoginSpacer ?? 'medium'} />
        <Text as="span" width="parent" alignment="center">
          <a
            className="u-disable-underline"
            href={SIGNUP_HELP_ENTRIES_URL}
            target={isWebview ? undefined : '_blank'}
            rel="noreferrer"
          >
            {translate('actions.help')}
          </a>
        </Text>
        <Spacer />
      </Cell>
    )
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {renderDescription()}
      {renderFields()}
      <Spacer />
      {renderActions()}
    </form>
  )
}

export default EmailLogin
