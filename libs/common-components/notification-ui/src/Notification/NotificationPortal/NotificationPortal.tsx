'use client'

import { ReactNode } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import { NotificationPosition } from '../../constants/notification'

type Props = {
  position?: NotificationPosition
  children: ReactNode
}

const NotificationPortal = ({ position = NotificationPosition.Bottom, children }: Props) => {
  if (position === NotificationPosition.Parent)
    return <div className="u-z-index-notification">{children}</div>

  const classes = classNames('u-z-index-notification', {
    'u-sticky-bottom u-ui-padding-bottom-x-large': position === NotificationPosition.Bottom,
    'u-fixed-top u-ui-padding-top-x-large': position === NotificationPosition.Top,
    'u-fixed-top u-right u-ui-padding-top-x5-large': position === NotificationPosition.TopRight,
  })

  return ReactDOM.createPortal(
    <div className="u-flexbox u-align-items-center u-justify-content-center">
      <div className={classes}>{children}</div>
    </div>,
    document.body,
  )
}

export default NotificationPortal
