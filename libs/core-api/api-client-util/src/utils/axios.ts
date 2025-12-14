import { AxiosError, AxiosResponse } from 'axios'
import { isObject } from 'lodash'

import { ResponseCode } from '../constants/response-codes'

const isValueInObject = <T extends string | number>(
  value: unknown,
  object: Record<string, T>,
): value is T => Object.values(object).includes(value as T)

export function isAxiosResponse<T>(response: unknown): response is AxiosResponse<T> {
  return (
    response != null &&
    isObject(response) &&
    'data' in response &&
    'status' in response &&
    'statusText' in response &&
    'headers' in response &&
    'config' in response &&
    'request' in response
  )
}

export function isAxiosError<T>(error: AxiosError | any): error is AxiosError<T> {
  return error?.isAxiosError
}

export const extractErrorResponseCode = (error: unknown): ResponseCode | undefined => {
  if (!isAxiosError(error)) return undefined

  const responseData = error?.response?.data

  if (!isObject(responseData)) return undefined
  if (!('code' in responseData)) return undefined

  const { code } = responseData

  if (typeof code !== 'number') return undefined
  if (!isValueInObject(code, ResponseCode)) return undefined

  return code
}
