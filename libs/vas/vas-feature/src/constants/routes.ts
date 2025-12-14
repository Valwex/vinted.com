import { urlWithParams } from '@marketplace-web/browser/url-util'

export const MEMBER_PROFILE_URL = (id: string | number, closetPromotionPrecheckout?: boolean) =>
  urlWithParams(`/member/${id}`, { cp_precheckout: closetPromotionPrecheckout })
export const ITEM_UPLOAD_URL = '/items/new'
export const ITEM_URL = (id: number): string => `/items/${id}`
export const BUMP_MULTIPLE_ITEM_SELECTION_URL = '/items/push_up/new'
export const CLOSET_PROMOTION_STATS_URL = '/closet_promotions/stats'
