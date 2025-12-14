'use client'

import { useEffect } from 'react'

import { EmailCodeView } from '@marketplace-web/verification/verification-feature'
import { useFetch } from '@marketplace-web/core-api/api-client-util'
import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useSession } from '@marketplace-web/shared/session-data'
import { VerificationMethods } from '@marketplace-web/verification/verification-data'
import {
  clickEvent,
  dismissVerificationPrompt,
  getVerificationPrompt,
} from '@marketplace-web/header/header-data'

import { EMAIL_CODE_VERIFICATION_URL, USERS_VERIFICATION_URL } from '../../../constants/routes'

const screenByEmailCodeView = {
  [EmailCodeView.EnterCode]: 'mand_email_verification_enter_code',
  [EmailCodeView.NotReceiveEmail]: 'mand_email_verification_resend_code',
}

export const useEmailCodeTest = () => {
  const { user } = useSession()
  const { view: viewParam } = useBrowserNavigation().searchParams
  const view = typeof viewParam === 'string' ? viewParam : EmailCodeView.EnterCode
  const { track } = useTracking()
  const {
    fetch: fetchPrompts,
    data: prompts,
    error,
    isLoading: isLoadingPrompts,
  } = useFetch(getVerificationPrompt)

  const { relativeUrl } = useBrowserNavigation()
  const isEmailCodeMethod = prompts?.prompt.methods.includes(VerificationMethods.EmailCode)
  const isInVerificationFlow =
    relativeUrl === USERS_VERIFICATION_URL || relativeUrl === EMAIL_CODE_VERIFICATION_URL

  useEffect(() => {
    if (!isInVerificationFlow) return
    if (!user?.id) return

    fetchPrompts(user.id)
  }, [user, isInVerificationFlow, fetchPrompts])

  const trackEmailCodeSkipEvent = () => {
    if (error) return
    if (!isEmailCodeMethod) return
    if (prompts?.prompt.mandatory) return

    track(
      clickEvent({
        screen: 'mand_email_verification_start',
        target: 'skip',
      }),
    )
  }

  const handleDismissVerificationPrompt = async () => {
    if (!user?.id) return
    if (error) return
    if (!isEmailCodeMethod) return
    if (prompts?.prompt.mandatory) return

    await dismissVerificationPrompt(user.id)
  }

  const trackLogoutEvent = () => {
    if (!isEmailCodeMethod) return

    const eventData = {
      screen:
        relativeUrl === EMAIL_CODE_VERIFICATION_URL
          ? screenByEmailCodeView[view]
          : 'mand_email_verification_start',
      target: 'sessions_log_out',
    } as const

    track(clickEvent(eventData))
  }

  return {
    trackLogoutEvent,
    trackEmailCodeSkipEvent,
    handleDismissVerificationPrompt,
    isLoadingPrompts,
  }
}
