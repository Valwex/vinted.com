'use client'

import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'

import DismissibleStickyBanner from './DismissibleStickyBanner'

type Props = {
  suffix?: JSX.Element
  prefix?: JSX.Element
  areTabsShown?: boolean
}

const ShippingFeesAppliedBanner = (props: Props) => {
  const isStickyShippingInfoBannerOn = useFeatureSwitch('shipping_info_banner_v2_toggle')

  if (isStickyShippingInfoBannerOn) return <DismissibleStickyBanner {...props} />

  return null
}

export default ShippingFeesAppliedBanner
