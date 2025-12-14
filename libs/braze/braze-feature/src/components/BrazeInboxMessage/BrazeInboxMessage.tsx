'use client'

import { X24 } from '@vinted/monochrome-icons'
import { Bubble, Button, Dialog, Image, Navigation, Spacer, Text } from '@vinted/web-ui'
import { MouseEvent, ReactNode, useContext, useEffect, useRef, useState } from 'react'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useAsset } from '@marketplace-web/shared/assets'
import {
  BRAZE_VINTED_LOGO_IMAGE_PATH,
  BrazeInboxMessageCardDto,
  clickEvent,
  viewEvent,
} from '@marketplace-web/braze/braze-data'
import { linkifyString } from '@marketplace-web/browser/url-util'

import BrazeContext from '../../containers/BrazeProvider/BrazeContext'

type Props = {
  card: BrazeInboxMessageCardDto
  prefix?: ReactNode
}

const VIDEO_TRACKING_DECIMAL_PLACES = 2

const BrazeInboxMessage = ({ card, prefix }: Props) => {
  const { track } = useTracking()
  const rootAsset = useAsset()
  const asset = useAsset('/assets/onboarding-modal')
  const { logCardClick, logCardImpression, inboxMessageCardStore } = useContext(BrazeContext)
  const shouldSendFullDurationVideoEvent = useRef(true)
  const video = useRef<HTMLVideoElement>(null)
  const translate = useTranslate('common.a11y')

  const [showVideo, setShowVideo] = useState(false)

  const isCTAButtonAvailable = !!card.linkText && !!card.url
  const isBannerAvailable = !card.extras.videoURL && !!card.imageUrl
  const isVideoAvailable = !!card.extras.videoURL && !!card.imageUrl

  const cardId = card.id

  useEffect(() => {
    const viewedBefore = card.viewed

    logCardImpression(cardId).then(isLogged => {
      if (!isLogged || viewedBefore) return

      if (inboxMessageCardStore.state) {
        inboxMessageCardStore.state = Array.from(inboxMessageCardStore.state || [])
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId])

  const handleThumbnailClick = () => {
    setShowVideo(true)
  }

  const handleButtonClick = () => {
    logCardClick(cardId)
  }

  const trackVideoView = () => {
    if (!video.current) return

    const fullDuration = Number(video.current.duration.toFixed(VIDEO_TRACKING_DECIMAL_PLACES))
    const viewedDuration = Number(video.current.currentTime.toFixed(VIDEO_TRACKING_DECIMAL_PLACES))
    const isFullDuration = fullDuration === viewedDuration

    if (isFullDuration && !shouldSendFullDurationVideoEvent.current) return
    if (isFullDuration) shouldSendFullDurationVideoEvent.current = false

    // TODO: parsing should be moved to a transformer
    // `InboxMessageCardStore.isConsumable` is responsible for checking that `tracking` is parseable
    const trackingData = JSON.parse(card.extras.tracking)

    const targetDetails = JSON.stringify({
      campaign_name: trackingData.campaign_name,
      campaign_message_name: trackingData.campaign_message_name,
      canvas_name: trackingData.canvas_name,
      canvas_variant_name: trackingData.canvas_variant_name,
      video_url: card.extras.videoURL,
      video_length: fullDuration,
      length_watched: viewedDuration,
    })

    track(
      viewEvent({
        target: 'crm_message_video',
        screen: 'message_reply',
        targetDetails,
      }),
    )
  }

  const handleVideoClose = () => {
    setShowVideo(false)

    trackVideoView()

    shouldSendFullDurationVideoEvent.current = true
  }

  const handleVideoEnded = () => {
    trackVideoView()
  }

  const handleMessageClick = (event: MouseEvent) => {
    if (!(event.target instanceof HTMLAnchorElement)) return

    // TODO: parsing should be moved to a transformer
    // `InboxMessageCardStore.isConsumable` is responsible for checking that `tracking` is parseable
    const trackingData = JSON.parse(card.extras.tracking)

    const targetDetails = JSON.stringify({
      url: event.target.href,
      campaign_name: trackingData.campaign_name,
      campaign_message_name: trackingData.campaign_message_name,
      canvas_name: trackingData.canvas_name,
      canvas_variant_name: trackingData.canvas_variant_name,
    })

    track(
      clickEvent({
        target: 'crm_message_link',
        screen: 'message_reply',
        targetDetails,
      }),
    )
  }
  const renderPrefix = () => {
    return prefix
  }

  const renderLogo = () => {
    return (
      <div className="u-ui-margin-right-regular">
        <Image
          role="img"
          src={card.extras.logoURL || rootAsset(BRAZE_VINTED_LOGO_IMAGE_PATH)}
          fallbackSrc={rootAsset(BRAZE_VINTED_LOGO_IMAGE_PATH)}
          size="medium"
          styling="circle"
          testId="braze-message-logo"
        />
      </div>
    )
  }

  const renderBanner = () => {
    return (
      <div className="u-ui-margin-bottom-large u-fill-width">
        <Image role="img" src={card.imageUrl} styling="rounded" />
      </div>
    )
  }

  const renderCloseButton = (onClick: () => void) => {
    return (
      <div className="u-position-absolute u-fill-width">
        <Navigation
          theme="transparent"
          right={
            <Button
              styling="flat"
              inline
              onClick={onClick}
              iconName={X24}
              iconColor="greyscale-level-6"
              testId="braze-message-video-close-button"
              aria={{ 'aria-label': translate('actions.dialog_close') }}
            />
          }
        />
      </div>
    )
  }

  const renderThumbnail = () => {
    return (
      <button
        type="button"
        className="u-ui-margin-bottom-large u-cursor-pointer u-position-relative u-inline-block"
        onClick={handleThumbnailClick}
      >
        <Image role="img" src={card.imageUrl} styling="rounded" alt={translate('alt.video')} />
        <div className="braze-conversation-message__video-thumbnail-play-button">
          <Image role="img" src={asset('play-button.svg')} size="medium" />
        </div>
      </button>
    )
  }

  const renderVideo = () => {
    return (
      <div className="u-transform-style-preserve-3d">
        <video
          ref={video}
          data-testid="braze-message-video"
          className="braze-conversation-message__video"
          autoPlay
          controls
          disablePictureInPicture
          controlsList="nodownload noplaybackrate"
          muted
          onEnded={handleVideoEnded}
        >
          <source data-testid="braze-message-video-source" src={card.extras.videoURL} />
        </video>
      </div>
    )
  }

  return (
    <>
      {renderPrefix()}
      <div className="u-ui-padding-bottom-small u-ui-margin-top-medium u-flexbox">
        {renderLogo()}
        <div className="braze-conversation-message" data-testid="braze-message-content">
          {isBannerAvailable && renderBanner()}
          {isVideoAvailable && renderThumbnail()}
          <Bubble>
            <span role="none" onClick={handleMessageClick}>
              <Text
                theme="amplified"
                format
                html
                text={linkifyString(card.description)}
                testId="braze-message-text"
                as="span"
              />
            </span>
            {isCTAButtonAvailable && (
              <>
                <Spacer size="large" />
                <Button
                  text={card.linkText}
                  onClick={handleButtonClick}
                  url={card.url}
                  size="medium"
                  styling="filled"
                />
              </>
            )}
          </Bubble>
        </div>
        {isVideoAvailable && (
          <Dialog
            show={showVideo}
            closeOnOverlay
            defaultCallback={handleVideoClose}
            className="u-width-auto u-position-relative"
          >
            {renderCloseButton(handleVideoClose)}
            {renderVideo()}
          </Dialog>
        )}
      </div>
    </>
  )
}

export default BrazeInboxMessage
