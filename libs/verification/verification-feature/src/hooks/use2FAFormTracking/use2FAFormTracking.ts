import { useCallback, useEffect, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import { useEventListener } from 'usehooks-ts'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { twoFAFormBehaviourEvent } from '@marketplace-web/verification/verification-data'
import { useSession } from '@marketplace-web/shared/session-data'

const use2FAFormTracking = (initialTaskId?: string) => {
  const { track } = useTracking()
  const taskId = useRef('')
  const userId = useSession().user?.id

  useEffect(() => {
    taskId.current = initialTaskId || uuid()
  }, [initialTaskId])

  const trackBehaviourEvent = useCallback(
    ({ action, actionDetails }: { action: string; actionDetails?: string }) => {
      track(twoFAFormBehaviourEvent({ taskId: taskId.current, action, actionDetails, userId }))
    },
    [track, userId],
  )

  useEventListener('beforeunload', () => {
    trackBehaviourEvent({ action: 'end' })
  })

  useEffect(() => {
    trackBehaviourEvent({ action: 'start' })
  }, [trackBehaviourEvent])

  const trackFormSubmitSuccess = useCallback(() => {
    trackBehaviourEvent({ action: 'submit', actionDetails: 'success' })
  }, [trackBehaviourEvent])

  const trackFormSubmitFailure = useCallback(() => {
    trackBehaviourEvent({ action: 'submit', actionDetails: 'failure' })
  }, [trackBehaviourEvent])

  const trackFaqClick = useCallback(() => {
    trackBehaviourEvent({ action: 'click', actionDetails: 'faq_link' })
  }, [trackBehaviourEvent])

  const trackResendClick = useCallback(() => {
    trackBehaviourEvent({ action: 'click', actionDetails: 'resend' })
  }, [trackBehaviourEvent])

  return {
    trackFormSubmitSuccess,
    trackFormSubmitFailure,
    trackFaqClick,
    trackResendClick,
  }
}

export default use2FAFormTracking
