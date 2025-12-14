import { ChangeEvent, useCallback, useContext, useState } from 'react'
import { useForm } from 'react-hook-form'

import { ResponseError, HttpStatus } from '@marketplace-web/core-api/api-client-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useSession } from '@marketplace-web/shared/session-data'
import { UiState } from '@marketplace-web/shared/ui-state-util'
import {
  validateEmailVerificationCode,
  clickEvent,
} from '@marketplace-web/verification/verification-data'

import { MAX_CODE_LENGTH } from '../constants'
import Context from '../EmailVerificationCodeContext'
import { numbersOnly } from '../utils'

type FormData = {
  code: string
}

const useEnterCodeForm = () => {
  const { user } = useSession()
  const userId = user?.id
  const { track } = useTracking()
  const [uiState, setUiState] = useState(UiState.Idle)
  const [formError, setFormError] = useState<ResponseError>()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>()
  const { setError } = useContext(Context)

  const clearFormError = useCallback(() => setFormError(undefined), [setFormError])

  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const digits = numbersOnly(value)
    const decreaseToMaxLength = digits.slice(0, MAX_CODE_LENGTH)

    setValue('code', decreaseToMaxLength)

    if (!formError) return

    clearFormError()
  }

  const handleFormSubmit = async ({ code }: FormData) => {
    if (!userId) return

    setUiState(UiState.Pending)
    setError(undefined)
    clearFormError()

    track(
      clickEvent({
        screen: 'mand_email_verification_enter_code',
        target: 'verify',
      }),
    )

    const response = await validateEmailVerificationCode({ userId, code: parseFloat(code) })

    if ('errors' in response) {
      setUiState(UiState.Failure)

      if (response.status === HttpStatus.TooManyRequests) {
        setError(response)

        return
      }

      setFormError(response)

      return
    }

    setUiState(UiState.Success)
  }

  const resetForm = useCallback(() => {
    clearFormError()
    reset()
  }, [clearFormError, reset])

  return {
    register: register('code', {
      required: true,
      onChange: handleCodeChange,
    }),
    isLoading: isSubmitting,
    watch,
    handleSubmit: handleSubmit(handleFormSubmit),
    isCodeValidated: uiState === UiState.Success,
    formError,
    resetForm,
  }
}

export default useEnterCodeForm
