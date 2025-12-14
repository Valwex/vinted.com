'use client'

import Script from 'next/script'
import { useContext, useEffect, useMemo } from 'react'

import { useConsent } from '@marketplace-web/consent/consent-feature'
import { CDN_ASSETS_URL } from '@marketplace-web/shared/assets'
import { AdKind } from '@marketplace-web/ads/ads-data'
import { useAbTest, useTrackAbTest } from '@marketplace-web/feature-flags/ab-tests-data'

import AdsContext from '../../../../containers/AdsProvider/AdsContext'

import { initPrebidSetup, setPrebidConsentManagement } from './utils'

const CDN_ADS_URL = `${CDN_ASSETS_URL}/ateam`

const Prebid = () => {
  const { isCookieConsentVersion } = useConsent()
  const { placements: adsPlacements } = useContext(AdsContext)

  const abTest = useAbTest('web_prebid_timeout_rules_test_v2')
  useTrackAbTest(abTest)

  const adagioParams = useMemo(() => {
    const adPlacement = adsPlacements.find(placement => placement.kind === AdKind.Rtb)

    if (!adPlacement || adPlacement.kind !== AdKind.Rtb) return undefined

    return adPlacement.bids?.find(bid => bid.bidder === 'adagio')?.params
  }, [adsPlacements])

  useEffect(() => {
    initPrebidSetup(adagioParams, abTest?.variant)
  }, [adagioParams, abTest])

  useEffect(() => {
    setPrebidConsentManagement(isCookieConsentVersion)
  }, [isCookieConsentVersion])

  return (
    <Script
      id="prebid-script"
      data-testid="prebid-script"
      src={`${CDN_ADS_URL}/2025-11-11-1400/script.js`}
      strategy="lazyOnload"
    />
  )
}

export default Prebid
