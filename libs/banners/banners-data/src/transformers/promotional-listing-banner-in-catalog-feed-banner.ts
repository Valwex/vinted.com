import {
  PromotionalListingBannerInCatalogFeedDto,
  PromotionalListingBannerInCatalogFeedModel,
} from '../types/promotional-listing-banner-in-catalog-feed-banner'

export const transformPromotionalListingBannerInCatalogFeed = ({
  name,
  image_url,
  dark_image_url,
  title,
  body,
  position,
  ab_test,
  actions,
}: PromotionalListingBannerInCatalogFeedDto): PromotionalListingBannerInCatalogFeedModel => ({
  name,
  imageUrl: image_url,
  darkImageUrl: dark_image_url,
  title,
  body,
  position,
  abTest: ab_test,
  actions,
})
