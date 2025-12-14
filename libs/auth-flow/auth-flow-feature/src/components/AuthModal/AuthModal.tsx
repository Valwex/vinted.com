'use client'

import { useEffect } from 'react'
import { Button, Dialog, Navigation } from '@vinted/web-ui'
import { X24 } from '@vinted/monochrome-icons'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useAuthModal } from '@marketplace-web/auth-flow/auth-modal-context-feature'
import {
  useAuthenticationContext,
  AuthenticationProvider,
} from '@marketplace-web/auth-flow/auth-context-feature'
import { useAuthTracking } from '@marketplace-web/auth-flow/auth-tracking-feature'
import {
  ComponentLocation,
  AuthenticationErrorBoundary,
} from '@marketplace-web/auth-flow/auth-observability-feature'
import {
  RegistrationBehaviourTrackingProvider,
  useRegistrationBehaviourTracking,
} from '@marketplace-web/registration/registration-feature'

import Auth from '../Auth'

export const AuthModal = () => {
  const translate = useTranslate('auth')
  const { trackClickEvent } = useAuthTracking()
  const { resetAuthView } = useAuthenticationContext()
  const { isAuthModalOpen, closeAuthModal } = useAuthModal()
  const { trackRegistrationBehaviourEnd } = useRegistrationBehaviourTracking()

  useEffect(() => {
    if (!isAuthModalOpen) return

    resetAuthView()
  }, [resetAuthView, isAuthModalOpen])

  const handleButtonClose = () => {
    trackClickEvent({ target: 'close_select_type_modal', targetDetails: 'button' })
    trackRegistrationBehaviourEnd({ actionDetails: 'modal-closed' })

    closeAuthModal()
  }

  if (!isAuthModalOpen) return null

  return (
    <Dialog
      testId="auth-modal"
      show
      hasScrollableContent
      className="auth__container"
      aria={{
        labelledby: 'auth_modal_title',
      }}
    >
      <div className="u-fill-width">
        <Navigation
          right={
            <Button
              iconName={X24}
              iconColor="greyscale-level-1"
              styling="flat"
              inline
              onClick={handleButtonClose}
              aria={{ 'aria-label': translate('a11y.close') }}
            />
          }
        />
        <div className="u-overflow-auto" aria-live="polite" aria-relevant="additions">
          <Auth componentLocation={ComponentLocation.AuthenticationModal} />
        </div>
      </div>
    </Dialog>
  )
}

const AuthModalWithProvider = () => (
  <AuthenticationProvider>
    <AuthenticationErrorBoundary componentLocation={ComponentLocation.AuthenticationModal}>
      <RegistrationBehaviourTrackingProvider isModal>
        <AuthModal />
      </RegistrationBehaviourTrackingProvider>
    </AuthenticationErrorBoundary>
  </AuthenticationProvider>
)

export default AuthModalWithProvider
