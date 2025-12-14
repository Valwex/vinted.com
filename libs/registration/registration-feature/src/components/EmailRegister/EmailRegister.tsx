'use client'

import { Spacer, Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { getFingerprint } from '@marketplace-web/session-management/audit-util'
import { useIncogniaTracking } from '@marketplace-web/bot-detection/incognia-feature'

import { registerUser } from '@marketplace-web/registration/registration-data'
import { useAuthenticationContext } from '@marketplace-web/auth-flow/auth-context-feature'

import RegisterForm, { FormData } from '../RegisterForm'
import RegistrationHelpLink from '../RegistrationHelpLink'
import { useRegistrationTracking } from '../../hooks/useRegistrationTracking/useRegistrationTracking'

const TRANSLATION_PREFIX = 'auth.email.register'

const EmailRegister = () => {
  const translate = useTranslate(TRANSLATION_PREFIX)
  const trackRegistrationEvents = useRegistrationTracking()
  const { isAuthPage } = useAuthenticationContext()
  const { getIncogniaRequestHeaders, trackIncogniaEvent } = useIncogniaTracking()

  async function performRegistration(data: FormData) {
    const fingerprint = await getFingerprint()

    const response = await registerUser(
      {
        agreeRules: true,
        password: '',
        ...data,
        fingerprint,
      },
      { headers: await getIncogniaRequestHeaders() },
    )

    await trackIncogniaEvent({ tag: 'onboarding' }, { response })

    await trackRegistrationEvents({
      response,
      authType: 'internal',
      email: data.email,
    })

    return response
  }

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
        <Spacer size={isAuthPage ? 'x-large' : 'large'} />
      </div>
    )
  }

  return (
    <>
      {renderDescription()}
      <RegisterForm isPasswordRequired onSubmit={performRegistration} />
      <RegistrationHelpLink />
    </>
  )
}

export default EmailRegister
