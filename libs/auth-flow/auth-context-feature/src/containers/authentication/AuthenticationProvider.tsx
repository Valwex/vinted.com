'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { useCookie, cookiesDataByName } from '@marketplace-web/environment/cookies-util'
import {
  useBrowserNavigation,
  navigateToPage,
} from '@marketplace-web/browser/browser-navigation-util'
import { urlWithParams } from '@marketplace-web/browser/url-util'

import {
  LOGIN_2FA,
  LOGIN_EMAIL,
  LOGIN_RESET_PASSWORD,
  LOGIN_SELECT_TYPE,
  REGISTER_APPLE,
  REGISTER_EMAIL,
  REGISTER_FACEBOOK,
  REGISTER_GOOGLE,
  REGISTER_PASSWORD_VERIFICATION,
  REGISTER_SELECT_TYPE,
} from '../../constants/routes'
import { AuthExternalRegisterView, AuthView } from '../../constants'
import { ExternalRegisterData, TwoFactorLoginData } from '../../types'
import AuthenticationContext from './AuthenticationContext'

const AUTH_VIEW_TO_PATHNAME: Record<
  AuthView | AuthExternalRegisterView,
  `/member/login/${string}` | `/member/register/${string}`
> = {
  [AuthView.SelectTypeLogin]: LOGIN_SELECT_TYPE,
  [AuthView.EmailLogin]: LOGIN_EMAIL,
  [AuthView.ResetPassword]: LOGIN_RESET_PASSWORD,
  [AuthView.TwoFactorLogin]: LOGIN_2FA,
  [AuthView.SelectTypeRegister]: REGISTER_SELECT_TYPE,
  [AuthView.EmailRegister]: REGISTER_EMAIL,
  [AuthExternalRegisterView.FacebookRegister]: REGISTER_FACEBOOK,
  [AuthExternalRegisterView.GoogleRegister]: REGISTER_GOOGLE,
  [AuthExternalRegisterView.AppleRegister]: REGISTER_APPLE,
  [AuthExternalRegisterView.PasswordVerification]: REGISTER_PASSWORD_VERIFICATION,
}

const PATHNAME_TO_AUTH_VIEW: Partial<Record<string, AuthView | AuthExternalRegisterView>> =
  Object.fromEntries(
    Object.entries(AUTH_VIEW_TO_PATHNAME).map(([authView, pathname]) => [
      pathname,
      authView as keyof typeof AUTH_VIEW_TO_PATHNAME,
    ]),
  )

export const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
  const cookies = useCookie()
  const { relativeUrl, routerPush, searchParams } = useBrowserNavigation()

  const authViewFromPathname = PATHNAME_TO_AUTH_VIEW[relativeUrl]

  const defaultAuthView = useMemo(() => {
    if (authViewFromPathname) return authViewFromPathname

    return cookies.get(cookiesDataByName.last_user_id)
      ? AuthView.SelectTypeLogin
      : AuthView.SelectTypeRegister
  }, [authViewFromPathname, cookies])

  const [authView, setAuthView] = useState<AuthView | AuthExternalRegisterView>(defaultAuthView)
  const [externalRegisterData, setExternalRegisterData] = useState<ExternalRegisterData>()
  const [twoFactorLoginData, setTwoFactorLoginData] = useState<TwoFactorLoginData>()

  useEffect(() => {
    if (!authViewFromPathname) return

    setAuthView(authViewFromPathname)
  }, [authViewFromPathname])

  const changeAuthView = useCallback(
    (
      view: AuthView | AuthExternalRegisterView,
      {
        routerNavigation = false,
        forcePageNavigation = false,
      }: { routerNavigation?: boolean; forcePageNavigation?: boolean } = {},
    ) => {
      if (!forcePageNavigation && !authViewFromPathname) {
        setAuthView(view)

        return
      }

      const url = urlWithParams(AUTH_VIEW_TO_PATHNAME[view], searchParams)

      if (routerNavigation) {
        routerPush(url)

        return
      }

      navigateToPage(url)
    },
    [authViewFromPathname, routerPush, searchParams],
  )

  const handleViewExternalRegister = useCallback(
    ({ view, data }: { view: AuthExternalRegisterView; data: ExternalRegisterData }) => {
      changeAuthView(view, { routerNavigation: true })
      setExternalRegisterData(data)
    },
    [changeAuthView],
  )

  const handleViewTwoFactorLogin = useCallback(
    (data: TwoFactorLoginData) => {
      changeAuthView(AuthView.TwoFactorLogin, { routerNavigation: true })
      setTwoFactorLoginData(data)
    },
    [changeAuthView],
  )

  const resetAuthView = useCallback(() => {
    changeAuthView(defaultAuthView)
  }, [changeAuthView, defaultAuthView])

  const value = useMemo(
    () => ({
      authView,
      externalRegisterData,
      twoFactorLoginData,
      handleViewExternalRegister,
      handleViewTwoFactorLogin,
      resetAuthView,
      setAuthView: changeAuthView,
      isAuthPage: !!authViewFromPathname,
    }),
    [
      authView,
      externalRegisterData,
      twoFactorLoginData,
      handleViewExternalRegister,
      handleViewTwoFactorLogin,
      resetAuthView,
      changeAuthView,
      authViewFromPathname,
    ],
  )

  return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>
}
