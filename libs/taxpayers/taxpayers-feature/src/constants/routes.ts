import { urlWithParams } from '@marketplace-web/browser/url-util'

export const ITEM_UPLOAD_URL = '/items/new'
export const ROOT_URL = '/'
export const PAYMENTS_SETTINGS_URL = '/settings/payments'
export const PRIVACY_POLICY_URL = '/privacy-policy'
export const GO_TO_TAXPAYER_FORM_URL = '/settings/taxpayer'
export const TAXPAYER_EDUCATION_URL = '/settings/taxpayer_education'
export const TAXPAYER_FORM_URL_WITH_REF = (refUrl: string) =>
  urlWithParams('/settings/taxpayer', { ref_url: refUrl })
export const TAXPAYER_SUMMARY_URL = '/settings/taxpayer_summary'
export const TAXPAYER_EDUCATION_URL_WITH_REF = (refUrl: string) =>
  urlWithParams('/settings/taxpayer_education', { ref_url: refUrl })
export const TAXPAYER_REPORT_URL = (id: number) =>
  urlWithParams('/settings/taxpayer_report', { id })
export const SPECIAL_VERIFICATION_FORM_URL_WITH_REF = (
  refUrl: string,
  specialVerificationSessionId: string,
) =>
  urlWithParams('/taxpayers/special_verification', {
    ref_url: refUrl,
    id: specialVerificationSessionId,
  })
export const TAXPAYER_CENTER_URL = '/settings/taxpayer_center'
export const TAXPAYER_CENTER_URL_WITH_REF = (refUrl: string) =>
  urlWithParams('/settings/taxpayer_center', { ref_url: refUrl })

export const TAX_RULES_URL = '/settings/tax_rules'
