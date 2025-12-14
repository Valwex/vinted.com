// Source: https://github.com/vinted/dwh-schema-registry/blob/5387d2ce7b44ee93711a15dfb97c60a4d984f22c/avro/events/common/shared/user.avdl#L25
type UserTarget = 'save_address' | 'submit_kyb'

type UserKybSuccessEventArgs = {
  businessAccountId: number
}

export const userKybSuccessEvent = (args: UserKybSuccessEventArgs) => {
  return {
    event: 'user.kyb_success',
    extra: {
      business_account_id: args.businessAccountId,
    },
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

type KycClickEventArgs = {
  target: string
  details?: string | number | null
}

export const kycClickEvent = (args: KycClickEventArgs) => {
  const extra: KycClickEventArgs = {
    target: args.target,
    ...(args.details ? { details: args.details } : {}),
  }

  return {
    event: 'kyc.user.click',
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

type KycViewScreenEventArgs = {
  screen: string
  details?: string | number | null
}

export const kycViewScreenEvent = (args: KycViewScreenEventArgs) => {
  const extra: KycViewScreenEventArgs = {
    screen: args.screen,
    ...(args.details ? { details: args.details } : {}),
  }

  return {
    event: 'kyc.user.view_screen',
    extra,
  }
}

type WalletClickEventArgs = {
  screen: string
  target: string
  target_name: string
  target_details: string | null
}

export const walletClickEvent = (args: WalletClickEventArgs) => {
  const { screen, target, target_details, target_name } = args

  return {
    event: 'wallet.click',
    extra: { screen, target, target_details, target_name },
  }
}
