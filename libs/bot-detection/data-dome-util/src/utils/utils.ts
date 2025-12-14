import { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { get } from 'lodash'

import {
  AxiosErrorResponseData,
  Response,
  ResponseError,
} from '@marketplace-web/core-api/api-client-util'

type DataDomeError = {
  url: string
}

export const isAxiosErrorBlockedByDataDome = <T extends AxiosErrorResponseData<unknown>>(
  headers: AxiosResponse<T>['headers'],
  data: AxiosResponse<T>['data'],
): data is T & DataDomeError => !!headers['x-dd-b'] && 'url' in data

export const isErrorBlockedByDataDome = <T extends Record<string, unknown>>(
  headers: Record<string, string>,
  data: T | string | undefined,
): data is T & DataDomeError => !!headers['x-dd-b'] && typeof data === 'object' && 'url' in data

export const isBlockedByDataDome = (response: Response<unknown> | ResponseError<unknown>) => {
  if (!('errors' in response)) return false
  if (response.status !== 403) return false

  return !!get(response, 'exception.response.headers.x-dd-b')
}

export const parseUrlWithData = (config: InternalAxiosRequestConfig<unknown> | undefined) => {
  if (!config) return ''

  let url = `${config.baseURL}${config.url}`

  try {
    const { data } = config

    if (typeof data !== 'string') return url

    const unknownData: unknown = JSON.parse(data)

    if (typeof unknownData !== 'object' || unknownData === null) return url

    if ('grant_type' in unknownData && typeof unknownData.grant_type === 'string') {
      url += ` grant_type=${unknownData.grant_type}`
    }

    if ('provider' in unknownData && typeof unknownData.provider === 'string') {
      url += ` provider=${unknownData.provider}`
    }

    return url
  } catch {
    return url
  }
}
