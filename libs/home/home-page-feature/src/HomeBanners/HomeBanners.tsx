'use client'

import { Spacer } from '@vinted/web-ui'

import { AppBanner } from '@marketplace-web/web-to-app/web-to-app-feature'
import { ShippingFeesAppliedBanner } from '@marketplace-web/escrow-pricing/escrow-pricing-feature'
import { InfoBanner } from '@marketplace-web/info-banner/info-banner-feature'
import { TaxpayersSpecialVerificationSuccessModal } from '@marketplace-web/taxpayers/taxpayers-feature'

import TopBanners from './TopBanners'
import useTabs from '../hooks/useTabs'

const HomeBanners = () => {
  const { shouldShowTabs } = useTabs()

  return (
    <>
      <TopBanners />
      <TaxpayersSpecialVerificationSuccessModal />
      <InfoBanner screen="news_feed" theme="inverseExperimental" />
      <ShippingFeesAppliedBanner
        suffix={<Spacer size="x2-large" />}
        areTabsShown={shouldShowTabs}
      />
      <AppBanner />
    </>
  )
}

export default HomeBanners
