export enum PaymentsProvider {
  Adyen = 'adyen',
  Klarna = 'klarna',
  Stripe = 'stripe',
  Mangopay = 'mangopay',
  Payrails = 'payrails',
  AdyenBank = 'adyen_bank',
  CheckoutCom = 'checkout',
  None = 'none',
}

export enum DebitStatus {
  New = 1,
  Processing = 10,
  Pending = 20,
  Failed = 30,
  Authorized = 35,
  Success = 40,
  PayoutAvailable = 50,
  PayoutProcessing = 60,
  PayoutFailed = 70,
  PayoutDone = 80,
  PayoutReverted = 85,
  PayoutPartiallyRefunded = 90,
  Refunded = 100,
}

export enum PaymentStatus {
  Success = 'success',
  Pending = 'pending',
  Failure = 'failure',
  Preparing = 'preparing',
}

export enum PaymentActionType {
  Klarna = 'klarna',
  Redirect = 'redirect',
  ScaRequired = 'sca_required',
  PayrailsCvvResubmission = 'payrails_cvv_resubmission',
}

export enum PaymentActionNative3DSType {
  NativeAdyenCard3ds = 'native_adyen_card_3ds',
  NativeAdyenPayment3ds = 'native_adyen_payment_3ds',
  NativeAdyenPaymentBlikAuth = 'native_adyen_payment_blik_authorization',
  NativeAdyenPaymentBancontactAuth = 'native_adyen_payment_bancontact_authorization',
}

export enum PaymentNavigationTypes {
  Wallet = 'wallet',
  UserProfile = 'user_profile',
  Conversation = 'conversation',
}
