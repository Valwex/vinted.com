'use client'

import { Divider, Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSystemConfiguration } from '@marketplace-web/shared/system-configuration-data'
import { AuthView, useAuthenticationContext } from '@marketplace-web/auth-flow/auth-context-feature'

const BusinessRegistrationLink = () => {
  const { authView } = useAuthenticationContext()
  const isLoginView = authView === AuthView.SelectTypeLogin
  const { businessAccountInformationalLinksVisible } = useSystemConfiguration() || {}

  const translate = useTranslate()

  if (!businessAccountInformationalLinksVisible || isLoginView) return null

  return (
    <>
      <Divider />
      <div className="u-ui-padding-horizontal-large u-ui-padding-vertical-x-large">
        <Text
          as="h4"
          type="caption"
          alignment="center"
          text={translate('auth.select_type.register.are_you_a_business')}
          width="parent"
          html
        />
      </div>
    </>
  )
}

export default BusinessRegistrationLink
