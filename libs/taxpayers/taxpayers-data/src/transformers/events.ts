// Source: https://github.com/vinted/dwh-schema-registry/blob/5387d2ce7b44ee93711a15dfb97c60a4d984f22c/avro/events/common/shared/user.avdl#L25
type UserTarget =
  | 'taxpayer_forms'
  | 'view_form'
  | 'save_address'
  | 'confirm'
  | 'hyperlink'
  | 'start_special_verification'
  | 'identity_verification_continue'
  | 'billing_address_verification_continue'
  | 'tin_verification_continue'
  | 'place_of_birth_verification_continue'
  | 'vat_number_verification_continue'
  | 'business_information_verification_continue'
  | 'business_tin_verification_continue'
  | 'business_vat_number_verification_continue'
  | 'taxpayers_special_verification_balance_block_modal'

type TaxpayersFormForceTriggerEventArgs = {
  screen: string
}

type TaxpayersFormForceTriggerEventExtra = {
  screen: string
}

export const taxpayersFormForceTriggerEvent = (args: TaxpayersFormForceTriggerEventArgs) => {
  const extra: TaxpayersFormForceTriggerEventExtra = {
    screen: args.screen,
  }

  return {
    event: 'taxpayers.form_force_trigger',
    extra,
  }
}

type TaxpayersInputEventArgs = {
  screen: string
  target: string
  value?: string
  state: 'focus' | 'unfocus'
}

export const taxpayersInputEvent = (args: TaxpayersInputEventArgs) => {
  const { screen, target, value, state } = args

  return {
    event: 'taxpayers.input',
    extra: { screen, target, value, state },
  }
}

type TaxpayersViewScreenEventArgs = {
  screen: string
  details: string | null
}

export const taxpayersViewScreenEvent = (args: TaxpayersViewScreenEventArgs) => {
  const { screen, details } = args

  return {
    event: 'taxpayers.view_screen',
    extra: { screen, details },
  }
}

type TaxpayerTimeOnTaskEventArgs = {
  screen: string
  duration: number
}

type TaxpayerTimeOnTaskEventExtra = {
  screen: string
  duration: number
}

export const taxpayerTimeOnTaskEvent = (args: TaxpayerTimeOnTaskEventArgs) => {
  const extra: TaxpayerTimeOnTaskEventExtra = {
    screen: args.screen,
    duration: args.duration,
  }

  return {
    event: 'taxpayers.time_in_dac7_flow',
    extra,
  }
}

type TaxpayersClickEventArgs = {
  screen: string
  target: 'block_modal' | 'banner' | 'hyperlink' | 'button'
  target_name: string
  target_details: string | null
}

export const taxpayersClickEvent = (args: TaxpayersClickEventArgs) => {
  const { screen, target, target_details, target_name } = args

  return {
    event: 'taxpayers.click',
    extra: {
      screen,
      target,
      target_details,
      target_name,
    },
  }
}

type TaxpayersViewEventArgs = {
  screen: string
  target: 'block_modal' | 'banner'
  target_details: string
}

export const taxpayersViewEvent = (args: TaxpayersViewEventArgs) => {
  const { screen, target, target_details } = args

  return {
    event: 'taxpayers.view',
    extra: { screen, target, target_details },
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
type ViewEventTarget = 'taxpayers_tax_rules_testimonial' | 'verification_completed'

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

type ViewScreenEventArgs = {
  screen: string
}

export const viewScreenEvent = (args: ViewScreenEventArgs) => {
  const { screen } = args

  const extra = {
    screen,
  }

  return {
    event: 'user.view_screen',
    extra,
  }
}
