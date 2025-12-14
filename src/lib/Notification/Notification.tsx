'use client'

import {
  ComponentProps,
  ReactNode,
  ReactElement,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'
import classNames from 'classnames/bind'
import { X24 } from '@vinted/monochrome-icons'

import styles from './Notification.scss'

import Card from '../Card'
import Cell from '../Cell'
import Icon from '../Icon'
import type { IconProps } from '../Icon/Icon'
import Text from '../Text'
import Button from '../Button'
import { getTestId } from '../../utils/testId'

/* ---------- String-union sources of truth ---------- */
export const NOTIFICATION_CLOSE_TYPE_VALUES = ['close_button_click', 'body_click', 'auto'] as const
export type NotificationCloseType = (typeof NOTIFICATION_CLOSE_TYPE_VALUES)[number]

/* ---------- Back-compat shim (deprecated) ---------- */
export const NOTIFICATION_CLOSE_TYPE = {
  CloseButtonClick: 'close_button_click',
  BodyClick: 'body_click',
  Auto: 'auto',
} as const satisfies Record<string, NotificationCloseType>

/* ---------- Type definitions ---------- */
export type NotificationProps = {
  iconName?: ComponentProps<typeof Icon>['name']
  icon?: ReactElement<IconProps>
  body: ReactNode
  suffix?: JSX.Element | string | null | false
  onClick?: () => void
  displayDuration?: number
  forceVisibility?: boolean
  onClose?: (closeType: NotificationCloseType | undefined) => void
  /**
   * Adds data-testid attribute to parent and children components.
   * When used, --suffix, --close-button, --icon and --body suffixes applied accordingly.
   */
  testId?: string
  /**
   * Provides accessible label for the suffix button.
   */
  actionButtonLabel?: string
}

const MS_PER_SECOND = 1000
const DELAY_DURATION = 500

const cssClasses = classNames.bind(styles)

const NotificationBase = ({
  displayDuration = 5,
  forceVisibility,
  onClose,
  iconName,
  icon,
  onClick,
  body,
  suffix,
  actionButtonLabel,
  testId,
}: NotificationProps) => {
  const [visible, setVisible] = useState(true)
  const timeoutRef = useRef<number | undefined>(undefined)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const close = useCallback((type: NotificationCloseType) => {
    clearTimeout(timeoutRef.current)
    setTimeout(() => onCloseRef.current?.(type), DELAY_DURATION)
    setVisible(false)
  }, [])

  useEffect(() => {
    if (forceVisibility || !displayDuration) return undefined

    setVisible(true)
    timeoutRef.current = window.setTimeout(
      () => close(NOTIFICATION_CLOSE_TYPE.Auto),
      displayDuration * MS_PER_SECOND,
    )

    return () => clearTimeout(timeoutRef.current)
  }, [forceVisibility, displayDuration, close])

  const handleClick = () => {
    if (!onClick) return

    onClick()
    close(NOTIFICATION_CLOSE_TYPE.BodyClick)
  }

  const renderIcon = () => {
    if (!icon && !iconName) return null

    return (
      <div className={styles.icon}>
        {icon || (iconName && <Icon name={iconName} testId={getTestId(testId, 'icon')} />)}
      </div>
    )
  }

  const renderBody = () => {
    if (!body) return null

    return <Text as="span" text={body} testId={getTestId(testId, 'body')} />
  }

  const renderSuffix = () => {
    if (typeof suffix === 'boolean') {
      return null
    }

    if (suffix) return <span data-testid={getTestId(testId, 'suffix')}>{suffix}</span>

    const handleDefaultSuffixClick = () => close(NOTIFICATION_CLOSE_TYPE.CloseButtonClick)
    const defaultSuffix = (
      <Button
        iconName={X24}
        inline
        onClick={handleDefaultSuffixClick}
        styling="flat"
        testId={getTestId(testId, 'close-button')}
        aria-label={actionButtonLabel}
      />
    )

    return defaultSuffix
  }

  const notificationClass = cssClasses(styles.notification, {
    [styles['fade-in']]: visible,
    [styles['fade-out']]: !visible,
  })

  return (
    <div className={notificationClass} data-testid={testId}>
      <Card styling="elevated">
        <div className={cssClasses(styles.content)}>
          <Cell
            prefix={renderIcon()}
            body={renderBody()}
            suffix={renderSuffix()}
            onClick={handleClick}
            type={onClick ? 'navigating' : undefined}
          />
        </div>
      </Card>
    </div>
  )
}

/** The public component type: a React component value that also has deprecated statics */
export type NotificationComponent = typeof NotificationBase & {
  /** @deprecated Use string unions, e.g. closeType="auto" */
  CloseType: typeof NOTIFICATION_CLOSE_TYPE
}

/** Exported component: arrow fn + statics, deprecations intact, docgen-friendly */
export const Notification: NotificationComponent = Object.assign(NotificationBase, {
  /** @deprecated Use string unions, e.g. closeType="auto" */
  CloseType: NOTIFICATION_CLOSE_TYPE,
})

export default Notification
