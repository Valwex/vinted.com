'use client'

import { X24 } from '@vinted/monochrome-icons'
import { Button, Carousel, Image, Loader, Navigation, Spacer, Text } from '@vinted/web-ui'
import classNames from 'classnames'

import {
  createRef,
  MouseEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'
import { useIsDarkMode } from '@marketplace-web/dark-mode/dark-mode-feature'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useAsset } from '@marketplace-web/shared/assets'
import {
  OnboardingModalModel,
  OnboardingSlideVideoModel,
  OnboardingSlideModel,
} from '@marketplace-web/banners/banners-data'

type Props = {
  banner: OnboardingModalModel
  onSlideChange: (slideIndex: number) => void
  onClose: () => void
}

const OnboardingTextVariant = ({ banner, onSlideChange, onClose }: Props) => {
  const breakpoints = useBreakpoint()
  const [slideIndex, setSlideIndex] = useState(0)
  const [hasAutoplayError, setHasAutoplayError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const asset = useAsset('/assets/onboarding-modal')
  const translate = useTranslate()
  const isDarkMode = useIsDarkMode()

  const videoRefs = useMemo(
    () =>
      Array(banner.steps.length)
        .fill(0)
        .map(() => createRef<HTMLVideoElement>()),
    [banner.steps.length],
  )

  const getVideoByIndex = useCallback((index: number) => videoRefs[index]?.current, [videoRefs])

  const playVideo = useCallback(async (video: HTMLVideoElement) => {
    try {
      await video.play()
      setHasAutoplayError(false)
    } catch {
      setHasAutoplayError(true)
    }
  }, [])

  useEffect(() => {
    const video = getVideoByIndex(slideIndex)

    if (!video) return undefined

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      playVideo(video)
    } else {
      video.load()
      setIsLoading(true)
    }

    return () => video.pause()
  }, [getVideoByIndex, playVideo, slideIndex])

  const handleSlideInteract = (newSlideIndex: number) => {
    const video = getVideoByIndex(newSlideIndex)

    if (video) video.currentTime = 0
    if (newSlideIndex === slideIndex) return

    setSlideIndex(newSlideIndex)
    onSlideChange(newSlideIndex)
  }

  const handleCanPlay = (event: SyntheticEvent) => {
    const video = getVideoByIndex(slideIndex)

    if (!video) return
    if (event.currentTarget !== video) return

    setIsLoading(false)
    playVideo(video)
  }

  const handleVideoWaiting = (event: SyntheticEvent) => {
    const video = getVideoByIndex(slideIndex)

    if (!video) return
    if (event.currentTarget !== video) return

    setIsLoading(true)
    video.pause()
  }

  const handleVideoClick = (event: MouseEvent<HTMLVideoElement>) => {
    playVideo(event.currentTarget)
  }

  const renderHeading = () => {
    return (
      <Navigation
        theme="transparent"
        right={
          <Button
            styling="flat"
            inline
            onClick={onClose}
            testId="onboarding-close-button"
            iconName={X24}
            iconColor="greyscale-level-1"
            aria={{
              'aria-label': translate('onboarding.a11y.actions.close'),
            }}
          />
        }
      />
    )
  }

  const renderVideo = (slideVideo: OnboardingSlideVideoModel, index: number) => {
    const hasPlayButton = hasAutoplayError && index === slideIndex

    return (
      // Disabling eslint: no voiceover or significant sound in video; captions not required
      <video
        data-testid={`onboarding-video-${index}`}
        ref={videoRefs[index]}
        muted
        playsInline
        loop
        className={hasPlayButton ? 'u-cursor-pointer' : undefined}
        poster={slideVideo.vertical.imageUrl}
        onCanPlayThrough={handleCanPlay}
        onWaiting={handleVideoWaiting}
        onClick={hasPlayButton ? handleVideoClick : undefined}
      >
        {slideVideo.vertical.formats.map(video => (
          <source src={video.url} key={video.format} type={`video/${video.format}`} />
        ))}
      </video>
    )
  }

  const renderSlide = (slide: OnboardingSlideModel, index: number) => {
    const slideVideo = isDarkMode ? slide.videoDark : slide.video

    const visualContainerClass = classNames('onboarding-modal__text-slide-visual-content', {
      'onboarding-modal__text-slide-video-content': slideVideo,
    })

    const textContainerClass = classNames({
      'u-ui-padding-horizontal-x-large': !breakpoints.phones,
      'u-ui-padding-horizontal-large': breakpoints.phones,
    })

    return (
      <div className="onboarding-modal__text-slide-content">
        <div className={textContainerClass}>
          <div className="u-tablets-up-only">
            <Spacer size="regular" />
          </div>
          <h2 className="onboarding-modal__slide-content-title">{slide.title}</h2>
          <div className="u-tablets-up-only">
            <Spacer size="x-large" />
          </div>
          <div className="u-phones-only">
            <Spacer size="large" />
          </div>
          <div className="u-ui-padding-right-x5-large">
            <Text as="span" text={slide.body} html />
          </div>
        </div>
        <div className={visualContainerClass}>
          <div className="u-flexbox u-justify-content-center">
            {slideVideo ? (
              renderVideo(slideVideo, index)
            ) : (
              <Image src={slide.imageUrl} size="x4-large" />
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderOverlay = () => {
    return (
      <div className="u-position-absolute u-fill-width u-fill-height u-flexbox u-zindex-bump u-no-pointer-events">
        <div className="u-flex-grow u-justify-content-center u-align-items-center u-flexbox">
          {isLoading && (
            <div data-testid="onboarding-modal-loader">
              <Loader size="x2-large" />
            </div>
          )}
          {!isLoading && hasAutoplayError && (
            <div data-testid="onboarding-modal-play-button">
              <Image src={asset('/play-button.svg')} size="x2-large" />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {renderHeading()}
      {renderOverlay()}
      <Carousel
        index={slideIndex}
        slides={banner.steps.map(renderSlide)}
        arrows={breakpoints.phones ? 'inside' : 'outside'}
        onSlideInteract={handleSlideInteract}
        styling="floating"
      />
    </>
  )
}

export default OnboardingTextVariant
