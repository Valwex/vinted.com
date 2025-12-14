import { urlWithParams } from '@marketplace-web/browser/url-util'

export const MEMBER_PROFILE_URL = (id: string | number, closetPromotionPrecheckout?: boolean) =>
  urlWithParams(`/member/${id}`, { cp_precheckout: closetPromotionPrecheckout })
export const CREATE_BUNDLE_URL = (id: string | number): string => `/member/${id}/bundles/new`
export const SINGLE_CHECKOUT_URL = (checkoutId: string, orderId: number, purchaseType: string) =>
  `/checkout?purchase_id=${checkoutId}&order_id=${orderId}&order_type=${purchaseType}`
export const ROOT_URL = '/'
export const GO_TO_WALLET_URL = '/wallet/balance'
export const TAXPAYER_FORM_URL_WITH_REF = (refUrl: string) =>
  urlWithParams('/settings/taxpayer', { ref_url: refUrl })
export const SPECIAL_VERIFICATION_FORM_URL_WITH_REF = (
  refUrl: string,
  specialVerificationSessionId: string,
) =>
  urlWithParams('/taxpayers/special_verification', {
    ref_url: refUrl,
    id: specialVerificationSessionId,
  })
