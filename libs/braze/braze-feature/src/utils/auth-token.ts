import { decodeJwt } from 'jose'
import { pick } from 'lodash'

import { ResponseError, withRetry, ResponseCode } from '@marketplace-web/core-api/api-client-util'
import { getBrazeAuthToken, logBrazeMessage } from '@marketplace-web/braze/braze-data'
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@marketplace-web/browser/browser-storage-util'
import { withMemoizedPromise } from '@marketplace-web/vendor-abstractions/http-client-util/server'

const createResponseError = <T>(responseError: Partial<ResponseError<T>>): ResponseError<T> => ({
  status: null,
  code: ResponseCode.JsError,
  message: 'JavaScript Error',
  errors: [],
  ...responseError,
  exception: null,
})

type AuthToken = { sub: string; exp: number }

function safeDecodeJwt(token: string): Partial<AuthToken> {
  try {
    return decodeJwt(token)
  } catch (error) {
    return {}
  }
}

function isTokenExpired(authToken: Partial<AuthToken>) {
  return typeof authToken.exp !== 'number' || new Date(authToken.exp * 1000) <= new Date()
}

function isTokenSubjectMismatch(authToken: Partial<AuthToken>, expectedSubject: string) {
  return authToken.sub !== expectedSubject
}

function isValidAuthToken(token: string | null, externalUserId: string): token is string {
  if (typeof token !== 'string') return false

  const decodedToken = safeDecodeJwt(token)

  return !isTokenExpired(decodedToken) && !isTokenSubjectMismatch(decodedToken, externalUserId)
}

const getValidatedBrazeAuthToken = async (externalUserId: string) => {
  const response = await getBrazeAuthToken()

  if ('errors' in response) return response

  const decodedToken = safeDecodeJwt(response.jwt)

  if (isTokenExpired(decodedToken)) {
    return createResponseError({
      message: JSON.stringify({
        reason: 'received expired token',
        token: pick(decodedToken, ['exp', 'sub']),
        externalUserId,
      }),
    })
  }

  if (isTokenSubjectMismatch(decodedToken, externalUserId)) {
    return createResponseError({
      message: JSON.stringify({
        reason: 'subject mismatch',
        token: pick(decodedToken, ['exp', 'sub']),
        externalUserId,
      }),
    })
  }

  return response
}

const AUTH_TOKEN_STORAGE_KEY = 'brazeSdkAuthToken'

type FetchAuthTokenOptions = { externalUserId: string } | { externalUserId: string; fresh: true }

export const fetchAuthToken = withMemoizedPromise(
  async (options: FetchAuthTokenOptions) => {
    const { externalUserId } = options

    if (!('fresh' in options)) {
      const storedToken = getLocalStorageItem(AUTH_TOKEN_STORAGE_KEY)

      if (isValidAuthToken(storedToken, externalUserId)) return storedToken
    }

    const response = await withRetry(getValidatedBrazeAuthToken, {
      timesToRetry: 3,
      retryDelay: 0,
    })(externalUserId)

    if ('errors' in response) {
      let extra = response.status ? `status: ${String(response.status)}` : `code: ${response.code}`

      if (response.code === ResponseCode.JsError && response.message.includes('reason')) {
        extra = response.message
      }

      logBrazeMessage('failedJwtRetrieval', extra)

      return null
    }

    const { jwt } = response

    setLocalStorageItem(AUTH_TOKEN_STORAGE_KEY, jwt)

    return jwt
  },
  { clearOnException: true },
)
