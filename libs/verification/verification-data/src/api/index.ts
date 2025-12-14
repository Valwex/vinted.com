import { api } from '@marketplace-web/core-api/core-api-client-util'

import { ChangeExistingEmailArgs } from '../types/change-email'
import { ValidateUserArgs } from '../types/validate-user'
import {
  SendEmailVerificationCodeArgs,
  SendEmailVerificationCodeResp,
  TwoFactorLoginSubmitArgs,
  TwoFactorResendResp,
  TwoFactorSubmitArgs,
  ValidateEmailVerificationCodeArgs,
  VerificationPromptResp,
} from '../types/verification'

export const resendLoginTwoFactorCode = ({
  controlCode,
  code,
  fingerprint,
}: TwoFactorLoginSubmitArgs) =>
  api.post<TwoFactorResendResp>(`/user_login_2fa/${controlCode}/resend`, {
    code,
    fingerprint,
  })

export const resendTwoFactorCode = ({ userId, id, code, fingerprint }: TwoFactorSubmitArgs) =>
  api.post<TwoFactorResendResp>(`/users/${userId}/user_2fa/${id}/resend`, {
    code,
    fingerprint,
  })

export const resendTwoFactorVerifierCode = (id: string) =>
  api.post<TwoFactorResendResp>(`/user_verifier/${id}/resend`)

export const sendEmailVerificationCode = ({ userId, email }: SendEmailVerificationCodeArgs) =>
  api.post<SendEmailVerificationCodeResp>(`/users/${userId}/verifications/email_code`, {
    email,
  })

export const sendTwoFactorCode = ({ userId, id, code, fingerprint }: TwoFactorSubmitArgs) =>
  api.put(`/users/${userId}/user_2fa/${id}`, {
    code,
    fingerprint,
  })

export const validateEmailVerificationCode = ({
  userId,
  code,
}: ValidateEmailVerificationCodeArgs) =>
  api.put(`/users/${userId}/verifications/email_code`, {
    code,
  })

export const verifyPhoneNumber = ({
  userId,
  code,
  phoneNumber,
  fingerprint,
}: {
  userId: number
  code: string
  phoneNumber: string
  fingerprint: string
}) =>
  api.put(`/users/${userId}/phone_number/verify`, {
    code,
    phone_number: phoneNumber,
    fingerprint,
  })

export const changeExistingEmail = ({ email, userId }: ChangeExistingEmailArgs) =>
  api.put(`/users/${userId}/change_email`, { email })

export const dismissVerificationPrompt = (userId: number) =>
  api.delete(`/users/${userId}/verifications/prompt`)

export const getVerificationPrompt = (userId: number) =>
  api.get<VerificationPromptResp>(`/users/${userId}/verifications/prompt`)

export const validateUser = ({ user }: ValidateUserArgs) => api.post('/users/validations', { user })
