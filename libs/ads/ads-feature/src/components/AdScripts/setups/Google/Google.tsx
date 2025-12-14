'use client'

import { useContext, useEffect } from 'react'
import Script from 'next/script'

import { useIsConsentGroupEnabled, ConsentGroup } from '@marketplace-web/consent/consent-feature'
import { useAbTest } from '@marketplace-web/feature-flags/ab-tests-data'

import AdsContext from '../../../../containers/AdsProvider/AdsContext'

import {
  initGoogletag,
  setupGoogletagServices,
  setAdsSegments,
  setNonPersonalizedAds,
  setAbTestTargetingForPubstack,
} from './utils'

const Google = () => {
  const { segments: adsSegments } = useContext(AdsContext)
  const hasConsentedTargeting = useIsConsentGroupEnabled(ConsentGroup.Targeting)
  const prebidConfigV2Test = useAbTest('web_prebid_timeout_rules_test_v2')

  useEffect(() => {
    initGoogletag()
    setupGoogletagServices()
    setAbTestTargetingForPubstack(prebidConfigV2Test?.variant)
  }, [prebidConfigV2Test])

  useEffect(() => {
    setNonPersonalizedAds(!hasConsentedTargeting)
  }, [hasConsentedTargeting])

  useEffect(() => {
    setAdsSegments(adsSegments)
  }, [adsSegments])

  return (
    <Script
      id="googletag-script"
      data-testid="googletag-script"
      src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
      strategy="lazyOnload"
    />
  )
}

export default Google
