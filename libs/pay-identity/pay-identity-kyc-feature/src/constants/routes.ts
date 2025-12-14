import { urlWithParams } from '@marketplace-web/browser/url-util'

export const MEMBER_PROFILE_URL = (id: string | number, closetPromotionPrecheckout?: boolean) =>
  urlWithParams(`/member/${id}`, { cp_precheckout: closetPromotionPrecheckout })
export const ROOT_URL = '/'
export const GO_TO_WALLET_URL = '/wallet/balance'
export const PAYMENTS_IDENTITY = '/settings/payments_identity'
export const KYC_HELP_URL = '/help/111'
export const WALLET_ACCOUNT_EDIT_URL = '/wallet/bank_account'
export const WALLET_SETUP_URL = '/wallet/setup'
