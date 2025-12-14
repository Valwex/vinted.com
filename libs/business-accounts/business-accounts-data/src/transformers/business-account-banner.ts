import {
  BusinessAccountBannerDto,
  BusinessAccountBannerModel,
} from '../types/business-account-banner'

export const transformBusinessAccountBanner = ({
  title,
  body,
  cancel_button_label,
  continue_button_label,
  continue_button_url,
}: BusinessAccountBannerDto): BusinessAccountBannerModel => ({
  title,
  body,
  cancelButtonLabel: cancel_button_label,
  continueButtonLabel: continue_button_label,
  continueButtonUrl: continue_button_url,
})
