import { urlWithParams } from '@marketplace-web/browser/url-util'

export const MEMBER_PROFILE_URL = (id: string | number, closetPromotionPrecheckout?: boolean) =>
  urlWithParams(`/member/${id}`, { cp_precheckout: closetPromotionPrecheckout })
export const SIGNUP_URL = '/member/signup/select_type'
