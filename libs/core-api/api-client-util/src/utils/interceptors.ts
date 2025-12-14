import { AxiosInstance, AxiosResponse } from 'axios'

import { ClientCookieManager, cookiesDataByName } from '@marketplace-web/environment/cookies-util'
import { logWarning } from '@marketplace-web/observability/logging-util'

import { ResponseCode } from '../constants/response-codes'

const cookies = new ClientCookieManager()
const X_CSRF_TOKEN_HEADER = 'X-CSRF-Token'
const X_ANON_ID_HEADER = 'X-Anon-Id'
const ACCEPT_LANGUAGE_HEADER = 'Accept-Language'

export const csrfTokenInterceptor = (instance: AxiosInstance) =>
  instance.interceptors.request.use(config => {
    const csrfToken = process.env.NEXT_PUBLIC_CSRF_TOKEN

    if (!csrfToken) throw new Error('Missing Next.js CSRF token')

    config.headers.set(X_CSRF_TOKEN_HEADER, csrfToken)

    return config
  })

export const errorInterceptor = (instance: AxiosInstance) =>
  instance.interceptors.response.use((response: AxiosResponse) => {
    if (typeof response.data.code === 'undefined') {
      logWarning(
        `API code is missing in response: ${response.request.responseURL} with status: ${response.status}`,
      )
    }

    if (response.data.code && response.data.code !== ResponseCode.Ok) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({ response })
    }

    return Promise.resolve(response)
  })

export const localeInterceptor = (instance: AxiosInstance) =>
  instance.interceptors.request.use(config => {
    const locale = document.querySelector('meta[name="accept-language"]')?.getAttribute('content')

    if (!locale) {
      logWarning('Unable to retrieve locale for API call')
    }

    if (locale) config.headers.set(ACCEPT_LANGUAGE_HEADER, locale)

    return config
  })

export const anonIdInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(config => {
    const anonId = cookies.get(cookiesDataByName.anon_id)

    config.headers.set(X_ANON_ID_HEADER, anonId)

    return config
  })
}

export const appendAcceptWebPHeaderInterceptor = (instance: AxiosInstance) =>
  instance.interceptors.request.use(config => {
    if (!config.headers.hasAccept('image/webp')) {
      const accept = config.headers.getAccept()?.toString().split(',') ?? []

      accept.push('image/webp')

      config.headers.setAccept(accept)
    }

    return config
  })

export const appendPriorityInterceptor = (instance: AxiosInstance) =>
  instance.interceptors.request.use(config => {
    config.headers.set('Priority', 'u=3')

    return config
  })
