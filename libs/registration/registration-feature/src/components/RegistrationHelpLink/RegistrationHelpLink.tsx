'use client'

import { Spacer, Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSession } from '@marketplace-web/shared/session-data'
import { useAuthTracking } from '@marketplace-web/auth-flow/auth-tracking-feature'

import useRegistrationBehaviourTracking from '../../hooks/useRegistrationBehaviourTracking'
import { SIGNUP_HELP_ENTRIES_URL } from '../../constants/routes'

const RegistrationHelpLink = () => {
  const translate = useTranslate('auth.email.register')
  const { trackClickEvent } = useAuthTracking()
  const { trackRegistrationBehaviourClick } = useRegistrationBehaviourTracking()
  const { isWebview } = useSession()

  const handleHelpClick = () => {
    trackRegistrationBehaviourClick({ actionDetails: 'registration-faq-link' })
    trackClickEvent({
      target: 'having_trouble',
    })
  }

  return (
    <div className="u-ui-margin-horizontal-large">
      <Text as="span" width="parent" alignment="center">
        <a
          href={SIGNUP_HELP_ENTRIES_URL}
          onClick={handleHelpClick}
          className="u-disable-underline"
          target={isWebview ? undefined : '_blank'}
          rel="noreferrer"
        >
          {translate('actions.help')}
        </a>
      </Text>
      <Spacer size="x-large" />
    </div>
  )
}

export default RegistrationHelpLink
