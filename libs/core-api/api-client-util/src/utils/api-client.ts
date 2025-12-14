import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { get, isObject as _isObject } from 'lodash'

import { serverSide } from '@marketplace-web/environment/environment-util'

import { ResponseCode } from '../constants/response-codes'

import { ApiClientRequestConfig, AxiosErrorResponseData, Response, ResponseError } from '../types'
import { isAxiosError, isAxiosResponse } from './axios'

const isObject = (value: unknown): value is Record<string, unknown> => _isObject(value)

class ApiClient {
  public axios: AxiosInstance

  constructor(
    protected config?: AxiosRequestConfig,
    interceptors?: Array<((instance: AxiosInstance) => void) | undefined>,
  ) {
    this.axios = axios.create(config)

    interceptors?.forEach(interceptor => interceptor?.(this.axios))
  }

  get<T, E = unknown, C extends ApiClientRequestConfig = ApiClientRequestConfig>(
    url: string,
    config?: C,
  ) {
    return this.request<T, E, C>('get', url, config)
  }

  put<T, E = unknown, C extends ApiClientRequestConfig = ApiClientRequestConfig>(
    url: string,
    data?: any,
    config?: C,
  ) {
    return this.request<T, E, C>('put', url, config, data)
  }

  patch<T, E = unknown, C extends ApiClientRequestConfig = ApiClientRequestConfig>(
    url: string,
    data?: any,
    config?: C,
  ) {
    return this.request<T, E, C>('patch', url, config, data)
  }

  post<T, E = unknown, C extends ApiClientRequestConfig = ApiClientRequestConfig>(
    url: string,
    data?: any,
    config?: C,
  ) {
    return this.request<T, E, C>('post', url, config, data)
  }

  delete<T, E = unknown, C extends ApiClientRequestConfig = ApiClientRequestConfig>(
    url: string,
    config?: C,
  ) {
    return this.request<T, E, C>('delete', url, config)
  }

  private request<T, E, C extends ApiClientRequestConfig>(
    method: C['method'],
    url: string,
    config?: C,
    data?: any,
  ): Promise<C extends { throwError: true } ? Response<T> : Response<T> | ResponseError<E>>
  private request(
    method: ApiClientRequestConfig['method'],
    url: string,
    { throwError, ...config }: ApiClientRequestConfig = {},
    data?: any,
  ) {
    this.validateRequest(`${method || ''}: ${url}`)

    return this.axios
      .request({ ...config, method, url, data })
      .then(this.returnAxiosData, throwError ? undefined : this.parseException)
  }

  // eslint-disable-next-line class-methods-use-this
  private returnAxiosData<T>(response: AxiosResponse<T>) {
    return response.data
  }

  // eslint-disable-next-line class-methods-use-this
  private parseException<T>(exception: unknown): ResponseError<T> {
    const errorResponse: ResponseError<T> = {
      status: null,
      code: get(exception, 'code', ResponseCode.JsError) as string,
      message: get(exception, 'message', '') as string,
      message_code: get(exception, 'message_code', '') as string,
      errors: [],
      payload: undefined,
      exception,
    }

    // Backend errors
    if (isObject(exception) && isAxiosResponse<AxiosErrorResponseData<T>>(exception.response)) {
      const { data, headers, status } = exception.response

      errorResponse.status = status
      errorResponse.code = data.code ?? ResponseCode.JsError
      if (data.message) errorResponse.message = data.message
      if (data.message_code) errorResponse.message_code = data.message_code
      errorResponse.errors = data.errors || []
      errorResponse.payload = data.payload
      errorResponse.responseData = data
      errorResponse.responseHeaders = headers

      return errorResponse
    }

    // Generic HTTP errors
    if (isAxiosError<AxiosErrorResponseData<T>>(exception) && exception.response) {
      const { status, statusText } = exception.response

      errorResponse.code = ResponseCode.HttpError
      errorResponse.status = status
      errorResponse.message = statusText

      return errorResponse
    }

    // Network or Javascript error
    return errorResponse
  }

  // eslint-disable-next-line class-methods-use-this
  protected validateRequest(call: string) {
    if (serverSide) throw new Error(`ApiClient can only be used on the client side (${call})`)
  }
}

export default ApiClient
