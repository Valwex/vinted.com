import { api } from '@marketplace-web/core-api/core-api-client-util'

import { GetBannersArgs, BannersResp, BannersDto, SetBannerAsSeenArgs } from '../types/banners'

export const noCacheHeader = {
  'Cache-Control': 'no-cache',
}

export const getBanners = ({ disableCache = false }: GetBannersArgs = {}) =>
  api.get<BannersResp>('/banners', {
    headers: disableCache ? noCacheHeader : {},
  })

export const dismissBanner = (type: keyof BannersDto) => api.post(`/banners/${type}/dismissed`)

export const setBannerAsSeen = ({ type, name }: SetBannerAsSeenArgs) =>
  api.put(`/banners/${type}/seen`, { name })
