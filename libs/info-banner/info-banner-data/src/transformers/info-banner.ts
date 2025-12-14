import { InfoBannerDto, InfoBannerModel } from '../types/info-banner'

export const transformInfoBannerDto = (infoBanner: InfoBannerDto): InfoBannerModel => ({
  level: infoBanner.level,
  title: infoBanner.title || undefined,
  body: infoBanner.body,
  extraNotice: !!infoBanner.extra_notice,
})
