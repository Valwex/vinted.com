import { ResponseError, ResponseCode } from '@marketplace-web/core-api/api-client-util'

export const isNetworkError = (response: Record<string, unknown> | ResponseError<unknown>) => {
  if (!('errors' in response)) return false

  return response.code === 'ERR_NETWORK'
}

export const isTimeoutError = (response: Record<string, unknown> | ResponseError<unknown>) => {
  if (!('errors' in response)) return false

  return response.code === 'ETIMEDOUT'
}

export const isIdTokenInvalidError = (
  response: Record<string, unknown> | ResponseError<unknown>,
) => {
  if (!('code' in response)) return false

  return response.code === ResponseCode.IdTokenInvalid
}
