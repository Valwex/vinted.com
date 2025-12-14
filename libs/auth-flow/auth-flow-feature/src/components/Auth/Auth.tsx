'use client'

import { useEffect } from 'react'
import { kebabCase } from 'lodash'

import { ErrorState } from '@marketplace-web/error-display/error-display-feature'

import { ResetPasswordForm as ResetPassword } from '@marketplace-web/security-settings/change-password-feature'
import {
  AuthExternalRegisterView,
  AuthView,
  useAuthenticationContext,
} from '@marketplace-web/auth-flow/auth-context-feature'
import { useAuthTracking } from '@marketplace-web/auth-flow/auth-tracking-feature'
import {
  EmailLogin,
  PasswordVerificationLogin as PasswordVerification,
  LoginTwoFactorVerification,
} from '@marketplace-web/authentication/authentication-feature'
import {
  ComponentLocation,
  ErrorReason,
  handlePageLoadFailure,
} from '@marketplace-web/auth-flow/auth-observability-feature'
import {
  EmailRegister,
  FacebookRegister,
  GoogleRegister,
  AppleRegister,
} from '@marketplace-web/registration/registration-feature'

import SelectType from '../SelectType'
import { isValueInObject } from '../../utils/object'

const componentByAuthView: Record<
  AuthView,
  (props: { isAuthPage?: boolean }) => JSX.Element | null
> = {
  [AuthView.SelectTypeRegister]: SelectType,
  [AuthView.SelectTypeLogin]: SelectType,
  [AuthView.EmailLogin]: EmailLogin,
  [AuthView.EmailRegister]: EmailRegister,
  [AuthView.ResetPassword]: ResetPassword,
  [AuthView.TwoFactorLogin]: LoginTwoFactorVerification,
}

const componentByAuthExternalRegisterView: Record<
  AuthExternalRegisterView,
  () => JSX.Element | null
> = {
  [AuthExternalRegisterView.FacebookRegister]: FacebookRegister,
  [AuthExternalRegisterView.GoogleRegister]: GoogleRegister,
  [AuthExternalRegisterView.AppleRegister]: AppleRegister,
  [AuthExternalRegisterView.PasswordVerification]: PasswordVerification,
}

type Props = {
  componentLocation?: ComponentLocation
}

const Auth = ({ componentLocation }: Props) => {
  const { authView, externalRegisterData } = useAuthenticationContext()
  const { trackViewScreen } = useAuthTracking()

  useEffect(() => {
    trackViewScreen()
  }, [trackViewScreen])

  const renderViewWrapper = (children: JSX.Element) => (
    <span data-testid={`${kebabCase(authView)}-view`}>{children}</span>
  )

  if (isValueInObject(authView, AuthView)) {
    const Component = componentByAuthView[authView]

    return renderViewWrapper(<Component />)
  }

  if (!externalRegisterData) {
    if (componentLocation) {
      handlePageLoadFailure({
        authView,
        componentLocation,
        reason: ErrorReason.UnresolvedComponent,
      })
    }

    return <ErrorState />
  }

  const Component = componentByAuthExternalRegisterView[authView]

  return renderViewWrapper(<Component />)
}

export default Auth
