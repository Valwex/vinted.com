'use client'

import { X24 } from '@vinted/monochrome-icons'
import { Button, Cell, Dialog, Icon, Image, Navigation, Spacer, Text } from '@vinted/web-ui'
import classNames from 'classnames'
import { MouseEvent, useMemo } from 'react'

import { InAppModalMessageModel, InAppModalMessageType } from '@marketplace-web/braze/braze-data'
import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'
import { linkifyString } from '@marketplace-web/browser/url-util'

type Props = {
  inAppMessage: InAppModalMessageModel
  isOpen: boolean
  onBackgroundClick: () => void
  onCloseButtonClick: () => void
  onEnter: () => void
  onPrimaryButtonClick: () => void
  onSecondaryButtonClick: () => void
  onLinkClick: (url: string) => void
}

// TODO: split the component into three components:
// SplashInAppModal
// FullScreenSplashInAppModal
// CoverInAppModal
const ModalInAppMessage = ({
  inAppMessage,
  isOpen,
  onBackgroundClick,
  onCloseButtonClick,
  onEnter,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  onLinkClick,
}: Props) => {
  const breakpoints = useBreakpoint()
  const translate = useTranslate('common.a11y.actions')

  // TODO: infer whether the link is external and add rel attributes
  const urlProps = inAppMessage.shouldOpenLinkInNewTab ? { target: '_blank' } : undefined
  const isSplash = inAppMessage.type === InAppModalMessageType.Splash
  const isCover = inAppMessage.type === InAppModalMessageType.Cover
  const secondaryButtonStyle = inAppMessage.secondaryButtonUrl ? 'outlined' : 'flat'
  const showImage = inAppMessage.imageUrl

  const showCloseButton = useMemo(() => {
    if (inAppMessage.secondaryButtonText) {
      return Boolean(inAppMessage.primaryButtonUrl && inAppMessage.secondaryButtonUrl)
    }

    return Boolean(inAppMessage.primaryButtonUrl)
  }, [inAppMessage])

  const handleMessageClick = (event: MouseEvent) => {
    if (!(event.target instanceof HTMLAnchorElement)) return

    const url = event.target.href

    if (!url) return

    onLinkClick(url)
  }

  const renderMessage = () => {
    if (!inAppMessage.message) return null

    return (
      <div role="none" onClick={handleMessageClick} className="u-text-wrap">
        <Spacer size="large" />
        <Text
          as="span"
          text={linkifyString(inAppMessage.message)}
          html
          format
          theme={isCover ? 'inverse' : undefined}
          alignment="center"
        />
      </div>
    )
  }

  const renderCoverSecondaryButton = () => {
    return (
      <Button
        onClick={onSecondaryButtonClick}
        styling={secondaryButtonStyle}
        url={inAppMessage.secondaryButtonUrl}
        urlProps={urlProps}
        testId="in-app-message-secondary-button"
      >
        <Text
          as="span"
          theme="inverse"
          text={inAppMessage.secondaryButtonText}
          alignment="center"
        />
      </Button>
    )
  }

  const renderSecondaryButton = () => {
    if (isCover) return renderCoverSecondaryButton()

    return (
      <Button
        text={inAppMessage.secondaryButtonText}
        onClick={onSecondaryButtonClick}
        styling={secondaryButtonStyle}
        url={inAppMessage.secondaryButtonUrl}
        urlProps={urlProps}
        testId="in-app-message-secondary-button"
      />
    )
  }

  const classes = classNames(
    'u-justify-content-between u-flexbox u-flex-direction-column u-fill-height',
  )

  const messageClasses = classNames({
    'u-margin-auto': isCover,
  })

  const imageClasses = classNames({
    'u-fill-width u-fill-height u-position-absolute': isCover,
    'modal-in-app-message__splash-image': !isCover,
  })

  const modalClasses = classNames('u-position-relative u-flexbox', {
    'u-fill-height u-fill-width': !isSplash && breakpoints.phones,
    'modal-in-app-message--cover': isCover,
  })

  const renderImage = () => {
    if (!showImage) {
      return showCloseButton ? (
        <div data-testid="no-image-spacer" className="modal-in-app-message__no-image" />
      ) : null
    }

    return (
      <div className={imageClasses}>
        <Image
          testId="in-app-message"
          ratio="landscape"
          src={inAppMessage.imageUrl}
          scaling="cover"
        />
      </div>
    )
  }

  const renderCloseButton = () => {
    if (!showCloseButton) return null

    return (
      <Button
        testId="close-modal-button"
        styling="flat"
        inline
        onClick={onCloseButtonClick}
        icon={<Icon name={X24} color="greyscale-level-1" />}
        aria={{ 'aria-label': translate('dialog_close') }}
      />
    )
  }

  return (
    <Dialog
      closeOnOverlay
      testId="in-app-message-modal"
      show={isOpen}
      className={modalClasses}
      hasScrollableContent={isSplash || breakpoints.tabletsUp}
      defaultCallback={onBackgroundClick}
      onAfterOpen={onEnter}
      isModal={isSplash}
    >
      <div className="u-overflow-auto u-fill-width">
        <div className={classes}>
          <div className="u-position-absolute u-fill-width">
            <Navigation theme="transparent" right={renderCloseButton()} />
          </div>
          {renderImage()}
          <div className="u-justify-content-between u-flexbox u-fill-height u-flex-direction-column">
            <div className={messageClasses}>
              <Cell theme={isCover ? 'transparent' : undefined}>
                {inAppMessage.header && (
                  <div className="u-text-wrap">
                    <Text
                      as="h1"
                      text={inAppMessage.header}
                      type="heading"
                      theme={isCover ? 'inverse' : undefined}
                      width="parent"
                      alignment="center"
                    />
                  </div>
                )}
                {renderMessage()}
              </Cell>
            </div>
            <Cell theme={isCover ? 'transparent' : undefined}>
              <SeparatedList separator={<Spacer size="large" />}>
                {inAppMessage.primaryButtonText && (
                  <Button
                    text={inAppMessage.primaryButtonText}
                    onClick={onPrimaryButtonClick}
                    styling="filled"
                    url={inAppMessage.primaryButtonUrl}
                    urlProps={urlProps}
                    testId="in-app-message-primary-button"
                  />
                )}
                {inAppMessage.secondaryButtonText && renderSecondaryButton()}
              </SeparatedList>
            </Cell>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ModalInAppMessage
