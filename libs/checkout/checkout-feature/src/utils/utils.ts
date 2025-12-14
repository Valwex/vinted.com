import {
  getSessionStorageItem,
  removeSessionStorageItem,
  setLocalStorageItem,
  setSessionStorageItem,
} from '@marketplace-web/browser/browser-storage-util'
import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'
import {
  CheckoutOrderType,
  SINGLE_CHECKOUT_LOAD_TIME_TRACKING_DETAILS_STORAGE_KEY,
  SINGLE_CHECKOUT_ORDER_TYPE_STORAGE_KEY,
  SINGLE_CHECKOUT_TRACK_PAGE_LOAD_STORAGE_KEY,
  SINGLE_CHECKOUT_ITEM_SCROLL_ON_LOAD_STORAGE_KEY,
} from '@marketplace-web/checkout/checkout-data'
import {
  PaymentNavigationDto,
  PaymentNavigationTypes,
} from '@marketplace-web/checkout-payments/checkout-payments-options-data'
import { CONVERSATION_URL } from '@marketplace-web/messaging/navigation-feature'

import { incrementCheckoutInitiate } from './observability'
import {
  GO_TO_WALLET_URL,
  MEMBER_PROFILE_URL,
  ROOT_URL,
  SINGLE_CHECKOUT_URL,
} from '../constants/routes'

export const markSingleCheckoutLoadStartTime = (orderId: number) => {
  const loadTimeStartStamp = new Date().getTime()
  const trackingDetails = {
    orderId,
    loadTimeStartStamp,
  }

  setLocalStorageItem(
    SINGLE_CHECKOUT_LOAD_TIME_TRACKING_DETAILS_STORAGE_KEY,
    JSON.stringify(trackingDetails),
  )
}

const storeCheckoutOrderType = (orderType: string) => {
  setSessionStorageItem(SINGLE_CHECKOUT_ORDER_TYPE_STORAGE_KEY, orderType)
}

export const getCheckoutPageLoadTrackMark = () => {
  return getSessionStorageItem(SINGLE_CHECKOUT_TRACK_PAGE_LOAD_STORAGE_KEY)
}

export const storeCheckoutPageLoadTrackMark = () => {
  setSessionStorageItem(SINGLE_CHECKOUT_TRACK_PAGE_LOAD_STORAGE_KEY, 'true')
}

export const removeCheckoutPageLoadTrackMark = () => {
  if (getCheckoutPageLoadTrackMark()) {
    removeSessionStorageItem(SINGLE_CHECKOUT_TRACK_PAGE_LOAD_STORAGE_KEY)
  }
}

export const getCheckoutItemScrollOnLoadMark = () => {
  return getSessionStorageItem(SINGLE_CHECKOUT_ITEM_SCROLL_ON_LOAD_STORAGE_KEY)
}

export const storeCheckoutItemScrollOnLoadMark = () => {
  setSessionStorageItem(SINGLE_CHECKOUT_ITEM_SCROLL_ON_LOAD_STORAGE_KEY, 'true')
}

export const removeCheckoutItemScrollOnLoadMark = () => {
  if (getCheckoutPageLoadTrackMark()) {
    removeSessionStorageItem(SINGLE_CHECKOUT_ITEM_SCROLL_ON_LOAD_STORAGE_KEY)
  }
}

export const navigateToSingleCheckout = (
  checkoutId: string,
  orderId: number,
  orderType: CheckoutOrderType,
) => {
  incrementCheckoutInitiate({ orderType })
  storeCheckoutOrderType(orderType)
  removeCheckoutPageLoadTrackMark()
  markSingleCheckoutLoadStartTime(orderId)
  navigateToPage(SINGLE_CHECKOUT_URL(checkoutId, orderId, orderType))
}

export const isValidOrderType = (value: string): value is CheckoutOrderType => {
  return Object.values(CheckoutOrderType).includes(value as CheckoutOrderType)
}

export const resolveOrderType = (
  orderTypeFromUrl: string | undefined,
): CheckoutOrderType | undefined => {
  if (orderTypeFromUrl) {
    return isValidOrderType(orderTypeFromUrl) ? orderTypeFromUrl : undefined
  }

  const savedOrderType = getSessionStorageItem(SINGLE_CHECKOUT_ORDER_TYPE_STORAGE_KEY)

  return !!savedOrderType && isValidOrderType(savedOrderType) ? savedOrderType : undefined
}

export const removeStoredCheckoutOrderType = () => {
  if (getSessionStorageItem(SINGLE_CHECKOUT_ORDER_TYPE_STORAGE_KEY)) {
    removeSessionStorageItem(SINGLE_CHECKOUT_ORDER_TYPE_STORAGE_KEY)
  }
}

export function getPaymentCompletionRedirectUrl(navigation: PaymentNavigationDto) {
  switch (navigation?.type) {
    case PaymentNavigationTypes.Conversation:
      return CONVERSATION_URL(navigation.id)
    case PaymentNavigationTypes.UserProfile:
      return MEMBER_PROFILE_URL(navigation.id)
    case PaymentNavigationTypes.Wallet:
      return GO_TO_WALLET_URL
    default:
      return ROOT_URL
  }
}
