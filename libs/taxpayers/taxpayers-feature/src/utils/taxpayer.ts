import { BusinessAccountType } from '@marketplace-web/business-accounts/business-accounts-data'

export const getIsUserBusiness = (type?: string | null) =>
  type !== null &&
  (type === BusinessAccountType.LegalBusiness ||
    type === BusinessAccountType.Organization ||
    type === BusinessAccountType.SoleTrader)

export const getIsUserBusinessAndNotSoletrader = (type?: string | null) =>
  type !== null &&
  (type === BusinessAccountType.LegalBusiness || type === BusinessAccountType.Organization)
