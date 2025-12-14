'use client'

import Script from 'next/script'
import { useEffect, useRef } from 'react'

import { ConsentGroup, useIsConsentGroupEnabled } from '@marketplace-web/consent/consent-feature'
import { RoktLauncher, RoktLauncherPromise } from '@marketplace-web/ads/ads-data'

import { ROKT_ACCOUNT_ID } from '../../../../constants'

const Rokt = () => {
  const resolveRef = useRef<((value: RoktLauncher | RoktLauncherPromise) => void) | null>(null)

  const hasConsentedTargeting = useIsConsentGroupEnabled(ConsentGroup.Targeting)
  const hasConsentedPersonalisedAds = useIsConsentGroupEnabled(ConsentGroup.PersonalisedAds)
  const hasConsentedRokt = useIsConsentGroupEnabled(ConsentGroup.RoktAdvertising)

  const isScriptAvailable = hasConsentedTargeting && hasConsentedPersonalisedAds && hasConsentedRokt

  function getRoktLauncher() {
    return window.Rokt?.createLauncher({
      accountId: ROKT_ACCOUNT_ID,
    })
  }

  function onRoktLoad() {
    const launcher = getRoktLauncher()

    if (launcher) {
      resolveRef.current?.(launcher)
    }
  }

  useEffect(() => {
    if (!isScriptAvailable) return

    window.RoktLauncher = new Promise<RoktLauncher>(resolve => {
      resolveRef.current = resolve

      if (!window.Rokt) return

      const launcher = getRoktLauncher()

      if (launcher) resolve(launcher)
    })
  }, [isScriptAvailable])

  if (!isScriptAvailable) return null

  return (
    <Script
      crossOrigin="anonymous"
      id="rokt-launcher"
      data-testid="rokt-launcher-script"
      src="https://apps.rokt.com/wsdk/integrations/launcher.js"
      strategy="lazyOnload"
      onLoad={onRoktLoad}
    />
  )
}

export default Rokt
