// Source: https://github.com/vinted/dwh-schema-registry/blob/5387d2ce7b44ee93711a15dfb97c60a4d984f22c/avro/events/common/shared/user.avdl#L25
export type UserTarget =
  | 'login_with_facebook'
  | 'login_with_google'
  | 'login_with_apple'
  | 'switch_to_login'
  | 'switch_to_registration'
  | 'switch_to_email_login'
  | 'switch_to_email_registration'
  | 'close_select_type_modal'
  | 'terms_and_conditions'
  | 'privacy_policy'
  | 'having_trouble'
  | 'social_login_with_password'
  | 'forgot_password'
  | 'newsletter_checkbox'
  | 'policies_checkbox'
  | 'email'
  | 'register_with_social'
  | 'register_with_email'
  | 'switch_to_reset_password'
  | 'full_name'
  | 'username'
  | 'password'
  | 'zip_code'

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

type UserInputEventArgs = {
  screen?: string
  target: string
  value?: string | null
  state: 'focus' | 'unfocus'
  tempUuid?: string
  isDynamic?: boolean
}

export const userInputEvent = (args: UserInputEventArgs) => {
  const { state, target, value, screen, tempUuid, isDynamic } = args
  const extra = {
    screen,
    target,
    value,
    state,
    upload_session_id: tempUuid,
    is_dynamic: isDynamic || false,
  }

  return {
    event: 'user.input',
    extra,
  }
}
