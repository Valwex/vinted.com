'use client'

import { Envelope24 } from '@vinted/monochrome-icons'
import { Badge, Button, Icon } from '@vinted/web-ui'

import { useUnreadMessages } from '@marketplace-web/messaging/unread-messages-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useBrazeInboxMessageCards } from '@marketplace-web/braze/braze-feature'
import { inboxButtonClickEvent } from '@marketplace-web/messaging/tracking-data'
import { useInboxNavigator } from '@marketplace-web/messaging/navigation-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'

const MAX_BADGE_COUNT = 99

const HeaderConversations = () => {
  const translate = useTranslate('header.a11y.conversations')
  const { inboxMessageCards } = useBrazeInboxMessageCards()
  const { track } = useTracking()
  const inboxNavigator = useInboxNavigator()

  const unreadMsgCount = useUnreadMessages()

  const brazeConversationCount = inboxMessageCards?.filter(card => !card.viewed).length ?? 0
  const mergedConversationCount = unreadMsgCount + brazeConversationCount
  const badgeConversationCount = inboxMessageCards
    ? Math.min(mergedConversationCount, MAX_BADGE_COUNT)
    : 0
  const badgeSuffix = mergedConversationCount > MAX_BADGE_COUNT ? '+' : ''

  const handleInboxButtonClick = () => {
    inboxNavigator.createNavigationStartMark().store()
    const isUnread = mergedConversationCount > 0

    track(inboxButtonClickEvent({ isUnread }))
  }

  return (
    <>
      <Button
        testId="header-conversations-button"
        styling="flat"
        aria={{
          'aria-label': mergedConversationCount
            ? translate('new_conversations', { count: mergedConversationCount })
            : translate('conversations'),
        }}
        iconName={Envelope24}
        icon={<Icon name={Envelope24} color="greyscale-level-2" />}
        url={inboxNavigator.createUrl()}
        onClick={handleInboxButtonClick}
      />
      {!!badgeConversationCount && (
        <div
          className="user-actions__notification u-no-pointer-events"
          data-testid="conversations-badge"
        >
          <Badge
            content={<span aria-hidden="true">{`${badgeConversationCount}${badgeSuffix}`}</span>}
            theme="warning"
          />
        </div>
      )}
    </>
  )
}

export default HeaderConversations
