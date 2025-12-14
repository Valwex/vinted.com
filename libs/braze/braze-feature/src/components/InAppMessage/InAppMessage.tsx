'use client'

import { useCallback, useState } from 'react'

import {
  InAppMessageDismissMethod,
  InAppModalMessageModel,
  InAppNotificationMessageModel,
  clickEvent,
} from '@marketplace-web/braze/braze-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'

import useBrazeInAppMessage from '../../hooks/useBrazeInAppMessage'
import {
  brazeLogInAppMessageButtonClick,
  brazeLogInAppMessageClick,
  brazeLogInAppMessageImpression,
} from '../../utils/event-loggers'

import ModalInAppMessage from './ModalInAppMessage'
import NotificationInAppMessage from './NotificationInAppMessage'

interface TargetDetails {
  campaign_name?: string
  campaign_message_name?: string
  canvas_name?: string
  canvas_variant_name?: string
  dismiss_method?: string
  dismiss_duration?: number
  url?: string
}

const InAppMessage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true)

  const { track } = useTracking()
  const { notificationInAppMessage, modalInAppMessage } = useBrazeInAppMessage()

  const anyInAppMessage = notificationInAppMessage ?? modalInAppMessage

  const trackDismissal = (
    inAppMessage: InAppModalMessageModel | InAppNotificationMessageModel | null,
    dismissMethod: InAppMessageDismissMethod,
  ) => {
    if (!inAppMessage) return

    const targetDetails: TargetDetails = {
      campaign_name: inAppMessage.campaignName,
      campaign_message_name: inAppMessage.campaignMessageName,
      canvas_name: inAppMessage.canvasName,
      canvas_variant_name: inAppMessage.canvasVariantName,
      dismiss_method: dismissMethod,
    }

    if (dismissMethod === InAppMessageDismissMethod.AutoDismiss && inAppMessage.duration) {
      const formattedDuration = inAppMessage.duration / 1000
      targetDetails.dismiss_duration = formattedDuration
    }

    track(
      clickEvent({
        target: 'crm_in_app_message_dismiss',
        screen: 'crm_in_app_message',
        targetDetails: JSON.stringify(targetDetails),
      }),
    )
  }

  const closeModal = (dismissMethod: InAppMessageDismissMethod) => {
    setIsModalOpen(false)
    trackDismissal(modalInAppMessage, dismissMethod)
  }

  const handleCloseButtonClick = () => {
    closeModal(InAppMessageDismissMethod.CloseButton)
  }

  const handleBackgroundClick = () => {
    closeModal(InAppMessageDismissMethod.BackgroundClick)
  }

  const handlePrimaryButtonClick = () => {
    if (!modalInAppMessage) return

    if (!modalInAppMessage.primaryButtonUrl) closeModal(InAppMessageDismissMethod.NoUrlButton)

    brazeLogInAppMessageButtonClick(modalInAppMessage, 0)
  }

  const handleSecondaryButtonClick = () => {
    if (!modalInAppMessage) return

    if (!modalInAppMessage.secondaryButtonUrl) closeModal(InAppMessageDismissMethod.NoUrlButton)

    brazeLogInAppMessageButtonClick(modalInAppMessage, 1)
  }

  const handleModalLinkClick = (url: string) => {
    if (!modalInAppMessage) return

    const targetDetails: TargetDetails = {
      campaign_name: modalInAppMessage.campaignName,
      campaign_message_name: modalInAppMessage.campaignMessageName,
      canvas_name: modalInAppMessage.canvasName,
      canvas_variant_name: modalInAppMessage.canvasVariantName,
      url,
    }

    track(
      clickEvent({
        target: 'crm_message_link',
        screen: 'crm_in_app_message',
        targetDetails: JSON.stringify(targetDetails),
      }),
    )
  }

  const handleNotificationClose: React.ComponentProps<
    typeof NotificationInAppMessage
  >['onClose'] = closeType => {
    if (!notificationInAppMessage) {
      return
    }

    switch (closeType) {
      case 'auto':
        trackDismissal(notificationInAppMessage, InAppMessageDismissMethod.AutoDismiss)
        break
      case 'close_button_click':
        trackDismissal(notificationInAppMessage, InAppMessageDismissMethod.CloseButton)
        brazeLogInAppMessageClick(notificationInAppMessage)
        break
      default:
        break
    }
  }

  const handleNotificationLinkClick = () => {
    if (!notificationInAppMessage?.url) return

    brazeLogInAppMessageClick(notificationInAppMessage)
  }

  const handleInAppMessageEnter = useCallback(() => {
    if (!anyInAppMessage) return

    brazeLogInAppMessageImpression(anyInAppMessage)
  }, [anyInAppMessage])

  if (notificationInAppMessage) {
    return (
      <NotificationInAppMessage
        onEnter={handleInAppMessageEnter}
        inAppMessage={notificationInAppMessage}
        onClose={handleNotificationClose}
        onLinkClick={handleNotificationLinkClick}
      />
    )
  }

  if (modalInAppMessage) {
    return (
      <ModalInAppMessage
        isOpen={isModalOpen}
        inAppMessage={modalInAppMessage}
        onCloseButtonClick={handleCloseButtonClick}
        onBackgroundClick={handleBackgroundClick}
        onLinkClick={handleModalLinkClick}
        onEnter={handleInAppMessageEnter}
        onPrimaryButtonClick={handlePrimaryButtonClick}
        onSecondaryButtonClick={handleSecondaryButtonClick}
      />
    )
  }

  return null
}

export default InAppMessage
