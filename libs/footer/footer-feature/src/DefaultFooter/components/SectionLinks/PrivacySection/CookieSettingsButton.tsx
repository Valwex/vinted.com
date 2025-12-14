'use client'

import { toggleOneTrustInfoDisplay } from '@marketplace-web/consent/consent-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { clickEvent } from '@marketplace-web/footer/footer-data'

type Props = {
  cookieSettingsText: string
}

const CookieSettingsButton = ({ cookieSettingsText }: Props) => {
  const { track } = useTracking()

  const handleCookieSettingsClick = () => {
    toggleOneTrustInfoDisplay()
    track(
      clickEvent({
        target: 'cookie_settings',
        screen: 'main_footer',
      }),
    )
  }

  return (
    <li className="main-footer__privacy-section-item">
      <button
        className="main-footer__privacy-section-link"
        type="button"
        onClick={handleCookieSettingsClick}
      >
        {cookieSettingsText}
      </button>
    </li>
  )
}

export default CookieSettingsButton
