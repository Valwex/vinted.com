import {
  ZipCodeCollectionBannerDto,
  ZipCodeCollectionBannerModel,
} from '../types/zip-code-collection-banner'

export const transformZipCodeCollectionBanner = ({
  pop_up_show_interval,
}: ZipCodeCollectionBannerDto): ZipCodeCollectionBannerModel => ({
  popUpShowInterval: pop_up_show_interval,
})
