import {
  AuthenticateUserError,
  AuthenticateUserErrorModel,
  LoginUserArgs,
  TwoFaErrorDto,
  TwoFaDetailsModel,
} from '../types/authentication'

const transformTwoFaErrorDetails = ({
  control_code,
  next_resend_available_in,
  user_masked_info,
  show_resend_option,
}: TwoFaErrorDto): TwoFaDetailsModel => ({
  controlCode: control_code,
  nextResendAvailableIn: next_resend_available_in,
  userMaskedInfo: user_masked_info,
  showResendOption: show_resend_option,
})

export const authenticateUserArgsToParams = ({ grantType, ...loginUserArgs }: LoginUserArgs) => {
  if ('verificationCode' in loginUserArgs) {
    return {
      control_code: loginUserArgs.controlCode,
      password_type: loginUserArgs.passwordType,
      verification_code: loginUserArgs.verificationCode,
      grant_type: grantType,
      is_trusted_device: loginUserArgs.isTrustedDevice,
    }
  }

  if ('controlCode' in loginUserArgs) {
    return {
      control_code: loginUserArgs.controlCode,
      grant_type: grantType,
      username: loginUserArgs.username,
      password: loginUserArgs.password,
      fingerprint: loginUserArgs.fingerprint,
    }
  }

  const { ...args } = loginUserArgs

  return {
    ...args,
    grant_type: grantType,
  }
}

export const transformAuthenticateUserError = (
  authenticateUserError: AuthenticateUserError,
): AuthenticateUserErrorModel => {
  if ('id' in authenticateUserError) return authenticateUserError

  return transformTwoFaErrorDetails(authenticateUserError)
}
