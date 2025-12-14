import {
  ListerActivationBannerDto,
  ListerActivationBannerModel,
} from '../types/lister-activation-banner'

export const transformListerActivationBanner = ({
  image_urls,
  catalog_id,
  title,
  subtitle,
  button_link_text,
  button_link_url,
}: ListerActivationBannerDto): ListerActivationBannerModel => ({
  imageUrls: image_urls,
  catalogId: catalog_id,
  title,
  subtitle,
  buttonLinkText: button_link_text,
  buttonLinkUrl: button_link_url,
})

export const transformListerActivationBanners = (
  banners?: Array<ListerActivationBannerDto>,
): Array<ListerActivationBannerModel> =>
  banners ? banners.map(transformListerActivationBanner) : []
