import {
  transformBusinessAccountBanner,
  transformEprBanner,
} from '@marketplace-web/business-accounts/business-accounts-data'
import { transformFeedPersonalization } from '@marketplace-web/home/feed-personalisation-banner-data'
import { transformTaxpayerBanner } from '@marketplace-web/taxpayers/taxpayers-data'
import { transformTermsAndConditionsBanner } from '@marketplace-web/terms-and-conditions/terms-and-conditions-data'
import { transformPortalMergeDraftItemsReminder } from '@marketplace-web/user-migration/user-migration-data'

import { BannersDto, BannersModel } from '../types/banners'
import { transformBeyondFashionBanner } from './beyond-fashion-banner'
import { transformIvsGuidelineBanner } from './ivs-guideline-banner'
import { transformKycBanner } from './kyc-banner'
import { transformListerActivationBanners } from './lister-activation-banner'
import { transformOnboardingModal, transformSingleStepOnboardingModal } from './onboarding-banner'
import { transformPromotionalBanner } from './promotional-banner'
import { transformPromotionalListingBannerInCatalogFeed } from './promotional-listing-banner-in-catalog-feed-banner'
import { transformReferralsBottomSheetBanner } from './referrals-bottom-sheet-banner'
import { transformZipCodeCollectionBanner } from './zip-code-collection-banner'

export const transformBanners = ({
  feed_personalization_banner,
  nps,
  terms_and_conditions,
  portal_merge_draft_items_reminder,
  lister_activation,
  onboarding_modal,
  single_step_onboarding_modal,
  business_account,
  business_account_epr,
  taxpayer_banner,
  promotional_listing_banner_in_catalog_feed,
  ivs_guideline_banner,
  beyond_fashion,
  promotional_banner,
  kyc_banner,
  referrals_bottom_sheet_banner,
  us_postal_code_collection,
}: BannersDto): BannersModel => ({
  feedPersonalizationBanner:
    feed_personalization_banner && transformFeedPersonalization(feed_personalization_banner),
  nps,
  termsAndConditions:
    terms_and_conditions && transformTermsAndConditionsBanner(terms_and_conditions),
  portalMergeDraftItemsReminder:
    portal_merge_draft_items_reminder &&
    transformPortalMergeDraftItemsReminder(portal_merge_draft_items_reminder),
  listerActivation: transformListerActivationBanners(lister_activation),
  onboardingModal: onboarding_modal && transformOnboardingModal(onboarding_modal),
  singleStepOnboardingModal:
    single_step_onboarding_modal &&
    transformSingleStepOnboardingModal(single_step_onboarding_modal),
  businessAccount: business_account && transformBusinessAccountBanner(business_account),
  businessAccountEpr: business_account_epr && transformEprBanner(business_account_epr),
  taxpayerBanner: taxpayer_banner && transformTaxpayerBanner(taxpayer_banner),
  promotionalListingBannerInCatalogFeed:
    promotional_listing_banner_in_catalog_feed &&
    transformPromotionalListingBannerInCatalogFeed(promotional_listing_banner_in_catalog_feed),
  ivsGuidelineBanner: ivs_guideline_banner && transformIvsGuidelineBanner(ivs_guideline_banner),
  beyondFashion: beyond_fashion && transformBeyondFashionBanner(beyond_fashion),
  promotionalBanner: promotional_banner && transformPromotionalBanner(promotional_banner),
  kycBanner: kyc_banner && transformKycBanner(kyc_banner),
  referralsBottomSheetBanner:
    referrals_bottom_sheet_banner &&
    transformReferralsBottomSheetBanner(referrals_bottom_sheet_banner),
  usPostalCodeCollection:
    us_postal_code_collection && transformZipCodeCollectionBanner(us_postal_code_collection),
})
