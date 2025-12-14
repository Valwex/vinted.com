'use client'

import { Bell24 } from '@vinted/monochrome-icons'
import { Badge, Button, Icon } from '@vinted/web-ui'
import { MouseEvent, useState } from 'react'

import { useBrazeControlCardImpressionLogging } from '@marketplace-web/braze/braze-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { OutsideClick } from '@marketplace-web/common-components/outside-click-ui'
import { UiState } from '@marketplace-web/shared/ui-state-util'
import { clickEvent } from '@marketplace-web/inbox-notifications/inbox-notifications-data'

import { NOTIFICATIONS_URL } from '../../constants/routes'
import HeaderNotificationDropdown from './HeaderNotificationDropdown'
import useFetchInboxNotifications from '../../hooks/useFetchInboxNotifications'
import useUnreadNotificationsCount from '../../hooks/useUnreadNotificationsCount'

const MAX_NOTIFICATIONS_AMOUNT = 5
const MAX_BADGE_COUNT = 99

const HeaderInboxNotifications = () => {
  const translate = useTranslate('header.a11y.notifications')
  const { track } = useTracking()
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const { unreadNotificationsCount, fetchUnreadNotificationsCount } = useUnreadNotificationsCount()

  const {
    notifications,
    fetchInboxNotifications,
    controlNotificationCards,
    setNotifications,
    brazeNotificationCount,
    uiState,
  } = useFetchInboxNotifications()

  useBrazeControlCardImpressionLogging(
    isDropdownVisible && controlNotificationCards
      ? controlNotificationCards.map(({ id }) => id)
      : [],
  )

  function handleDropdownVisibilityChange() {
    const wasVisible = isDropdownVisible

    if (wasVisible) {
      setNotifications(items =>
        items.map(item => (item.isViewed ? item : { ...item, isViewed: true })),
      )
      fetchUnreadNotificationsCount()
    }

    if (!wasVisible && (uiState === UiState.Idle || uiState === UiState.Failure)) {
      fetchInboxNotifications()
    }

    setIsDropdownVisible(!wasVisible)
  }

  function handleClick(event: MouseEvent) {
    event.preventDefault()

    track(
      clickEvent({
        target: 'header_inbox_notifications',
      }),
    )
    handleDropdownVisibilityChange()
  }

  function handleOutsideClick() {
    if (!isDropdownVisible) return

    handleDropdownVisibilityChange()
  }

  const mergedNotificationCount = unreadNotificationsCount + brazeNotificationCount
  const badgeNotificationCount = Math.min(mergedNotificationCount, MAX_BADGE_COUNT)
  const notificationSuffix = mergedNotificationCount > MAX_BADGE_COUNT ? '+' : ''

  return (
    <OutsideClick onOutsideClick={handleOutsideClick}>
      <Button
        testId="header-notification-button"
        onClick={handleClick}
        styling="flat"
        aria={{
          'aria-label': mergedNotificationCount
            ? translate('new_notifications', { count: mergedNotificationCount })
            : translate('notifications'),
        }}
        icon={<Icon name={Bell24} color="greyscale-level-2" testId="header-notifications-icon" />}
        url={NOTIFICATIONS_URL}
      />
      {!!badgeNotificationCount && (
        <div
          className="user-actions__notification u-no-pointer-events"
          data-testid="header-notifications-badge"
        >
          <Badge
            content={
              <span aria-hidden="true">{`${badgeNotificationCount}${notificationSuffix}`}</span>
            }
            theme="warning"
          />
        </div>
      )}
      {isDropdownVisible && (
        <div className="header-notification-dropdown" data-testid="header-notification-dropdown">
          <HeaderNotificationDropdown
            isLoading={uiState === UiState.Pending}
            notifications={notifications.slice(0, MAX_NOTIFICATIONS_AMOUNT)}
          />
        </div>
      )}
    </OutsideClick>
  )
}

export default HeaderInboxNotifications
