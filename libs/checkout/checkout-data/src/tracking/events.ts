import { CheckoutOrderTypeMap, ExtraServiceOrderType } from '../constants'

type BuyerViewEscrowCheckoutEventArgs = {
  transactionId: number | null
  isExternalOpen?: boolean
  screen: string
}

type BuyerViewExtraServiceCheckoutEventArgs = {
  orderId: number
  orderType: ExtraServiceOrderType
  screen: string
}

type BuyerViewEscrowCheckoutEventExtra = {
  transaction_id: number | string
  entry_from_link: boolean | null
  checkout_type: 'escrow'
  screen: string
}

type BuyerViewExtraServiceCheckoutEventExtra = {
  order_id: number
  checkout_type: string
  screen: string
}

type BuyerViewCheckoutEventArgs =
  | BuyerViewEscrowCheckoutEventArgs
  | BuyerViewExtraServiceCheckoutEventArgs

export const buyerViewCheckoutEvent = (args: BuyerViewCheckoutEventArgs) => {
  const event = 'buyer.view_checkout'

  if ('transactionId' in args) {
    const extra: BuyerViewEscrowCheckoutEventExtra = {
      screen: args.screen,
      checkout_type: 'escrow',
      transaction_id: args.transactionId ?? '',
      entry_from_link: args.isExternalOpen === undefined ? null : !!args.isExternalOpen,
    }

    return { event, extra }
  }

  const extra: BuyerViewExtraServiceCheckoutEventExtra = {
    screen: args.screen,
    order_id: args.orderId,
    checkout_type: CheckoutOrderTypeMap[args.orderType],
  }

  return { event, extra }
}

type ViewSingleCheckoutScreenEventArgs = {
  screen?: string
  modalId?: string | null
  orderId?: string
  orderType?: string
  checkoutId?: string | null
}

type ViewSingleCheckoutScreenEventExtra = {
  screen?: string
  modal_id?: string
  order_id?: string
  order_type?: string
  checkout_id?: string | null
}

export const viewSingleCheckoutEvent = (args: ViewSingleCheckoutScreenEventArgs) => {
  const { checkoutId, screen, orderId, orderType, modalId } = args

  const extra: ViewSingleCheckoutScreenEventExtra = {
    checkout_id: checkoutId,
    screen: screen || 'checkout',
  }

  if (orderId) extra.order_id = orderId
  if (modalId) extra.modal_id = modalId
  if (orderType) extra.order_type = orderType

  return { event: 'checkout.screen', extra }
}

type ViewAdditionalServicesModalEventArgs = {
  checkoutId: string
  screen: string
  target: string
}

export const viewAdditionalServicesModalEvent = (args: ViewAdditionalServicesModalEventArgs) => {
  const { checkoutId, screen, target } = args

  return {
    event: 'checkout.click',
    extra: {
      checkout_id: checkoutId,
      screen,
      target,
    },
  }
}

// Source: https://github.com/vinted/dwh-schema-registry/blob/e39aec4da4a00a8e70a8839adfbc164d04d10b91/avro/events/checkout/click.avdl#L29C3-L87C2
type CheckoutClickTarget =
  | 'service_fee_info'
  | 'escrow_fee_calculation_info'
  | 'close_screen'
  | 'savings_summary'

type ClickBuyerProtectionFeeInfoEventArgs = {
  checkoutId: string
  target: CheckoutClickTarget
  screen: string
}

export const clickBuyerProtectionFeeInfoEvent = (args: ClickBuyerProtectionFeeInfoEventArgs) => {
  const { checkoutId, screen, target } = args

  return {
    event: 'checkout.click',
    extra: {
      checkout_id: checkoutId,
      screen,
      target,
    },
  }
}

type ViewCurrencyConversionPricingDetailsEventArgs = {
  checkoutId: string
  screen: string
}

export const viewCurrencyConversionPricingDetailsEvent = (
  args: ViewCurrencyConversionPricingDetailsEventArgs,
) => {
  const { checkoutId, screen } = args

  return {
    event: 'checkout.screen',
    extra: {
      checkout_id: checkoutId,
      screen,
    },
  }
}

type ViewSalesTaxEventArgs = {
  checkoutId: string
  screen: string
}

export const viewSalesTaxEvent = (args: ViewSalesTaxEventArgs) => {
  const { checkoutId, screen } = args

  return {
    event: 'checkout.screen',
    extra: {
      checkout_id: checkoutId,
      screen,
    },
  }
}
type ViewEscrowFeeEducationEventArgs = {
  checkoutId: string
  screen: string
}

export const viewEscrowFeeEducationEvent = (args: ViewEscrowFeeEducationEventArgs) => {
  const { checkoutId, screen } = args

  return {
    event: 'checkout.screen',
    extra: {
      checkout_id: checkoutId,
      screen,
    },
  }
}

type ClickEscrowFeeCalculationEventArgs = {
  checkoutId: string
  target: CheckoutClickTarget
  screen: string
}

export const clickEscrowFeeCalculationEvent = (args: ClickEscrowFeeCalculationEventArgs) => {
  const { checkoutId, screen, target } = args

  return {
    event: 'checkout.click',
    extra: {
      checkout_id: checkoutId,
      screen,
      target,
    },
  }
}

type CloseBuyerProtectionModalEventArgs = {
  checkoutId: string
  target: CheckoutClickTarget
  screen: string
}

export const closeBuyerProtectionModalEvent = (args: CloseBuyerProtectionModalEventArgs) => {
  const { checkoutId, screen, target } = args

  return {
    event: 'checkout.click',
    extra: {
      checkout_id: checkoutId,
      screen,
      target,
    },
  }
}

type ClickSavingsSummaryModalEventArgs = {
  checkoutId: string
  screen: string
  target: CheckoutClickTarget
}

export const clickSavingsSummaryModalEvent = (args: ClickSavingsSummaryModalEventArgs) => {
  const { checkoutId, screen, target } = args

  return {
    event: 'checkout.click',
    extra: {
      checkout_id: checkoutId,
      screen,
      target,
    },
  }
}

type ClickSingleCheckoutEventArgs = {
  checkoutId?: string
  screen?: string
  target?: string
  valid?: boolean
  modalId?: string | null
  info?: {
    card_details_stored?: boolean
    payment_method?: string | null
    pickup_type?: string
    item_id?: string
  }
}

type ClickSingleCheckoutEventExtra = {
  checkout_id?: string
  modal_id?: string
  screen?: string
  target?: string
  valid?: boolean
  info?: string
}

export const clickSingleCheckoutEvent = (args: ClickSingleCheckoutEventArgs) => {
  const { target, checkoutId, screen, valid, info, modalId } = args

  const extra: ClickSingleCheckoutEventExtra = {
    target,
    checkout_id: checkoutId,
    screen: screen || 'checkout',
  }

  if (valid) extra.valid = valid
  if (info) extra.info = JSON.stringify(info)
  if (modalId) extra.modal_id = modalId

  return {
    event: 'checkout.click',
    extra,
  }
}

type ClickSelectVerificationServiceEventArgs = {
  checkoutId: string
  screen: string
  target: string
  enabled: boolean
}

type ClickSelectVerificationServiceEventExtra = {
  checkout_id: string
  screen: string
  target: string
  info: {
    check_authenticity: boolean
  }
}

export const clickSelectVerificationServiceEvent = (
  args: ClickSelectVerificationServiceEventArgs,
) => {
  const { target, checkoutId, screen, enabled } = args

  const extra: ClickSelectVerificationServiceEventExtra = {
    checkout_id: checkoutId,
    screen,
    target,
    info: {
      check_authenticity: enabled,
    },
  }

  return {
    event: 'checkout.click',
    extra,
  }
}

type SingleCheckoutInteractionEventArgs = {
  checkoutId: string
  duration: number
  orderId: string
}

export const singleCheckoutInteractionEvent = (args: SingleCheckoutInteractionEventArgs) => {
  const { duration, checkoutId, orderId } = args

  return {
    event: 'checkout.interaction',
    extra: {
      screen: 'checkout',
      action: 'screen_load_duration_in_ms',
      checkout_id: checkoutId,
      duration,
      action_details: JSON.stringify({
        id: orderId,
      }),
    },
  }
}

type SingleCheckoutTimeOnTaskEventArgs = {
  checkoutId: string
  screen?: string
  duration: number
  utc_time_from: string
  utc_time_to: string
}

type SingleCheckoutTimeOnTaskEventExtra = {
  checkout_id: string
  screen: string
  action: string
  duration: number
  action_details: string
}

export const singleCheckoutTimeOnTaskEvent = (args: SingleCheckoutTimeOnTaskEventArgs) => {
  const { checkoutId, screen, duration, utc_time_from, utc_time_to } = args

  const extra: SingleCheckoutTimeOnTaskEventExtra = {
    checkout_id: checkoutId,
    screen: screen || '',
    action: 'time_on_task_in_ms',
    duration,
    action_details: JSON.stringify({
      utc_time_from,
      utc_time_to,
    }),
  }

  return {
    event: 'checkout.interaction',
    extra,
  }
}

type ViewAddMoreButtonEventArgs = {
  checkoutId: string
  screen: string
  capabilityType: string
  capabilityDetails: boolean
}

export const viewAddMoreButtonEvent = (args: ViewAddMoreButtonEventArgs) => {
  const { checkoutId, screen, capabilityType, capabilityDetails } = args

  return {
    event: 'checkout.buyer_has_capability',
    extra: {
      checkout_id: checkoutId,
      screen,
      capability_details: capabilityDetails,
      capability_type: capabilityType,
    },
  }
}

type ClickSeeMoreInfoConversionFeeEventArgs = {
  checkoutId: string
  screen: string
  target: string
}

type ClickSeeMoreInfoConversionFeeEventExtra = {
  checkout_id: string
  screen: string
  target: string
}

export const clickSeeMoreInfoConversionFee = (args: ClickSeeMoreInfoConversionFeeEventArgs) => {
  const { target, checkoutId, screen } = args

  const extra: ClickSeeMoreInfoConversionFeeEventExtra = {
    checkout_id: checkoutId,
    screen,
    target,
  }

  return {
    event: 'checkout.click',
    extra,
  }
}
