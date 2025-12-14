import { FeedPersonalizationBannerDto, FeedPersonalizationBannerModel } from './types'

export const transformFeedPersonalization = ({
  title,
  subtitle,
  action_title,
  bottom_title,
  bottom_subtitle,
  bottom_action_title,
}: FeedPersonalizationBannerDto): FeedPersonalizationBannerModel => ({
  title,
  subtitle,
  actionTitle: action_title,
  bottomTitle: bottom_title,
  bottomSubtitle: bottom_subtitle,
  bottomActionTitle: bottom_action_title,
})
