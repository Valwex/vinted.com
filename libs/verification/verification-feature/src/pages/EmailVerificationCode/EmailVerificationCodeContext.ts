'use client'

import { noop } from 'lodash'
import { createContext, Dispatch, SetStateAction } from 'react'

import { ResponseError } from '@marketplace-web/core-api/api-client-util'
import { UiState } from '@marketplace-web/shared/ui-state-util'

import { DEFAULT_STATE } from './constants'

export type EmailVerificationCodeContextType = {
  email: string | null
  error?: ResponseError
  uiState: UiState
  canUserChangeEmail: boolean

  setEmail: Dispatch<SetStateAction<string | null>>
  setError: Dispatch<SetStateAction<ResponseError | undefined>>
  setUiState: Dispatch<SetStateAction<UiState>>

  sendEmailCode: (email?: string) => void
  resetUiState: () => void
}

const Context = createContext<EmailVerificationCodeContextType>({
  email: DEFAULT_STATE.email,
  error: DEFAULT_STATE.error,
  uiState: DEFAULT_STATE.uiState,
  canUserChangeEmail: DEFAULT_STATE.canUserChangeEmail,

  setEmail: noop,
  setError: noop,
  setUiState: noop,
  sendEmailCode: noop,

  resetUiState: noop,
})

export default Context
