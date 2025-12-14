import {
  ReferralsBottomSheetBannerDto,
  ReferralsBottomSheetBannerModel,
} from '../types/referrals-bottom-sheet-banner'

export const transformReferralsBottomSheetBanner = ({
  name,
  type,
  image_url,
  dark_image_url,
  title,
  body,
  delay_in_minutes,
  ab_test,
  actions,
}: ReferralsBottomSheetBannerDto): ReferralsBottomSheetBannerModel => ({
  name,
  type,
  imageUrl: image_url,
  darkImageUrl: dark_image_url,
  title,
  body,
  delayInMinutes: delay_in_minutes,
  abTest: ab_test,
  actions: actions
    ? {
        primary: {
          title: actions.primary.title,
          action: {
            type: actions.primary.action.type,
            target: actions.primary.action.target,
          },
        },
      }
    : undefined,
})
