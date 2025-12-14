'use client'

import { Cell, Image, Text } from '@vinted/web-ui'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'

import { useAsset } from '@marketplace-web/shared/assets'
import { INBOX_WANT_IT_PATH } from '@marketplace-web/messaging/navigation-feature'
import {
  GenericInboxNotificationModel,
  InboxNotificationType,
  NotificationEntryType,
} from '@marketplace-web/inbox-notifications/inbox-notifications-data'
import { BRAZE_VINTED_LOGO_IMAGE_PATH } from '@marketplace-web/braze/braze-data'
import { FormattedRelativeTime } from '@marketplace-web/i18n/i18n-feature'
import { toParams } from '@marketplace-web/browser/url-util'

type Props = {
  notification: GenericInboxNotificationModel
  onClick: () => void
  onEnter: () => void
  defaultHighlighted?: boolean
}

const InboxNotificationItem = ({ notification, onClick, onEnter, defaultHighlighted }: Props) => {
  // we are using `useState` to protect `isHighlighted` from unwanted `defaultHighlighted` changes
  // so the setter is unused
  // eslint-disable-next-line react/hook-use-state
  const [isHighlighted] = useState(defaultHighlighted)
  const asset = useAsset()
  const { ref } = useInView({
    onChange: inView => inView && onEnter(),
  })

  const { type, entryType, body, note, link, subjectId, time, photoUrl, photoStyle } = notification

  const renderImage = () => {
    const fallbackImage =
      type === InboxNotificationType.Braze ? asset(BRAZE_VINTED_LOGO_IMAGE_PATH) : undefined

    return (
      <Image
        role="img"
        src={photoUrl || fallbackImage}
        fallbackSrc={fallbackImage}
        size="large"
        styling={photoStyle} // TODO: check if we can use single style, rather than dynamic
      />
    )
  }

  const renderBody = () => (
    <>
      <Text as="span" text={body} html width="parent" />
      {!!note && (
        <Text as="h3" type="subtitle" width="parent" text={note} html /> // TODO: check if this is needed
      )}
      <Text as="h3" text={<FormattedRelativeTime value={time} />} type="subtitle" width="parent" />
    </>
  )

  const isNotificationLinkShown = entryType !== NotificationEntryType.ItemFavourite && link

  const getItemFavoriteUrl = () => {
    const queryParams = link && toParams(link.split('?')[1] || '')
    const receiverId = queryParams && (queryParams.offering_id as string)

    return receiverId && subjectId ? INBOX_WANT_IT_PATH(receiverId, subjectId) : ''
  }

  return (
    <div ref={ref} data-testid="inbox-notification-intersection-wrapper">
      <Cell
        type={link ? 'navigating' : undefined}
        onClick={onClick}
        tabIndex={0}
        highlighted={isHighlighted}
        prefix={renderImage()}
        body={renderBody()}
        url={isNotificationLinkShown ? link : getItemFavoriteUrl()}
        testId={`user-notification-item${isHighlighted ? '-highlighted' : ''}`}
      />
    </div>
  )
}

export default InboxNotificationItem
