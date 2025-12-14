'use client'

import { useEffect, useState } from 'react'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useUserAgent } from '@marketplace-web/environment/request-context-data'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

import { CmpAction, userCmpActionEvent } from '../../tracking/events'
import useLoadConsentBanner from '../../hooks/useLoadConsentBanner'
import { isMobile } from '../../utils/is-mobile'

const ConsentBannerTracker = () => {
  const [hasRespondedToConsent, setHasRespondedToConsent] = useState(false)
  const userAgent = useUserAgent()
  const translate = useTranslate('consent_banner')

  const isConsentTrackingEnabled = useFeatureSwitch('web_consent_tracking')

  const { track } = useTracking()

  useLoadConsentBanner()

  useEffect(() => {
    if (!isConsentTrackingEnabled) return undefined

    let acceptBtn: HTMLElement | null = null
    let rejectBtn: HTMLElement | null = null

    let acceptPreferenceBtn: HTMLElement | null = null
    let rejectPreferenceBtn: HTMLElement | null = null
    let savePreferenceBtn: HTMLElement | null = null

    const handleCmpButtonClick = (action: CmpAction) => {
      if (hasRespondedToConsent) return

      track(userCmpActionEvent({ action, isMobile: isMobile(userAgent) }))
      setHasRespondedToConsent(true)
    }

    const observer = new MutationObserver(() => {
      acceptBtn = document.getElementById('onetrust-accept-btn-handler')
      rejectBtn = document.getElementById('onetrust-reject-all-handler')

      acceptPreferenceBtn = document.getElementById('accept-recommended-btn-handler')
      rejectPreferenceBtn = document.querySelector('.ot-pc-refuse-all-handler')
      savePreferenceBtn = document.querySelector('.save-preference-btn-handler')

      if (
        acceptBtn &&
        rejectBtn &&
        acceptPreferenceBtn &&
        rejectPreferenceBtn &&
        savePreferenceBtn
      ) {
        acceptBtn.addEventListener('click', () => handleCmpButtonClick(CmpAction.BannerAccept))
        rejectBtn.addEventListener('click', () => handleCmpButtonClick(CmpAction.BannerReject))

        acceptPreferenceBtn.addEventListener('click', () =>
          handleCmpButtonClick(CmpAction.PreferenceCenterAccept),
        )
        rejectPreferenceBtn.addEventListener('click', () =>
          handleCmpButtonClick(CmpAction.PreferenceCenterReject),
        )

        observer.disconnect()
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()

      if (acceptBtn) acceptBtn.removeEventListener('click', () => handleCmpButtonClick)
      if (rejectBtn) rejectBtn.removeEventListener('click', () => handleCmpButtonClick)
      if (acceptPreferenceBtn)
        acceptPreferenceBtn.removeEventListener('click', () => handleCmpButtonClick)
      if (rejectPreferenceBtn)
        rejectPreferenceBtn.removeEventListener('click', () => handleCmpButtonClick)
    }
  }, [hasRespondedToConsent, track, userAgent, isConsentTrackingEnabled, translate])

  return null
}

export default ConsentBannerTracker
