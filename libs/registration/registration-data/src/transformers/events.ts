import { ErrorItem } from '@marketplace-web/core-api/api-client-util'

// Source: https://github.com/vinted/dwh-schema-registry/blob/5387d2ce7b44ee93711a15dfb97c60a4d984f22c/avro/events/common/shared/user.avdl#L25
export type UserTarget = 'login' | 'use_suggested_username' | 'submit_suggested_username'

export type RegistrationBehaviourAction = 'start' | 'click' | 'submit' | 'end'

export type RegistrationBehaviourClickActionDetails =
  | 'privacy-policy-link'
  | 'terms-and-conditions-link'
  | 'registration-faq-link'

export type RegistrationBehaviourEndActionDetails = 'modal-closed' | 'page-closed'

type RegistrationBehaviourSubmitActionDetails = 'successful' | 'unsuccessful'

export type RegistrationBehaviourActionDetails =
  | RegistrationBehaviourClickActionDetails
  | RegistrationBehaviourSubmitActionDetails
  | RegistrationBehaviourEndActionDetails

export type RegistrationType = 'email' | 'apple' | 'google' | 'facebook'

type AuthType = 'internal' | 'facebook' | 'google' | 'apple'

type UserRegisterSuccessEventArgs = {
  type: AuthType
  userId?: number
}

type UserRegisterSuccessEventExtra = {
  type: AuthType
}

export const userRegisterSuccessEvent = (args: UserRegisterSuccessEventArgs) => {
  const { type, userId } = args

  const extra: UserRegisterSuccessEventExtra = { type }

  return { event: 'user.register_success', extra, userId }
}

type UserRegisterFailEventExtra = {
  type: AuthType
  reason: string
  details?: string
}

type UserRegisterFailEventArgs = {
  type: AuthType
  errors?: Array<ErrorItem>
}

export const userRegisterFailEvent = (args: UserRegisterFailEventArgs) => {
  const { type, errors } = args

  const extra: UserRegisterFailEventExtra = {
    type,
    reason: 'validation_error',
    details: errors?.map(error => error.value).join(', '),
  }

  return { event: 'user.register_fail', extra }
}

type AuthenticateSuccessEventArgs = {
  type: AuthType
  userId?: number
  country?: string
}

type AuthenticateSuccessEventExtra = {
  type: AuthType
  country?: string
}

export const authenticateSuccessEvent = (args: AuthenticateSuccessEventArgs) => {
  const { type, userId, country } = args

  const extra: AuthenticateSuccessEventExtra = { type, country }

  return { event: 'user.authenticate_success', extra, userId }
}

type RegistrationFormBehaviourEventArgs = {
  taskId: string
  fingerprint: string
  countryCode: string
  screen: string
  authenticationType: RegistrationType
  action: RegistrationBehaviourAction
  actionDetails?: RegistrationBehaviourActionDetails
  inApp: boolean
  userId?: number
}

export const registrationFormBehaviourEvent = ({
  taskId,
  fingerprint,
  countryCode,
  screen,
  authenticationType,
  action,
  actionDetails,
  inApp,
  userId,
}: RegistrationFormBehaviourEventArgs) => {
  return {
    event: 'registration.form_behaviour',
    userId,
    extra: {
      task_id: taskId,
      screen,
      authentication_type: authenticationType,
      action,
      in_app: inApp,
      country_code: countryCode,
      fingerprint,
      action_details: actionDetails,
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
