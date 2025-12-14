import { AxiosError, AxiosInstance } from 'axios'

import { extractErrorResponseCode, ResponseCode } from '@marketplace-web/core-api/api-client-util'
import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'

import { TWO_FA_CANCELLED_EVENT, TWO_FA_COMPLETED_EVENT } from '../constants'
import { USERS_VERIFICATION_URL } from '../constants/routes'

export const phoneVerificationInterceptor = (instance: AxiosInstance) =>
  instance.interceptors.response.use(undefined, (error: AxiosError) => {
    if (extractErrorResponseCode(error) === ResponseCode.UserVerificationRequired) {
      navigateToPage(USERS_VERIFICATION_URL)
    }

    return Promise.reject(error)
  })

function isTwoFaRequiredErrorResponse(
  error: AxiosError,
): error is AxiosError<{ payload: { entity_id: string } }> {
  return extractErrorResponseCode(error) === ResponseCode.TwoFARequired
}

export const twoFAInterceptor = (instance: AxiosInstance) =>
  instance.interceptors.response.use(undefined, (error: AxiosError) => {
    if (!isTwoFaRequiredErrorResponse(error) || !error.response) return Promise.reject(error)

    const { response } = error

    const event = new CustomEvent<string>('twoFARequired', {
      detail: response.data.payload.entity_id,
    })

    window.dispatchEvent(event)

    return new Promise((resolve, reject) => {
      const abortController = new AbortController()

      const repeatRequest = () => {
        instance.request(response.config).then(resolve).catch(reject)
        abortController.abort()
      }

      const rejectRequest = () => {
        reject(error)
        abortController.abort()
      }

      window.addEventListener(TWO_FA_COMPLETED_EVENT, repeatRequest, {
        signal: abortController.signal,
      })

      window.addEventListener(TWO_FA_CANCELLED_EVENT, rejectRequest, {
        signal: abortController.signal,
      })
    })
  })
