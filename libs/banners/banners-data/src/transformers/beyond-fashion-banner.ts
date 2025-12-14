import { BeyondFashionBannerDto, BeyondFashionBannerModel } from '../types/beyond-fashion-banner'

export const transformBeyondFashionBanner = ({
  name,
  type,
  image_url,
  dark_image_url,
  title,
  body,
  delay_in_minutes,
  ab_test,
  actions,
}: BeyondFashionBannerDto): BeyondFashionBannerModel => ({
  name,
  type,
  imageUrl: image_url,
  darkImageUrl: dark_image_url,
  title,
  body,
  delayInMinutes: delay_in_minutes,
  abTest: ab_test,
  actions,
})
