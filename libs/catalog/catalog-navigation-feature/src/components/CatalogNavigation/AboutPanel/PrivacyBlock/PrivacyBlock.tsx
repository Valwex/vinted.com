'use client'

import { MouseEvent } from 'react'

import { useConsent, toggleOneTrustInfoDisplay } from '@marketplace-web/consent/consent-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { NAVIGATION_COOKIES_URL } from '@marketplace-web/catalog/catalog-data'
import { clickEvent } from '@marketplace-web/catalog/catalog-navigation-data'

import LinkCell from '../LinkCell'
import LinksGroup from '../LinksGroup'

const PrivacyBlock = () => {
  const translate = useTranslate('header.main_navigation.about')
  const { track } = useTracking()

  const { isCookieConsentVersion } = useConsent()

  const handleCookiesClick = (event: MouseEvent) => {
    event.preventDefault()
    toggleOneTrustInfoDisplay()

    track(
      clickEvent({
        target: 'cookie_settings',
        screen: 'about_menu',
      }),
    )
  }

  return (
    isCookieConsentVersion && (
      <LinksGroup title={translate('privacy.title')}>
        <LinkCell
          title={translate('privacy.items.cookies')}
          url={NAVIGATION_COOKIES_URL}
          onClick={handleCookiesClick}
          testId="about-panel-cookie-settings-button"
        />
      </LinksGroup>
    )
  )
}

export default PrivacyBlock
