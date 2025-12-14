import { KycBannerDto, KycBannerModel } from '../types/kyc-banner'

export const transformKycBanner = ({
  test_variant,
  show_on_feed,
  show_on_profile,
  show_on_balance,
}: KycBannerDto): KycBannerModel => ({
  testVariant: test_variant,
  showOnFeed: show_on_feed,
  showOnProfile: show_on_profile,
  showOnBalance: show_on_balance,
})
