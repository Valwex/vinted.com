'use client'

import {
  TaxpayerBannerModel,
  TaxpayerBannerRenderLocation,
} from '@marketplace-web/taxpayers/taxpayers-data'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'

import TaxpayerBanner from './TaxpayerBanner'

type Props = {
  banner: TaxpayerBannerModel
}

const TaxpayerBannerInHome = ({ banner }: Props) => {
  const isTaxpayersSpecialVerificationBanner = banner.isSpecialVerification
  const isTaxpayerSpecialVerificationBannerFsEnabled = useFeatureSwitch(
    'web_special_verification_taxpayers_banners',
  )

  const shouldDisplayBanner =
    !isTaxpayersSpecialVerificationBanner ||
    (isTaxpayersSpecialVerificationBanner && isTaxpayerSpecialVerificationBannerFsEnabled)

  if (!shouldDisplayBanner) return null

  return (
    <TaxpayerBanner
      banner={banner}
      isBannerInFeed
      renderLocation={TaxpayerBannerRenderLocation.Feed}
    />
  )
}

export default TaxpayerBannerInHome
