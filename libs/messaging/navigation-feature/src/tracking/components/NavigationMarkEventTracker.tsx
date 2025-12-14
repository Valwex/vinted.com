'use client'

import { PropsWithChildren, useEffect, useRef } from 'react'

import {
  createMarkEventTracker,
  messagingInteractionEvent,
} from '@marketplace-web/messaging/tracking-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'

import { MARK_NAMESPACE, Mark, isMessagingMark } from '../marks'
import useConversationId from '../../hooks/useConversationId'

const NavigationMarkEventTracker = (props: PropsWithChildren) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const trackMessagingInteractionEvent = useRef<((mark: Mark, duration: number) => void) | null>(
    null,
  )
  const { track } = useTracking()

  const conversationId = useConversationId()

  useEffect(() => {
    trackMessagingInteractionEvent.current = (screen: Mark, duration: number) => {
      if (screen === Mark.Inbox) {
        track(
          messagingInteractionEvent({
            duration,
            screen,
            conversationId: null,
            action: 'screen_load_duration_in_ms',
          }),
        )

        return
      }

      if (!conversationId) return

      track(
        messagingInteractionEvent({
          duration,
          screen,
          conversationId,
          action: 'screen_load_duration_in_ms',
        }),
      )
    }
  }, [track, conversationId])

  useEffect(() => {
    if (!elementRef.current) return undefined

    return createMarkEventTracker(elementRef.current, MARK_NAMESPACE, (markName, duration) => {
      if (!isMessagingMark(markName)) return
      trackMessagingInteractionEvent.current?.(markName, duration)
    })
  }, [])

  return <div {...props} ref={elementRef} />
}

export default NavigationMarkEventTracker
