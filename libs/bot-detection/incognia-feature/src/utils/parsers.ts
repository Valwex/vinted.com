import { decodeJwt } from 'jose'
import { get } from 'lodash'

import { ResponseError } from '@marketplace-web/core-api/api-client-util'
import { isBlockedByDataDome } from '@marketplace-web/bot-detection/data-dome-util'

export const parseUserIdFromResponse = (response: Record<string, unknown> | ResponseError) => {
  const userId: unknown = get(response, 'user.id')

  if (typeof userId === 'number') {
    return userId
  }

  const accessToken: unknown = get(response, 'access_token')

  if (typeof accessToken === 'string') {
    const { sub } = decodeJwt(accessToken)

    return sub ? Number(sub) : null
  }

  return null
}

const isError = (response: Record<string, unknown> | ResponseError): response is ResponseError => {
  return 'errors' in response
}

export const parseEventStatusFromResponse = (response: Record<string, unknown> | ResponseError) => {
  if (!isError(response)) return 'AUTHORIZED'

  const status = Number(response.status)

  if (status >= 500 && status <= 599) return null
  if (isBlockedByDataDome(response)) return null

  return 'DENIED'
}
