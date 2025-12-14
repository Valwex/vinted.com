'use client'

import { Button, Spacer, Text } from '@vinted/web-ui'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

import { useSuccessUrl } from '@marketplace-web/auth-flow/success-url-feature'
import { getFingerprint } from '@marketplace-web/session-management/audit-util'
import { useDataDomeCaptcha } from '@marketplace-web/bot-detection/data-dome-feature'
import {
  AuthenticateGrantType,
  transformAuthenticateUserError,
  authenticateUser,
} from '@marketplace-web/authentication/authentication-data'
import { navigateToPage, redirectToPage } from '@marketplace-web/browser/browser-navigation-util'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'
import {
  renderValidation,
  useFormValidationMessage,
} from '@marketplace-web/vendor-abstractions/react-hook-form-feature'

import { HelpCenterFaqEntryUrl } from '@marketplace-web/help-center/help-center-faq-entry-url-feature'
import {
  AccessChannel,
  FaqEntryType,
} from '@marketplace-web/help-center/help-center-faq-entry-url-data'
import { ResponseCode } from '@marketplace-web/core-api/api-client-util'
import { useRefUrl } from '@marketplace-web/ref-url/ref-url-feature'
import { useIncogniaTracking } from '@marketplace-web/bot-detection/incognia-feature'
import { useAuthenticationContext } from '@marketplace-web/auth-flow/auth-context-feature'
import { useAuthTracking, UserTarget } from '@marketplace-web/auth-flow/auth-tracking-feature'

import PasswordField from '../PasswordField'
import { FORGOT_PASSWORD_URL, REGISTER_SELECT_TYPE, ROOT_URL } from '../../constants/routes'

type Fields = {
  password: string
}

const PasswordVerificationLogin = () => {
  const translate = useTranslate('user.wrong_email_in_registration')
  const refUrl = useRefUrl(ROOT_URL)
  const successUrl = useSuccessUrl()
  const {
    register,
    formState: { errors },
    setError,
    handleSubmit,
  } = useForm<Fields>()
  const getErrorMessage = useFormValidationMessage(errors)
  const { trackInputEvent, trackClickEvent } = useAuthTracking()
  const { handleViewTwoFactorLogin, externalRegisterData, isAuthPage } = useAuthenticationContext()
  const { trackIncogniaEvent } = useIncogniaTracking()

  const { idToken, email } = externalRegisterData || {}

  const doAuthenticate = async ({ password }: Fields) => {
    if (!email) return

    const fingerprint = await getFingerprint()

    const response = await authenticateUser({
      grantType: AuthenticateGrantType.Password,
      username: email,
      controlCode: idToken,
      password,
      fingerprint,
    })
    const is2FARequired =
      response.code === ResponseCode.Required2FA ||
      response.code === ResponseCode.VerifierSecondFactorRequired

    await trackIncogniaEvent({ tag: 'login' }, { response })

    if (is2FARequired && 'payload' in response && response.payload) {
      handleViewTwoFactorLogin({
        ...transformAuthenticateUserError(response.payload),
        refUrl: successUrl,
      })

      return
    }

    if ('errors' in response) {
      setError('password', { type: 'manual', message: response.message })

      return
    }

    navigateToPage(refUrl)
  }

  useDataDomeCaptcha(() => {
    handleSubmit(doAuthenticate)()
  })

  useEffect(() => {
    if (externalRegisterData) {
      return
    }

    redirectToPage(REGISTER_SELECT_TYPE)
  }, [externalRegisterData])

  const handleInputFocus = (target: string) => () => trackInputEvent({ target, state: 'focus' })

  const handleInputBlur = (target: string) => () => trackInputEvent({ target, state: 'unfocus' })

  const getInputEvents = (field: string) => {
    return {
      onFocus: handleInputFocus(field),
      onBlur: handleInputBlur(field),
    }
  }

  const handleClickTracking = (target: UserTarget) => () => {
    trackClickEvent({ target })
  }

  const renderLink = ({
    url,
    text,
    eventTarget,
  }: {
    url: string
    text: string
    eventTarget: UserTarget
  }) => (
    <Text as="span" width="parent" alignment="center">
      <a
        className="u-disable-underline"
        href={url}
        target="_blank"
        rel="noreferrer"
        onClick={handleClickTracking(eventTarget)}
      >
        {text}
      </a>
    </Text>
  )

  const renderContactUsLink = (url: string) =>
    renderLink({ url, text: translate('contact_us'), eventTarget: 'having_trouble' })

  const renderPasswordResetLink = (url: string) =>
    renderLink({
      url,
      text: translate('reset_password'),
      eventTarget: 'forgot_password',
    })

  return (
    <form onSubmit={handleSubmit(doAuthenticate)}>
      {!isAuthPage && <Spacer size="large" />}
      <div className="u-ui-margin-horizontal-large">
        <Text
          as="h1"
          text={translate('heading', { registration_email: email })}
          alignment={isAuthPage ? 'left' : 'center'}
          width="parent"
          type="heading"
        />
      </div>
      {isAuthPage ? (
        <Spacer size="x-large" />
      ) : (
        <>
          <Spacer size="x2-large" />
          <Spacer />
        </>
      )}
      <div className="u-ui-margin-horizontal-large">
        <Text
          text={translate('error_explanation', {
            registration_email: <Text key="registration-email" as="span" text={email} bold />,
          })}
          as="p"
        />
      </div>
      {isAuthPage && <Spacer />}
      <PasswordField
        {...register('password')}
        placeholder={translate('placeholder')}
        validation={renderValidation(getErrorMessage('password'))}
        {...getInputEvents('password')}
      />
      <Spacer size={isAuthPage ? 'regular' : 'large'} />
      <SeparatedList separator={<Spacer size="x-large" />}>
        <div className="u-ui-margin-horizontal-large">
          <Button
            testId="login-button"
            type="submit"
            text={translate('button', { registration_email: email })}
            styling="filled"
            onClick={handleClickTracking('social_login_with_password')}
          />
        </div>
        {renderPasswordResetLink(FORGOT_PASSWORD_URL)}
        <HelpCenterFaqEntryUrl
          type={FaqEntryType.CantLogin}
          accessChannel={AccessChannel.ProductLink}
          render={url => renderContactUsLink(url)}
        />
      </SeparatedList>
      <Spacer size="x-large" />
    </form>
  )
}

export default PasswordVerificationLogin
