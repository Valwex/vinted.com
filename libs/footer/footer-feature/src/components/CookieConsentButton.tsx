'use client'

import { PropsWithChildren } from 'react'

import { toggleOneTrustInfoDisplay } from '@marketplace-web/consent/consent-feature'

const CookieConsentButton = ({ children }: PropsWithChildren) => {
  return (
    <button
      type="button"
      onClick={toggleOneTrustInfoDisplay}
      className="main-footer__privacy-section-link"
    >
      {children}
    </button>
  )
}

export default CookieConsentButton
