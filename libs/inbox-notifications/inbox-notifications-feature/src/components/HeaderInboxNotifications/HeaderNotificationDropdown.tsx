'use client'

import { Animation, Button, Divider, Loader, Spacer, Text } from '@vinted/web-ui'

import { useAsset } from '@marketplace-web/shared/assets'
import {
  GenericInboxNotificationModel,
  InboxNotificationImpressionSource as eventSource,
  clickEvent,
} from '@marketplace-web/inbox-notifications/inbox-notifications-data'
import { ScrollableArea } from '@marketplace-web/common-components/scrollable-area-ui'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'

import { NOTIFICATIONS_URL } from '../../constants/routes'
import useInboxNotificationEvents from '../../hooks/useInboxNotificationEvents'
import InboxNotificationItem from '../InboxNotificationItem'

type Props = {
  isLoading: boolean
  notifications: Array<GenericInboxNotificationModel>
}

const HeaderNotificationDropdown = ({ notifications, isLoading }: Props) => {
  const translate = useTranslate()
  const { track } = useTracking()
  const asset = useAsset('/assets/animations')

  const { trackNotificationClick, trackNotificationEnter } = useInboxNotificationEvents()

  const handleSeeAllClick = () => {
    track(
      clickEvent({
        target: 'header_inbox_notifications_see_all',
      }),
    )
  }

  function renderNotification(notification: GenericInboxNotificationModel) {
    return (
      <InboxNotificationItem
        notification={notification}
        key={notification.id}
        onEnter={trackNotificationEnter(notification, eventSource.InboxNotificationsDropdown)}
        onClick={trackNotificationClick(notification)}
        defaultHighlighted={!notification.isViewed}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="u-ui-margin-x-large u-flexbox u-justify-content-center" data-testid="loader">
        <Loader size="large" />
      </div>
    )
  }

  if (!notifications.length) {
    return (
      <div className="u-ui-margin-vertical-x-large u-ui-margin-horizontal-x2-large u-flexbox u-flex-direction-column u-align-items-center">
        <Spacer />
        <Animation
          animationUrl={asset('notifications-empty-state.json')}
          size={Animation.Size.Large}
        />
        <Spacer size="large" />
        <Text
          as="h2"
          text={translate('header.notifications.empty_state.title')}
          alignment="center"
          type="title"
        />
        <Spacer />
      </div>
    )
  }

  return (
    <div>
      <ScrollableArea>
        <div className="header-notification-dropdown__container">
          <SeparatedList separator={<Divider />}>
            {notifications.map(renderNotification)}
          </SeparatedList>
        </div>
      </ScrollableArea>
      <div className="header-notification-dropdown__button-container">
        <Button
          testId="header-notification-see-all-button"
          onClick={handleSeeAllClick}
          url={NOTIFICATIONS_URL}
          text={translate('header.notifications.see_all')}
          size="medium"
        />
      </div>
    </div>
  )
}

export default HeaderNotificationDropdown
