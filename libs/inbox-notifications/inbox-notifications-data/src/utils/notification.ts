import { InboxNotificationType } from '../constants'
import { GenericInboxNotificationModel } from '../types/models/generic-inbox-notification'

export const sortNotifications = (notifications: Array<GenericInboxNotificationModel>) => {
  return [...notifications].sort((firstItem, secondItem) => secondItem.time - firstItem.time)
}

export const sortPaginatedNotifications = (
  notifications: Array<GenericInboxNotificationModel>,
  isEndReached: boolean,
) => {
  if (isEndReached) {
    return sortNotifications(notifications)
  }

  const userNotifications = notifications.filter(
    notification => notification.type === InboxNotificationType.Vinted,
  )

  if (!userNotifications.length) {
    return sortNotifications(notifications)
  }

  const lastUserNotificationTime = userNotifications[userNotifications.length - 1]!.time

  // Braze notifications, which are older than last user notification, should not be shown,
  // unless pagination end is reached
  const shownNotifications = notifications.filter(
    notification =>
      notification.type === InboxNotificationType.Vinted ||
      notification.time >= lastUserNotificationTime,
  )

  return sortNotifications(shownNotifications)
}
