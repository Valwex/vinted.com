import { clientSideMetrics } from '@marketplace-web/observability/client-metrics-util'
import { CheckoutOrderType } from '@marketplace-web/checkout/checkout-data'
import { isMobile } from '@marketplace-web/consent/consent-feature'
import { serverSide } from '@marketplace-web/environment/environment-util'

import { MS_PER_SECOND } from '../constants/date'

type CheckoutPlugins =
  | 'additional_service'
  | 'multiple_items_presentation'
  | 'single_item_presentation'
  | 'order_content'
  | 'order_summary'
  | 'pay_button'
  | 'payment_options'
  | 'shipping'
  | 'shipping_pickup_options'
  | 'shipping_pickup_details'
  | 'shipping_address'
  | 'shipping_contact'

type IncrementCheckoutLoad = {
  type: 'success' | 'error'
  checkoutType: 'old' | 'new'
}

export const incrementCheckoutLoad = ({ type, checkoutType }: IncrementCheckoutLoad) => {
  clientSideMetrics.counter('checkout_load', { type, checkout_type: checkoutType }).increment()
}

export const incrementCheckoutPluginLoad = (plugin: CheckoutPlugins) => {
  clientSideMetrics.counter('checkout_plugin_load', { plugin }).increment()
}

type ObserveCheckoutLoad = {
  time: number
  checkoutType: 'old' | 'new'
}

export const observeCheckoutLoad = ({ time, checkoutType }: ObserveCheckoutLoad) => {
  clientSideMetrics
    .histogram('checkout_load_duration_seconds', {
      checkout_type: checkoutType,
    })
    .observe(time / MS_PER_SECOND)
}

type IncrementFrontendCheckoutInitiate = {
  orderType: CheckoutOrderType
}

export const incrementCheckoutInitiate = ({ orderType }: IncrementFrontendCheckoutInitiate) => {
  const userAgent = serverSide ? '' : window.navigator.userAgent
  const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome')

  clientSideMetrics
    .counter('frontend_checkout_initiate_total', {
      checkout_type: orderType,
      is_safari: isSafari,
      is_mobile: isMobile(userAgent),
    })
    .increment()
}

type IncrementFrontendCheckoutLoad = {
  time: number
  orderType: CheckoutOrderType
}

export const observeCheckoutOpen = ({ orderType, time }: IncrementFrontendCheckoutLoad) => {
  const BUCKETS = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 6.0, 8.0, 10.0, 15.0]

  const userAgent = serverSide ? '' : window.navigator.userAgent
  const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome')

  clientSideMetrics
    .histogram(
      'frontend_checkout_load_duration_seconds',
      {
        checkout_type: orderType,
        is_safari: isSafari ? 'true' : 'false',
        is_mobile: isMobile(userAgent) ? 'true' : 'false',
      },
      BUCKETS,
    )
    .observe(time / MS_PER_SECOND)
}

type IncrementBuyCheckoutPay = {
  state: 'initiated' | 'success'
  orderType: CheckoutOrderType
}

export const incrementCheckoutPay = ({ state, orderType }: IncrementBuyCheckoutPay) => {
  clientSideMetrics
    .counter('frontend_checkout_pay_total', { state, checkout_type: orderType })
    .increment()
}
