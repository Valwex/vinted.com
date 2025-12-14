import { AxiosInstance, AxiosError, AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios'

import { AxiosErrorResponseData } from '@marketplace-web/core-api/api-client-util'
import { logMessage } from '@marketplace-web/observability/logging-util'

import {
  dataDomeResponseDisplayedDurationTimer,
  dataDomeResponseErrorDurationTimer,
  incrementDataDomeRequestBlocked,
  incrementDataDomeRequestHandled,
  incrementDataDomeScriptMissing,
} from '../utils/observability'
import {
  DD_READY_EVENT,
  DD_RESPONSE_DISPLAYED_EVENT,
  DD_RESPONSE_ERROR_EVENT,
  DD_RESPONSE_UNLOAD_EVENT,
} from '../constants/events'
import { isAxiosErrorBlockedByDataDome, parseUrlWithData } from '../utils/utils'

const SCRIPT_FAILS_TO_TRIGGER_TIMEOUT = 15_000

const handleDataDomeCaptchaFailedToRender = ({
  eventAbortController,
  headers,
  url,
  reason,
  timeoutId,
}: {
  eventAbortController: AbortController
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders | undefined
  url: string
  reason: string
  timeoutId: NodeJS.Timeout | undefined
}) => {
  incrementDataDomeScriptMissing({ reason, url })

  logMessage('DataDome captcha failed to render', {
    feature: 'data-dome-script-detection',
    extra: JSON.stringify({
      blockedRequestId: headers?.['x-request-id'],
      blockedDataDomeId: headers?.['x-datadome-cid'],
      blockedUrl: url,
      reason,
    }),
  })

  eventAbortController.abort()
  clearTimeout(timeoutId)
}

const handleDataDomeCaptchaRendered = ({
  timeoutId,
  event,
  eventAbortController,
  url,
}: {
  timeoutId: NodeJS.Timeout
  event: string
  eventAbortController: AbortController
  url: string
}) => {
  clearTimeout(timeoutId)
  incrementDataDomeRequestHandled({ event, url })
  eventAbortController.abort()
}

export const missingDataDomeScriptDetectionInterceptor = (instance: AxiosInstance) => {
  let isScriptInitialized = false

  if ('window' in globalThis) {
    globalThis.window.addEventListener(DD_READY_EVENT, () => {
      isScriptInitialized = true
    })
  }

  instance.interceptors.response.use(
    undefined,
    (error: AxiosError<AxiosErrorResponseData<unknown>>) => {
      if (
        error.response &&
        isAxiosErrorBlockedByDataDome(error.response.headers, error.response.data)
      ) {
        const commonTrackingData = {
          headers: error.response?.headers,
          url: parseUrlWithData(error.response?.config),
          eventAbortController: new AbortController(),
        }
        const eventListenerOptions: AddEventListenerOptions = {
          signal: commonTrackingData.eventAbortController.signal,
          once: true,
        }

        incrementDataDomeRequestBlocked(commonTrackingData)

        if (!isScriptInitialized) {
          handleDataDomeCaptchaFailedToRender({
            reason: 'script_missing',
            timeoutId: undefined,
            ...commonTrackingData,
          })

          return Promise.reject(error)
        }

        const stopResponseDisplayedTimer = dataDomeResponseDisplayedDurationTimer()
        const stopResponseErrorTimer = dataDomeResponseErrorDurationTimer()

        const timeoutId = setTimeout(() => {
          handleDataDomeCaptchaFailedToRender({
            reason: `timeout_${SCRIPT_FAILS_TO_TRIGGER_TIMEOUT / 1000}s`,
            timeoutId,
            ...commonTrackingData,
          })
        }, SCRIPT_FAILS_TO_TRIGGER_TIMEOUT)

        window.addEventListener(
          DD_RESPONSE_DISPLAYED_EVENT,
          () => {
            handleDataDomeCaptchaRendered({
              timeoutId,
              event: DD_RESPONSE_DISPLAYED_EVENT,
              ...commonTrackingData,
            })
            stopResponseDisplayedTimer()
          },
          eventListenerOptions,
        )

        window.addEventListener(
          DD_RESPONSE_UNLOAD_EVENT,
          () => {
            handleDataDomeCaptchaRendered({
              timeoutId,
              event: DD_RESPONSE_UNLOAD_EVENT,
              ...commonTrackingData,
            })
          },
          eventListenerOptions,
        )

        window.addEventListener(
          DD_RESPONSE_ERROR_EVENT,
          () => {
            handleDataDomeCaptchaFailedToRender({
              reason: DD_RESPONSE_ERROR_EVENT,
              timeoutId,
              ...commonTrackingData,
            })
            stopResponseErrorTimer()
          },
          eventListenerOptions,
        )

        window.addEventListener(
          'beforeunload',
          () => {
            handleDataDomeCaptchaFailedToRender({
              reason: 'beforeunload',
              timeoutId,
              ...commonTrackingData,
            })
          },
          eventListenerOptions,
        )
      }

      return Promise.reject(error)
    },
  )
}
