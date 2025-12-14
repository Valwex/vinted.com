import { api } from '@marketplace-web/core-api/core-api-client-util'

import { GetInfoBannerArgs, InfoBannerResp } from '../types/info-banner'

export const getInfoBanner = ({ screen, params }: GetInfoBannerArgs) =>
  api.get<InfoBannerResp>(`/info_banners/${screen}`, { params })
