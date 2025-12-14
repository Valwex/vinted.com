import { UiState } from '@marketplace-web/shared/ui-state-util'

export const MIN_CODE_LENGTH = 6
export const MAX_CODE_LENGTH = 6

export const DEFAULT_STATE = {
  email: null,
  error: undefined,
  uiState: UiState.Idle,
  canUserChangeEmail: true,
}
