'use client'

import { useEffect } from 'react'

import { TermsAndConditionsBanner } from '@marketplace-web/terms-and-conditions/terms-and-conditions-feature'

import NetPromoterScore from '@marketplace-web/nps/nps-feature'

import { PortalDraftItemReminderBanner } from '@marketplace-web/user-migration/user-migration-feature'

import {
  useBanners,
  OnboardingModal,
  BeyondFashionBanner,
  ReferralsButtomSheetBanner,
} from '@marketplace-web/banners/banners-feature'
import { TaxpayerBannerInHome } from '@marketplace-web/taxpayers/taxpayers-feature'
import { useAbTest, useTrackAbTest } from '@marketplace-web/feature-flags/ab-tests-data'
import { UiState } from '@marketplace-web/shared/ui-state-util'
import { MissingZipCodeBanner } from '@marketplace-web/shipping/zip-code-feature'

import {
  KycBanner,
  useKycBannerTracking,
} from '@marketplace-web/pay-identity/pay-identity-kyc-feature'

import PersonalizationBanner from './PersonalizationBanner'
import useTabs from '../../hooks/useTabs'

const TopBanners = () => {
  const { shouldShowTabs } = useTabs()
  const { fetchBanners, banners, uiState: bannersUiState } = useBanners()
  const { taxpayerBanner, kycBanner } = banners

  useEffect(() => {
    fetchBanners()
  }, [fetchBanners])

  const newMemberSkipVideoOnboardingAbTest = useAbTest('new_member_skip_video_onboarding')
  useTrackAbTest(newMemberSkipVideoOnboardingAbTest)

  useKycBannerTracking({ kycBanner, shouldTrackBanner: !taxpayerBanner && !!kycBanner })

  function renderBanner<T extends keyof typeof banners>(
    name: T,
    BannerComponent: React.ComponentType<{ banner: NonNullable<(typeof banners)[T]> }>,
  ) {
    const banner = banners[name]

    if (!banner) return null

    return <BannerComponent banner={banner} />
  }

  function renderBannerWithTabs<T extends keyof typeof banners>(
    name: T,
    BannerComponent: React.ComponentType<{
      banner: NonNullable<(typeof banners)[T]>
      shouldShowTabs: boolean
    }>,
  ) {
    const banner = banners[name]

    if (!banner) return null

    return <BannerComponent banner={banner} shouldShowTabs={shouldShowTabs} />
  }

  const renderTopBanners = () => {
    if (bannersUiState !== UiState.Success) return null

    if (taxpayerBanner) {
      return renderBanner('taxpayerBanner', TaxpayerBannerInHome)
    }

    if (kycBanner?.showOnFeed) {
      return renderBanner('kycBanner', KycBanner)
    }

    return (
      <>
        {renderBanner('feedPersonalizationBanner', PersonalizationBanner)}
        {renderBanner('portalMergeDraftItemsReminder', PortalDraftItemReminderBanner)}
        {renderBanner('nps', NetPromoterScore)}
        {renderBanner('termsAndConditions', TermsAndConditionsBanner)}
        {newMemberSkipVideoOnboardingAbTest?.variant === 'on'
          ? null
          : renderBanner('onboardingModal', OnboardingModal)}
        {renderBanner('beyondFashion', BeyondFashionBanner)}
        {renderBanner('referralsBottomSheetBanner', ReferralsButtomSheetBanner)}
      </>
    )
  }

  return (
    <>
      <div className="homepage-top-banners">{renderTopBanners()}</div>
      {renderBannerWithTabs('usPostalCodeCollection', MissingZipCodeBanner)}
    </>
  )
}

export default TopBanners
