import { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { useEventListener } from 'usehooks-ts'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { phoneNumberFormBehaviourEvent } from '@marketplace-web/verification/verification-data'
import { useSession } from '@marketplace-web/shared/session-data'

const usePhoneNumberFormTracking = () => {
  const { track } = useTracking()
  const taskId = useRef('')
  const [wasSubmitSuccess, setWasSubmitSuccess] = useState(false)
  const userId = useSession().user?.id

  useEffect(() => {
    taskId.current = uuid()
  }, [])

  const trackBehaviourEvent = useCallback(
    ({ action, actionDetails }: { action: string; actionDetails?: string }) => {
      if (!userId) return

      track(
        phoneNumberFormBehaviourEvent({ taskId: taskId.current, action, actionDetails, userId }),
      )
    },
    [track, userId],
  )

  useEventListener('beforeunload', () => {
    if (wasSubmitSuccess) return

    trackBehaviourEvent({ action: 'end' })
  })

  useEffect(() => {
    trackBehaviourEvent({ action: 'start' })
  }, [trackBehaviourEvent])

  const trackFormSubmitSuccess = useCallback(() => {
    trackBehaviourEvent({ action: 'submit', actionDetails: 'success' })
    setWasSubmitSuccess(true)
  }, [trackBehaviourEvent])

  const trackFormSubmitFailure = useCallback(() => {
    trackBehaviourEvent({ action: 'submit', actionDetails: 'failure' })
  }, [trackBehaviourEvent])

  const trackFaqClick = useCallback(() => {
    trackBehaviourEvent({ action: 'click', actionDetails: 'faq_link' })
  }, [trackBehaviourEvent])

  return {
    taskId: taskId.current,
    trackFormSubmitSuccess,
    trackFormSubmitFailure,
    trackFaqClick,
  }
}

export default usePhoneNumberFormTracking
