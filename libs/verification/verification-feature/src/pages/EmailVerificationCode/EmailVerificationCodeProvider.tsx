'use client'

import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  useDataDomeCaptcha,
  useSafeDataDomeCallback,
} from '@marketplace-web/bot-detection/data-dome-feature'
import { ResponseError, HttpStatus } from '@marketplace-web/core-api/api-client-util'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useSession } from '@marketplace-web/shared/session-data'
import { UiState } from '@marketplace-web/shared/ui-state-util'
import {
  sendEmailVerificationCode,
  transformEmailVerificationCodeResponse,
} from '@marketplace-web/verification/verification-data'

import { DEFAULT_STATE } from './constants'
import Context from './EmailVerificationCodeContext'

type Props = {
  children: ReactNode
}

const EmailVerificationCodeProvider = ({ children }: Props) => {
  const { user } = useSession()
  const userEmail = user?.email || null
  const userId = user?.id

  const [email, setEmail] = useState<string | null>(userEmail)
  const [error, setError] = useState<ResponseError | undefined>(DEFAULT_STATE.error)
  const [uiState, setUiState] = useState(DEFAULT_STATE.uiState)
  const [canUserChangeEmail, setCanUserChangeEmail] = useState<boolean>(
    DEFAULT_STATE.canUserChangeEmail,
  )
  const isDelaySendVerificationEnabled = useFeatureSwitch('delay_send_verification')

  const { callbackWhenDataDomeReady } = useSafeDataDomeCallback()

  const newEmailRef = useRef<string | undefined>(undefined)

  const sendEmailCode = useCallback(
    async (newEmail?: string) => {
      if (!userId) return

      setUiState(UiState.Pending)
      setError(undefined)
      newEmailRef.current = newEmail

      const response = await sendEmailVerificationCode({
        userId,
        email: newEmail,
      })

      if ('errors' in response && response.status === HttpStatus.TooManyRequests) {
        setUiState(UiState.Failure)
        setError(response)

        return
      }
      if (!('errors' in response)) {
        const transformedEmailVerificationCodeResponse =
          transformEmailVerificationCodeResponse(response)
        setEmail(transformedEmailVerificationCodeResponse.email)
        setCanUserChangeEmail(transformedEmailVerificationCodeResponse.canChangeEmail)
      }
      setUiState(UiState.Success)
    },
    [userId],
  )

  useDataDomeCaptcha(() => sendEmailCode(newEmailRef.current))

  const resetUiState = useCallback(() => {
    setUiState(UiState.Idle)
  }, [setUiState])

  useEffect(() => {
    if (isDelaySendVerificationEnabled) {
      setUiState(UiState.Pending)
      setTimeout(sendEmailCode, 1000)

      return
    }

    callbackWhenDataDomeReady(sendEmailCode)
  }, [callbackWhenDataDomeReady, isDelaySendVerificationEnabled, sendEmailCode])

  const value = useMemo(
    () => ({
      email,
      error,
      uiState,
      setEmail,
      setError,
      setUiState,
      sendEmailCode,
      resetUiState,
      canUserChangeEmail,
    }),
    [
      email,
      error,
      uiState,
      setEmail,
      setError,
      setUiState,
      sendEmailCode,
      resetUiState,
      canUserChangeEmail,
    ],
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export default EmailVerificationCodeProvider
