export enum EscrowVerificationTypes {
  ItemVerification = 'item_verification',
  ElectronicsVerification = 'electronics_verification',
}

export enum DeductionActionTypes {
  SalesTax = 'sales_tax',
  SimpleModal = 'simple_modal',
  BuyerProtectionFee = 'buyer_protection_fee',
}

export enum OrderSummaryItemNoteType {
  Verify = 'verify',
  Submit = 'submit',
}

export enum OrderSummaryActionSalesTaxType {
  ExtraService = 'extra_services',
  Escrow = 'escrow',
}

export enum OrderSummaryEscrowCurrencyConversionShippingType {
  Custom = 'custom',
  Integrated = 'integrated',
}

export enum InfoBannerType {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

export enum ItemDisposalConditions {
  None = 0,
  ForSell = 4,
}

export enum ExtraServiceOrderType {
  PushUp = 'push_up_order',
  ClosetPromotion = 'closet_promotion_order',
  DirectDonation = 'direct_donation_order',
  ReturnLabel = 'return_label_order',
  Transaction = 'transaction',
}

export enum CheckoutOrderType {
  PushUp = 'push_up',
  ClosetPromotion = 'closet_promotion',
  DirectDonation = 'direct_donation',
  ReturnLabel = 'return_label',
  Transaction = 'transaction',
}

export const CheckoutOrderTypeMap = {
  [ExtraServiceOrderType.PushUp]: CheckoutOrderType.PushUp,
  [ExtraServiceOrderType.ClosetPromotion]: CheckoutOrderType.ClosetPromotion,
  [ExtraServiceOrderType.DirectDonation]: CheckoutOrderType.DirectDonation,
  [ExtraServiceOrderType.ReturnLabel]: CheckoutOrderType.ReturnLabel,
  [ExtraServiceOrderType.Transaction]: CheckoutOrderType.Transaction,
}

export const HAS_BOUGHT_STORAGE_VALUE = '1'
export const SINGLE_CHECKOUT_ORDER_TYPE_STORAGE_KEY = 'checkout_order_type'

export const SINGLE_CHECKOUT_LOAD_TIME_TRACKING_DETAILS_STORAGE_KEY =
  'single_checkout_load_time_tracking_details'

export const SINGLE_CHECKOUT_TRACK_PAGE_LOAD_STORAGE_KEY = 'checkout_track_page_load'

export const SINGLE_CHECKOUT_ITEM_SCROLL_ON_LOAD_STORAGE_KEY = 'checkout_item_scroll_on_load'

// Based on ItemPhoto::PHOTO_SIZES
export const PHOTO_THUMBNAIL_SIZES = {
  medium: {
    width: 150,
    height: 210,
  },
}

export enum FieldName {
  ShippingAddress = 'shipping_address',
  PaymentMethod = 'payment_method',
  Shipping = 'shipping',
  ShippingDeliveryOptions = 'shipping_delivery_options',
  ShippingDeliveryDetails = 'shipping_delivery_details',
  ShippingContact = 'shipping_contact',
}

export enum CheckoutErrorType {
  CheckoutFailed = 'CHECKOUT_FAILED',
  PurchaseAlreadyPaidFor = 'PURCHASE_ALREADY_PAID',
}

export enum CheckoutErrorCode {
  PurchaseAlreadyPaidFor = 'purchase_already_paid_for',
  ServerError = 'server_error',
}

export enum ViewTypeToTrack {
  PageView,
  PaymentOptionsView,
  ShippingAddressView,
  ShippingView,
  ShippingContactView,
  CreditCardAdd,
}
