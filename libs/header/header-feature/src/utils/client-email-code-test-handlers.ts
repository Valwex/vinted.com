import { EmailCodeView } from '@marketplace-web/verification/verification-feature'
import { isResponseError } from '@marketplace-web/core-api/api-client-util'
import { TrackingEvent } from '@marketplace-web/observability/event-tracker-data'
import { VerificationMethods } from '@marketplace-web/verification/verification-data'
import {
  clickEvent,
  dismissVerificationPrompt,
  getVerificationPrompt,
} from '@marketplace-web/header/header-data'

import { EMAIL_CODE_VERIFICATION_URL } from '../constants/routes'

export const fetchCurrentUserVerificationPrompts = async ({ userId }: { userId: number }) => {
  const prompts = await getVerificationPrompt(userId)

  if (isResponseError(prompts)) return null

  return prompts
}

export const handleDismissVerificationPrompt = async ({ userId }: { userId: number }) => {
  const prompts = await fetchCurrentUserVerificationPrompts({ userId })

  if (!prompts) return

  const isEmailCodeMethod = prompts.prompt.methods.includes(VerificationMethods.EmailCode)
  const isMandatory = prompts.prompt.mandatory

  if (!isEmailCodeMethod || isMandatory) return

  await dismissVerificationPrompt(userId)
}

export const trackLogoutEvent = async ({
  relativeUrl,
  view,
  track,
  userId,
}: {
  userId: number
  relativeUrl: string
  view: string
  track: (event: TrackingEvent) => void
}) => {
  const prompts = await fetchCurrentUserVerificationPrompts({ userId })

  const isEmailCodeMethod = prompts?.prompt.methods.includes(VerificationMethods.EmailCode)
  if (!isEmailCodeMethod) return

  const screenByEmailCodeView = {
    [EmailCodeView.EnterCode]: 'mand_email_verification_enter_code',
    [EmailCodeView.NotReceiveEmail]: 'mand_email_verification_resend_code',
  }

  const eventData = {
    screen:
      relativeUrl === EMAIL_CODE_VERIFICATION_URL
        ? screenByEmailCodeView[view]
        : 'mand_email_verification_start',
    target: 'sessions_log_out',
  } as const

  track(clickEvent(eventData))
}

export const trackEmailCodeSkipEvent = async ({
  track,
  userId,
}: {
  userId: number
  track: (event: TrackingEvent) => void
}) => {
  const prompts = await fetchCurrentUserVerificationPrompts({ userId })
  if (!prompts) return

  const isEmailCodeMethod = prompts.prompt.methods.includes(VerificationMethods.EmailCode)
  const isMandatory = prompts.prompt.mandatory

  if (!isEmailCodeMethod || isMandatory) return

  track(
    clickEvent({
      screen: 'mand_email_verification_start',
      target: 'skip',
    }),
  )
}
