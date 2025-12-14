import { TaxpayerBannerDto, TaxpayerBannerModel } from '../types/banner'

export const transformTaxpayerBanner = ({
  news_feed,
  type,
  title,
  body,
  is_special_verification,
  version,
  actions,
  id,
  show_in_screens,
  style,
}: TaxpayerBannerDto): TaxpayerBannerModel => ({
  newsFeed: {
    dismissed: news_feed.dismissed,
    isDismissible: news_feed.is_dismissible,
    showModal: news_feed.show_modal,
    forceRedirect: news_feed.force_redirect,
  },
  type,
  title,
  body,
  isSpecialVerification: is_special_verification,
  version,
  id,
  actions: actions?.map(action => ({
    title: action.title,
    link: action.link,
    type: action.type,
  })),
  showInScreens: show_in_screens,
  style: style
    ? {
        image: style.image,
        type: style.type,
      }
    : null,
})
