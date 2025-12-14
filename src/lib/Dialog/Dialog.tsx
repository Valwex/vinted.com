'use client'

import { ComponentProps, KeyboardEvent, MouseEvent, ReactNode } from 'react'
import classNames from 'classnames/bind'
import ReactModal from 'react-modal'

import { X24 } from '@vinted/monochrome-icons'

import Icon from '../Icon'
import Button from '../Button'
import Image from '../Image'
import Spacer from '../Spacer'
import Text from '../Text'
import Navigation from '../Navigation'

import { getTestId } from '../../utils/testId'
import { CloseTarget } from '../../constants/portal'

import styles from './Dialog.scss'
import { noop } from '../../utils/noop'
import { randomId } from '../../utils/randomId'

type DialogContentDimensions = {
  width?: string
  height?: string
  maxWidth?: string
  maxHeight?: string
}

type DialogAction = {
  text: ReactNode
  callback?: ((event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void) | null
  style?: ComponentProps<typeof Button>['styling']
  theme?: ComponentProps<typeof Button>['theme']
  url?: string
  urlProps?: ComponentProps<typeof Button>['urlProps']
  testId?: string
}

export type DialogProps = {
  show: boolean
  imageUrl?: string
  title?: ReactNode
  body?: ReactNode
  iconName?: ComponentProps<typeof Icon>['name']
  children?: ReactNode
  /**
   * Fires `defaultCallback` when clicking on overlay.
   */
  closeOnOverlay?: boolean
  /**
   * Restores focus to the element that was focused before the modal was opened.
   * Used for accessibility purposes.
   */
  shouldReturnFocusAfterClose?: boolean
  enableCloseButton?: boolean
  a11yCloseIconTitle?: string
  aria?: ReactModal.Aria
  hasScrollableContent?: boolean
  actions?: Array<DialogAction>
  /**
   * Customise modal content width and height
   */
  contentDimensions?: DialogContentDimensions
  /**
   * Adds modal overlay padding on mobiles.
   */
  isModal?: boolean
  /**
   * Sets additional classes on the modal content.
   */
  className?: string
  /**
   * Adds data-testid attribute to parent and children components.
   * When used, --image, --title, --body, --icon, --close-button, --overlay suffixes applied accordingly.
   */
  testId?: string
  /**
   * Callback which fires when the modal is closed.
   */
  defaultCallback?: (target: CloseTarget) => void
  onAfterOpen?: () => void
}

const cssClasses = classNames.bind(styles)

const DialogBase = ({
  show,
  imageUrl,
  title,
  body,
  iconName,
  children,
  closeOnOverlay = false,
  shouldReturnFocusAfterClose,
  enableCloseButton,
  a11yCloseIconTitle,
  aria,
  hasScrollableContent,
  actions,
  contentDimensions,
  isModal = true,
  className,
  testId: internalTestId,
  defaultCallback = noop,
  onAfterOpen = noop,
}: DialogProps) => {
  const handleOverlayClose = (event: MouseEvent | KeyboardEvent) => {
    if (event.type === 'click') {
      defaultCallback(CloseTarget.Overlay)
    } else {
      defaultCallback(CloseTarget.EscapeButton)
    }
  }

  const handleCloseIconClick = () => {
    defaultCallback(CloseTarget.CloseIcon)
  }

  const handleActionButtonClick = () => {
    defaultCallback(CloseTarget.ActionButton)
  }

  const handleAfterOpen = () => {
    onAfterOpen()
  }

  const renderImage = () => {
    if (!imageUrl) return null

    return (
      <div className={cssClasses(styles.image)}>
        <Image
          alt=""
          src={imageUrl}
          ratio="landscape"
          scaling="cover"
          testId={getTestId(internalTestId, 'image')}
        />
      </div>
    )
  }

  const renderIcon = () => {
    if (!iconName) return null

    return (
      <div>
        <Spacer size="x2-large" />
        <div className={cssClasses(styles.image)}>
          <div className={cssClasses('icon-wrapper')}>
            <Icon name={iconName} testId={getTestId(internalTestId, 'icon')} />
          </div>
        </div>
      </div>
    )
  }

  const renderButton = ({ style, callback, testId, ...rest }: DialogAction) => {
    return (
      <div className={cssClasses(styles.action)} key={randomId()}>
        <Button
          {...rest}
          styling={style}
          onClick={callback || handleActionButtonClick}
          testId={testId}
        />
      </div>
    )
  }

  const renderCloseCrossButton = () => {
    if (!enableCloseButton) return null

    return (
      <div className={cssClasses('close-button')}>
        <Navigation
          theme="transparent"
          right={
            <Button
              theme="amplified"
              styling="flat"
              onClick={handleCloseIconClick}
              icon={<Icon name={X24} />}
              testId={getTestId(internalTestId, 'close-button')}
              inline
              title={a11yCloseIconTitle}
            />
          }
        />
      </div>
    )
  }

  const renderActions = () => {
    if (!actions) return null

    return (
      <div
        className={cssClasses(styles.actions)}
        data-testid={getTestId(internalTestId, 'actions')}
      >
        {actions.map(renderButton)}
      </div>
    )
  }

  const contentWrapperClasses = cssClasses('content-wrapper', {
    [styles.modal]: isModal,
  })

  const renderContent = () => {
    return (
      <div className={contentWrapperClasses}>
        {renderCloseCrossButton()}
        {renderImage()}
        {renderIcon()}

        <div className={cssClasses('content')}>
          <div
            className={cssClasses(styles.title)}
            data-testid={getTestId(internalTestId, 'title')}
          >
            {title}
          </div>
          {body ? (
            <div className={cssClasses(styles.body)}>
              <Text as="span" text={body} format testId={getTestId(internalTestId, 'body')} />
            </div>
          ) : null}
        </div>
        {renderActions()}
      </div>
    )
  }

  const dialogContentClasses = cssClasses(className, 'dialog', {
    'scrollable-content': hasScrollableContent,
  })

  const dialogOverlayClasses = cssClasses('overlay', {
    [styles.modal]: isModal,
  })

  const customStyle = contentDimensions
    ? {
        content: contentDimensions,
      }
    : undefined

  return (
    <ReactModal
      isOpen={show}
      onRequestClose={handleOverlayClose}
      onAfterOpen={handleAfterOpen}
      portalClassName={cssClasses('portal')}
      bodyOpenClassName={cssClasses('dialog-open')}
      htmlOpenClassName={cssClasses('dialog-open')}
      overlayClassName={dialogOverlayClasses}
      className={dialogContentClasses}
      shouldCloseOnOverlayClick={closeOnOverlay}
      shouldReturnFocusAfterClose={shouldReturnFocusAfterClose}
      overlayElement={(props, contentElement) => (
        <div {...props} data-testid={getTestId(internalTestId, 'overlay')}>
          {contentElement}
        </div>
      )}
      aria={aria}
      // Disables warning that tries to hide main app when modal is shown
      ariaHideApp={false}
      testId={internalTestId}
      style={customStyle}
    >
      {children || renderContent()}
    </ReactModal>
  )
}

/** The public component type: a React component value that also has deprecated statics */
export type DialogComponent = typeof DialogBase & {
  ActionStyling: typeof Button.Styling
  CloseTarget: typeof CloseTarget
}

/** Exported component: arrow fn + statics, deprecations intact, docgen-friendly */
export const Dialog: DialogComponent = Object.assign(DialogBase, {
  ActionStyling: Button.Styling,
  CloseTarget,
})

export default Dialog
