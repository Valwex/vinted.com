import { api } from '@marketplace-web/core-api/core-api-client-util'

import {
  API_BASE_PATH,
  ApiClient,
  csrfTokenInterceptor,
  errorInterceptor,
  localeInterceptor,
} from '@marketplace-web/core-api/api-client-util'

import {
  ChangeForgotPasswordArgs,
  GetForgotPasswordConfirmationCodeArgs,
  GetForgotPasswordConfirmationCodeResp,
  ResetPasswordArgs,
} from '../types/forgot-password'
import { ChangePasswordArgs } from '../types/change-password'

export const changeForgotPassword = ({
  code,
  password,
  passwordConfirmation,
  fingerprint,
}: ChangeForgotPasswordArgs) =>
  api.post('/users/change_forgot_password', {
    code,
    password,
    password_confirmation: passwordConfirmation,
    fingerprint,
  })

export const changePassword = ({
  userId,
  currentPassword,
  newPassword,
  fingerprint,
}: ChangePasswordArgs) =>
  api.put(`/users/${userId}/password`, {
    old_password: currentPassword,
    password: newPassword,
    fingerprint,
  })

export const getForgotPasswordConfirmationCode = ({
  code,
}: GetForgotPasswordConfirmationCodeArgs) =>
  api.get<GetForgotPasswordConfirmationCodeResp>('/users/forgot_password', {
    params: { code },
  })

// TODO: check if this api client can be replaced with the generic one
const resetPasswordApi = new ApiClient({}, [
  csrfTokenInterceptor,
  errorInterceptor,
  localeInterceptor,
])

export function resetPassword({ email }: ResetPasswordArgs) {
  return resetPasswordApi.post(`${API_BASE_PATH}/users/reset_password`, {
    email,
  })
}
