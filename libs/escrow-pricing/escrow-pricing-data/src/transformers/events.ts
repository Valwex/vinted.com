// Source: https://github.com/vinted/dwh-schema-registry/blob/5387d2ce7b44ee93711a15dfb97c60a4d984f22c/avro/events/common/shared/user.avdl#L25
type UserTarget =
  | 'service_fee_info'
  | 'close_screen'
  | 'pricing_details'
  | 'refund_policy_link'
  | 'physical_auth_buyer'
  | 'physical_auth_seller'
  | 'physical_auth_learn_more'
  | 'electronics_verification_learn_more'
  | 'physical_auth_got_it'
  | 'electronics_verification_got_it'
  | 'discount_info'
  | 'item_verification_fee_info'
  | 'close_shipping_info_banner'
  | 'electronics_verification_buyer'
  | 'electronics_verification_seller'

type viewShippingPriceEventArgs = {
  prices: Array<string>
  screen: string
  itemId?: number
  transactionId?: number
}

type ViewShippingPriceEventExtra = {
  prices: Array<string> | null
  screen: string
  item_id?: number
  transaction_id?: number
}

export const viewShippingPriceEvent = (args: viewShippingPriceEventArgs) => {
  const { prices, screen, itemId, transactionId } = args

  const extra: ViewShippingPriceEventExtra = {
    prices: prices.length ? prices : null,
    screen,
  }

  if (itemId) extra.item_id = itemId
  if (transactionId) extra.transaction_id = transactionId

  return {
    event: 'user.view_shipping_price',
    extra,
  }
}

type ClickEventArgs = {
  target: UserTarget
  screen?: string | null
  targetDetails?: string | null
  path?: string | null
  env?: string | null
}

type ClickEventExtra = {
  target: UserTarget
  screen?: string
  target_details?: string
  path?: string | null
  env?: string | null
}

export const clickEvent = (args: ClickEventArgs) => {
  const { target, screen, targetDetails, env, path } = args
  const extra: ClickEventExtra = { target }

  if (screen) extra.screen = screen

  if (targetDetails) extra.target_details = targetDetails

  if (env) extra.env = env

  if (path) extra.path = path

  return {
    event: 'user.click',
    extra,
  }
}

// Source: https://github.com/vinted/dwh-schema-registry/blob/master/avro/events/user/view.avdl#L25
type ViewEventTarget =
  | 'physical_auth_buyer'
  | 'physical_auth_seller'
  | 'electronics_verification_buyer'
  | 'electronics_verification_seller'
  | 'campaign_landing_page'

type ViewEventArgs = {
  target: ViewEventTarget
  targetDetails?: string
  screen?: string
}

type ViewEventExtra = {
  target: ViewEventTarget
  target_details?: string
  screen?: string
}

export const viewEvent = (args: ViewEventArgs) => {
  const { target, targetDetails, screen } = args

  const extra: ViewEventExtra = {
    target,
  }

  if (targetDetails) extra.target_details = targetDetails
  if (screen) extra.screen = screen

  return {
    event: 'user.view',
    extra,
  }
}

type ItemPageViewEventExtra = {
  target: string
  item_id: string
  details?: string
  item_page_session_id?: string
}

export const itemPageViewEvent = (args: ItemPageViewEventExtra) => {
  const { target, item_id, details, item_page_session_id } = args

  const extra: ItemPageViewEventExtra = {
    target,
    item_id,
  }

  if (details) extra.details = details
  if (item_page_session_id) extra.item_page_session_id = item_page_session_id

  return {
    event: 'item_page.view',
    extra,
  }
}
