'use client'

import { useRef } from 'react'

import { useAbTest, useTrackAbTestCallback } from '@marketplace-web/feature-flags/ab-tests-data'
import { KycBannerModel } from '@marketplace-web/banners/banners-data'

type Props = {
  kycBanner: KycBannerModel | undefined
  shouldTrackBanner?: boolean
}

const useKycBannerTracking = ({ kycBanner, shouldTrackBanner }: Props) => {
  const kycBannerAbTest = useAbTest('kyc_info_banner')
  const wasExposed = useRef(false)
  const trackExpose = useTrackAbTestCallback()

  if (!kycBanner || shouldTrackBanner === false) return

  if (kycBannerAbTest && !wasExposed.current) {
    trackExpose(kycBannerAbTest)
    wasExposed.current = true
  }
}

export default useKycBannerTracking
