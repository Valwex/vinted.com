import { VerificationChannel } from '../constants/verification'

// Source: https://github.com/vinted/dwh-schema-registry/blob/5387d2ce7b44ee93711a15dfb97c60a4d984f22c/avro/events/common/shared/user.avdl#L25
type UserTarget =
  | 'help'
  | 'help_center_link'
  | 'submit'
  | 'verify'
  | 'didnt_receive_email'
  // TODO: Add it to the dwh-schema-registry
  | 'phone_prefix_select_option'
  // TODO: Add it to the dwh-schema-registry
  | 'phone_prefix_select'

type VerificationEventArgs = {
  source: string
  userTwoFactorAuthId?: string
  type: VerificationChannel
}

type VerificationEventExtra = {
  source: string
  user_two_factor_auth_id?: string
  type: string
}

export const viewVerificationScreenEvent = (args: VerificationEventArgs) => {
  const { source, userTwoFactorAuthId, type } = args

  const extra: VerificationEventExtra = {
    source,
    type,
    user_two_factor_auth_id: userTwoFactorAuthId,
  }

  return {
    event: 'user.view_verification_screen',
    extra,
  }
}

export const clickVerifyEvent = (args: VerificationEventArgs) => {
  const { source, userTwoFactorAuthId, type } = args

  const extra: VerificationEventExtra = {
    source,
    type,
    user_two_factor_auth_id: userTwoFactorAuthId,
  }

  return {
    event: 'user.click_verify',
    extra,
  }
}

export const clickGetHelpVerificationEvent = (args: VerificationEventArgs) => {
  const { source, userTwoFactorAuthId, type } = args

  const extra: VerificationEventExtra = {
    source,
    type,
    user_two_factor_auth_id: userTwoFactorAuthId,
  }

  return {
    event: 'user.click_get_help_verification',
    extra,
  }
}

export const clickResendVerification = (args: VerificationEventArgs) => {
  const { source, userTwoFactorAuthId, type } = args

  const extra: VerificationEventExtra = {
    source,
    type,
    user_two_factor_auth_id: userTwoFactorAuthId,
  }

  return {
    event: 'user.click_resend_verification',
    extra,
  }
}

export const clickCancelVerification = (args: VerificationEventArgs) => {
  const { source, userTwoFactorAuthId, type } = args

  const extra: VerificationEventExtra = {
    source,
    type,
    user_two_factor_auth_id: userTwoFactorAuthId,
  }

  return {
    event: 'user.click_cancel_verification',
    extra,
  }
}

export const startPhonePrefixSearch = () => {
  return {
    event: 'user.start_phone_prefix_search',
  }
}

export const closePhonePrefixDropdown = () => {
  return {
    event: 'user.close_phone_prefix_dropdown',
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

type FormBehaviourEventArgs = {
  taskId: string
  action: string
  actionDetails?: string
  userId?: number
}

export const phoneNumberFormBehaviourEvent = ({
  taskId,
  action,
  actionDetails,
  userId,
}: FormBehaviourEventArgs) => {
  return {
    event: 'phone_number.from_behaviour',
    userId,
    extra: {
      task_id: taskId,
      action,
      action_details: actionDetails,
    },
  }
}

export const twoFAFormBehaviourEvent = ({
  taskId,
  action,
  actionDetails,
  userId,
}: FormBehaviourEventArgs) => {
  return {
    event: 'phone_verification.from_behaviour',
    userId,
    extra: {
      task_id: taskId,
      action,
      action_details: actionDetails,
    },
  }
}
