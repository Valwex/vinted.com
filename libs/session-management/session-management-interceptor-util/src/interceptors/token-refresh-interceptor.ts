import { AxiosError, AxiosInstance } from 'axios'

import { HttpStatus } from '@marketplace-web/core-api/api-client-util'

import { refreshSessionTokens } from '../api'

export const tokenRefreshInterceptor = (instance: AxiosInstance) => {
  let inFlightSessionRefresh: ReturnType<typeof refreshSessionTokens> | null = null

  instance.interceptors.response.use(undefined, async (error: AxiosError) => {
    if (error.config && error.response && error.response.status === HttpStatus.Unauthorized) {
      if (!inFlightSessionRefresh) {
        inFlightSessionRefresh = refreshSessionTokens()
      }

      const refreshResponse = await inFlightSessionRefresh

      inFlightSessionRefresh = null

      if ('errors' in refreshResponse) {
        return Promise.reject(error)
      }

      return instance.request(error.config)
    }

    return Promise.reject(error)
  })
}
