'use client'

import { MouseEvent } from 'react'
import { Label } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useConsent, toggleOneTrustInfoDisplay } from '@marketplace-web/consent/consent-feature'
import { NAVIGATION_COOKIES_URL } from '@marketplace-web/catalog/catalog-data'

import OtherLink from '../OtherLink'

const Privacy = () => {
  const translate = useTranslate('header.main_navigation.about.privacy')

  const { isCookieConsentVersion } = useConsent()

  const handleCookiesClick = (event: MouseEvent) => {
    event.preventDefault()
    toggleOneTrustInfoDisplay()
  }

  if (!isCookieConsentVersion) return null

  return (
    <>
      <Label text={translate('title')} />
      <OtherLink
        url={NAVIGATION_COOKIES_URL}
        title={translate('items.cookies')}
        onClick={handleCookiesClick}
      />
    </>
  )
}

export default Privacy
