'use client'

import { Image, Text } from '@vinted/web-ui'
import { useEffect } from 'react'

import { InAppNotificationMessageModel } from '@marketplace-web/braze/braze-data'
import { Notification } from '@marketplace-web/common-components/notification-ui'

type Props = {
  inAppMessage: InAppNotificationMessageModel
  onClose: React.ComponentProps<typeof Notification>['onClose']
  onEnter: () => void
  onLinkClick: () => void
}

const ONE_SECOND_IN_MILISECONDS = 1000

const NotificationInAppMessage = ({ inAppMessage, onClose, onLinkClick, onEnter }: Props) => {
  useEffect(onEnter, [onEnter])

  const buildLink = (children: JSX.Element) => {
    if (!inAppMessage.url) return children

    const target = inAppMessage.shouldOpenLinkInNewTab ? '_target' : undefined

    return (
      <a href={inAppMessage.url} target={target} onClick={onLinkClick}>
        {children}
      </a>
    )
  }

  const renderBody = () => {
    return (
      <div role="alert" aria-live="assertive" aria-describedby="aria-description">
        <div
          id="aria-description"
          data-testid="notification-in-app-message-aria-description"
          className="hidden"
        >
          {inAppMessage.message}
        </div>
        {buildLink(
          <Text
            as="span"
            testId="notification-in-app-message-text"
            text={inAppMessage.message}
            html
          />,
        )}
      </div>
    )
  }

  const renderImage = () => {
    if (!inAppMessage.imageUrl) return undefined

    return buildLink(<Image src={inAppMessage.imageUrl} alt="" size="large" />)
  }

  const miliSecondsToSeconds = (duration: number) => Math.ceil(duration / ONE_SECOND_IN_MILISECONDS)

  return (
    <Notification
      icon={renderImage()}
      body={renderBody()}
      displayDuration={inAppMessage.duration && miliSecondsToSeconds(inAppMessage.duration)}
      forceVisibility={!inAppMessage.duration}
      position={inAppMessage.position}
      onClose={onClose}
      testId="in-app-message-notification"
    />
  )
}

export default NotificationInAppMessage
