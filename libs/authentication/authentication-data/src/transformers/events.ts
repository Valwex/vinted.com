import { ErrorItem } from '@marketplace-web/core-api/api-client-util'

type AuthType = 'internal' | 'facebook' | 'google' | 'apple'

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

type AuthenticateFailEventExtra = {
  type: AuthType
  reason: string
  details?: string
  country?: string
}

type AuthenticateFailEventArgs = {
  type: AuthType
  errors?: Array<ErrorItem>
  error?: string
  country?: string
}

export const authenticateFailEvent = (args: AuthenticateFailEventArgs) => {
  const { type, errors, error, country } = args

  const extra: AuthenticateFailEventExtra = {
    type,
    reason: 'validation_error',
    details: errors?.map(({ value }) => value).join(', ') || error,
    country,
  }

  return { event: 'user.authenticate_fail', extra }
}
