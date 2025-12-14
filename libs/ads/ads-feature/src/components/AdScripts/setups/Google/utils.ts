// TODO: Add unit tests

import { getBidderTimeoutTargeting } from '@marketplace-web/ads/ads-data'

export function initGoogletag() {
  window.googletag = window.googletag || { cmd: [] }
}

export function setNonPersonalizedAds(nonPersonalizedAds: boolean) {
  window.googletag.cmd.push(() => {
    window.googletag.pubads().setPrivacySettings({ nonPersonalizedAds })
  })
}

export function setAdsSegments(adsSegments: Record<string, string>) {
  if (!Object.keys(adsSegments).length) return

  window.googletag.cmd.push(() => {
    Object.entries(adsSegments).forEach(([key, value]) =>
      window.googletag.pubads().setTargeting(key, value),
    )
  })
}

export function setAbTestTargetingForPubstack(abTestVariant?: string) {
  if (!abTestVariant) return

  window.googletag.cmd.push(() => {
    window.googletag
      .pubads()
      .setTargeting('pbstck_ab_test', getBidderTimeoutTargeting(abTestVariant))
  })
}

export function setupGoogletagServices() {
  window.googletag.cmd.push(() => {
    window.googletag.pubads().enableSingleRequest()
    window.googletag.pubads().disableInitialLoad()
    window.googletag.pubads().collapseEmptyDivs()

    window.googletag.enableServices()
  })
}
