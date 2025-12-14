'use client'

import { useCallback, useContext, useEffect, useRef } from 'react'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'

import {
  GenericInboxNotificationModel,
  InboxNotificationImpressionSource,
  InboxNotificationType,
  customEvent,
  customEventName,
  clickEvent,
} from '@marketplace-web/inbox-notifications/inbox-notifications-data'
import { BrazeContext, useBrazeInboxNotificationCards } from '@marketplace-web/braze/braze-feature'

const useInboxNotificationEvents = () => {
  const { track } = useTracking()
  const { logCardClick, logCardImpression, inboxNotificationCardStore } = useContext(BrazeContext)
  const { brazeControlNotificationCards } = useBrazeInboxNotificationCards()

  const seenNotificationIds = useRef<Array<string>>([])
  const delayControlNotificationTracking = useRef(false)

  const trackNotificationClick = (notification: GenericInboxNotificationModel) => () => {
    const targetDetails = {
      notification_id: notification.id,
      entry_type: notification.entryType,
      notification_link: notification.link,
    }

    switch (notification.type) {
      case InboxNotificationType.Vinted:
        track(
          clickEvent({
            target: 'notification',
            targetDetails: JSON.stringify(targetDetails),
          }),
        )
        break
      case InboxNotificationType.Braze: {
        if (!notification.link) return

        logCardClick(notification.id)
        break
      }
      default:
        break
    }
  }

  const logControlNotificationImpressions = useCallback(() => {
    brazeControlNotificationCards?.forEach(card => logCardImpression(card.id))
    delayControlNotificationTracking.current = false
  }, [brazeControlNotificationCards, logCardImpression])

  useEffect(() => {
    if (delayControlNotificationTracking.current) {
      logControlNotificationImpressions()
    }
  }, [logControlNotificationImpressions])

  const trackControlNotificationEnter = () => {
    const areControlNotificationsLoaded = !!brazeControlNotificationCards

    if (areControlNotificationsLoaded) {
      logControlNotificationImpressions()
    } else {
      delayControlNotificationTracking.current = true
    }
  }

  const trackNotificationEnter =
    (notification: GenericInboxNotificationModel, source: InboxNotificationImpressionSource) =>
    () => {
      const isNotificationSeen = seenNotificationIds.current.includes(notification.id)

      if (!isNotificationSeen) seenNotificationIds.current.push(notification.id)
      const targetDetails = {
        notification_id: notification.id,
        entry_type: notification.entryType,
        source,
      }

      switch (notification.type) {
        case InboxNotificationType.Vinted:
          if (isNotificationSeen) break

          track(
            customEvent({
              eventName: customEventName.inboxNotificationImpression,
              target: 'notification',
              targetDetails: JSON.stringify(targetDetails),
            }),
          )
          break
        case InboxNotificationType.Braze: {
          const viewedBefore = notification.isViewed

          logCardImpression(notification.id).then(isLogged => {
            if (!isLogged || viewedBefore) return

            if (inboxNotificationCardStore.state) {
              inboxNotificationCardStore.state = Array.from(inboxNotificationCardStore.state)
            }
          })
          break
        }
        default:
          break
      }
    }

  return {
    trackNotificationClick,
    trackNotificationEnter,
    trackControlNotificationEnter,
  }
}

export default useInboxNotificationEvents
