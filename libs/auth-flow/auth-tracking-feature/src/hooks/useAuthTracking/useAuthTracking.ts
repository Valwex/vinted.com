'use client'

import { useCallback } from 'react'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'

import { useAuthModal } from '@marketplace-web/auth-flow/auth-modal-context-feature'
import {
  AuthExternalRegisterView,
  AuthView,
  useAuthenticationContext,
} from '@marketplace-web/auth-flow/auth-context-feature'

import { clickEvent, userInputEvent, UserTarget, viewScreenEvent } from '../../transformers/events'

type ViewToScreenMap = { [key in AuthView | AuthExternalRegisterView]: string }

const viewToScreenMap: ViewToScreenMap = {
  [AuthView.SelectTypeRegister]: 'auth_select_type_register',
  [AuthView.SelectTypeLogin]: 'auth_select_type_login',
  [AuthView.EmailLogin]: 'auth_email_login',
  [AuthView.EmailRegister]: 'auth_email_register',
  [AuthView.ResetPassword]: 'auth_reset_password',
  [AuthView.TwoFactorLogin]: 'auth_two_factor_login',
  [AuthExternalRegisterView.FacebookRegister]: 'auth_facebook_register',
  [AuthExternalRegisterView.GoogleRegister]: 'auth_google_register',
  [AuthExternalRegisterView.AppleRegister]: 'auth_apple_register',
  [AuthExternalRegisterView.PasswordVerification]: 'auth_confirm_password',
}

const useAuthTracking = () => {
  const { authView } = useAuthenticationContext()
  const { isAuthModalOpen } = useAuthModal()
  const { track } = useTracking()
  const { relativeUrl } = useBrowserNavigation()

  const screen = viewToScreenMap[authView]
    ? `${viewToScreenMap[authView]}${isAuthModalOpen ? '_modal' : ''}`
    : undefined

  const trackViewScreen = useCallback(() => {
    if (!screen) return

    track(viewScreenEvent({ screen }))
  }, [track, screen])

  const trackClickEvent = useCallback(
    ({ target, targetDetails }: { target: UserTarget; targetDetails?: string }) => {
      track(clickEvent({ path: relativeUrl, screen, target, targetDetails }))
    },
    [relativeUrl, screen, track],
  )

  const trackInputEvent = useCallback(
    ({ target, state }: { target: string; state: 'focus' | 'unfocus' }) => {
      track(userInputEvent({ screen, target, state }))
    },
    [screen, track],
  )

  return { trackViewScreen, trackClickEvent, trackInputEvent }
}

export default useAuthTracking
