'use client'

import { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import { useEventListener } from 'usehooks-ts'
import { v4 as uuid } from 'uuid'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useSession } from '@marketplace-web/shared/session-data'
import { getFingerprint } from '@marketplace-web/session-management/audit-util'
import { useSystemConfiguration } from '@marketplace-web/shared/system-configuration-data'

import {
  RegistrationBehaviourAction,
  RegistrationBehaviourActionDetails,
  RegistrationBehaviourClickActionDetails,
  RegistrationBehaviourEndActionDetails,
  registrationFormBehaviourEvent,
  RegistrationType,
} from '@marketplace-web/registration/registration-data'
import { useAuthModal } from '@marketplace-web/auth-flow/auth-modal-context-feature'
import {
  AuthExternalRegisterView,
  AuthView,
  useAuthenticationContext,
} from '@marketplace-web/auth-flow/auth-context-feature'

import RegistrationBehaviourTrackingContext from './RegistrationBehaviourTrackingContext'

const getAuthenticationTypeFromView = (
  authView: AuthView | AuthExternalRegisterView,
): RegistrationType | null => {
  switch (authView) {
    case AuthExternalRegisterView.FacebookRegister:
      return 'facebook'
    case AuthExternalRegisterView.GoogleRegister:
      return 'google'
    case AuthExternalRegisterView.AppleRegister:
      return 'apple'
    case AuthView.EmailRegister:
      return 'email'
    default:
      return null
  }
}

type Props = {
  children: ReactNode
  isModal?: boolean
}

const RegistrationBehaviourTrackingProvider = ({ children, isModal }: Props) => {
  const { track } = useTracking()
  const { isWebview, screen } = useSession()
  const { userCountry } = useSystemConfiguration()
  const { authView } = useAuthenticationContext()
  const { isAuthModalOpen } = useAuthModal()

  const taskId = useRef('')
  const registrationCompleted = useRef(false)

  const authenticationType = getAuthenticationTypeFromView(authView)

  useEffect(() => {
    taskId.current = uuid()
  }, [authView])

  const trackBehaviourEvent = useCallback(
    async ({
      action,
      actionDetails,
      userId,
    }: {
      action: RegistrationBehaviourAction
      actionDetails?: RegistrationBehaviourActionDetails
      userId?: number
    }) => {
      if (isModal && !isAuthModalOpen) return
      if (!authenticationType) return

      track(
        registrationFormBehaviourEvent({
          taskId: taskId.current,
          fingerprint: await getFingerprint(),
          countryCode: userCountry,
          screen,
          authenticationType,
          action,
          actionDetails,
          inApp: isWebview,
          userId,
        }),
      )
    },
    [track, screen, isWebview, userCountry, authenticationType, taskId, isModal, isAuthModalOpen],
  )

  useEventListener('beforeunload', () => {
    if (registrationCompleted.current) return

    trackBehaviourEvent({ action: 'end', actionDetails: 'page-closed' })
  })

  useEffect(() => {
    trackBehaviourEvent({ action: 'start' })
  }, [trackBehaviourEvent, authenticationType])

  const trackRegistrationBehaviourClick = useCallback(
    ({ actionDetails }: { actionDetails: RegistrationBehaviourClickActionDetails }) => {
      trackBehaviourEvent({ action: 'click', actionDetails })
    },
    [trackBehaviourEvent],
  )

  const trackRegistrationBehaviourSubmitSuccess = useCallback(
    ({ userId }: { userId: number }) => {
      registrationCompleted.current = true

      trackBehaviourEvent({
        action: 'submit',
        actionDetails: 'successful',
        userId,
      })
    },
    [trackBehaviourEvent],
  )

  const trackRegistrationBehaviourSubmitFailure = useCallback(() => {
    trackBehaviourEvent({
      action: 'submit',
      actionDetails: 'unsuccessful',
    })
  }, [trackBehaviourEvent])

  const trackRegistrationBehaviourEnd = useCallback(
    ({ actionDetails }: { actionDetails: RegistrationBehaviourEndActionDetails }) => {
      trackBehaviourEvent({ action: 'end', actionDetails })
    },
    [trackBehaviourEvent],
  )

  const value = useMemo(
    () => ({
      trackRegistrationBehaviourClick,
      trackRegistrationBehaviourSubmitSuccess,
      trackRegistrationBehaviourSubmitFailure,
      trackRegistrationBehaviourEnd,
    }),
    [
      trackRegistrationBehaviourClick,
      trackRegistrationBehaviourSubmitSuccess,
      trackRegistrationBehaviourSubmitFailure,
      trackRegistrationBehaviourEnd,
    ],
  )

  return (
    <RegistrationBehaviourTrackingContext.Provider value={value}>
      {children}
    </RegistrationBehaviourTrackingContext.Provider>
  )
}

export default RegistrationBehaviourTrackingProvider
