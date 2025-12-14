'use client'

import { useState, useEffect } from 'react'
import { noop } from 'lodash'
import { Notification as WebUiNotification } from '@vinted/web-ui'

import NotificationPortal from './NotificationPortal'

type OnClose = React.ComponentProps<typeof WebUiNotification>['onClose']
type Props = Omit<React.ComponentProps<typeof NotificationPortal>, 'children'> &
  React.ComponentProps<typeof WebUiNotification>

const Notification = ({ position, onClose = noop, ...notificationProps }: Props) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

  const handleNotificationClose: OnClose = closeType => {
    setShow(false)

    onClose(closeType)
  }

  if (!show) return null

  return (
    <NotificationPortal position={position}>
      <WebUiNotification {...notificationProps} onClose={handleNotificationClose} />
    </NotificationPortal>
  )
}

export default Notification
