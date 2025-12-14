'use client'

import { Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { registerFacebookUser } from '@marketplace-web/registration/registration-data'
import { getFingerprint } from '@marketplace-web/session-management/audit-util'
import { redirectToPage } from '@marketplace-web/browser/browser-navigation-util'
import { useIncogniaTracking } from '@marketplace-web/bot-detection/incognia-feature'
import { useAuthenticationContext } from '@marketplace-web/auth-flow/auth-context-feature'

import RegisterForm, { FormData } from '../RegisterForm'
import RegistrationHelpLink from '../RegistrationHelpLink'
import { useRegistrationTracking } from '../../hooks/useRegistrationTracking/useRegistrationTracking'
import { REGISTER_SELECT_TYPE } from '../../constants/routes'

const FacebookRegister = () => {
  const translate = useTranslate()
  const trackRegistrationEvents = useRegistrationTracking()
  const { externalRegisterData, isAuthPage } = useAuthenticationContext()
  const { getIncogniaRequestHeaders, trackIncogniaEvent } = useIncogniaTracking()

  if (!externalRegisterData) {
    redirectToPage(REGISTER_SELECT_TYPE)

    return null
  }

  const { idToken, realName, email } = externalRegisterData

  async function handleFormSubmit(data: FormData) {
    const fingerprint = await getFingerprint()

    const response = await registerFacebookUser(
      {
        agreeRules: true,
        ...data,
        token: idToken,
        fingerprint,
      },
      { headers: await getIncogniaRequestHeaders() },
    )

    await trackIncogniaEvent({ tag: 'onboarding' }, { response })

    await trackRegistrationEvents({
      response,
      authType: 'facebook',
      email: data.email,
    })

    return response
  }

  return (
    <>
      <div className="u-ui-padding-horizontal-large">
        <Text
          as="h1"
          id="auth_modal_title"
          text={translate('auth.external_register.title')}
          type="heading"
          alignment={isAuthPage ? 'left' : 'center'}
          width="parent"
        />
      </div>
      <RegisterForm email={email} realName={realName} onSubmit={handleFormSubmit} />
      <RegistrationHelpLink />
    </>
  )
}

export default FacebookRegister
