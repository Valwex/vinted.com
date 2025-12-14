// Source: https://github.com/vinted/dwh-schema-registry/blob/5387d2ce7b44ee93711a15dfb97c60a4d984f22c/avro/events/common/shared/user.avdl#L25
type UserTarget =
  | 'balance'
  | 'settings'
  | 'profile'
  | 'customize'
  | 'enter_donations_from_settings'
  | 'enter_donations_from_web_menu'
  | 'log_out'
  // TODO: add this to dwh-schema-registry
  | 'orders'
  // TODO: add this to dwh-schema-registry
  | 'invoices'
  // TODO: add this to dwh-schema-registry
  | 'referrals'

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

type ReferralsPageUserClickEventExtra = {
  target: string
  screen: string
}

export const referralsPageUserClickEvent = (extra: ReferralsPageUserClickEventExtra) => {
  return {
    event: 'referral_page.user.click',
    extra,
  }
}

type DonationsClickEventExtra = {
  target: UserTarget
}

export const donationsClickEvent = (extra: DonationsClickEventExtra) => {
  return {
    event: 'user.click_donations',
    extra,
  }
}
