export enum BusinessAccountType {
  SoleTrader = 'sole_trader',
  LegalBusiness = 'legal_business',
  Organization = 'organization',
}

export enum BusinessAccountStatus {
  Registered = 'registered',
  WalletConversionInProgress = 'conversion_in_progress',
  Completed = 'completed',
}

export enum WalletConversionStatus {
  Idle = 'idle',
  Pending = 'pending',
  Failed = 'failed',
  Completed = 'completed',
  Unverified = 'unverified',
}

export const REGISTRATION_FORM_STORAGE_KEY = 'business_registration_form'

export enum AddressEntryType {
  None = 0,
  Shipping = 1,
  Billing = 2,
}
