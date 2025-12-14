'use client'

import { useEffect, useState } from 'react'

import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { removeParamsFromQuery, urlWithParams } from '@marketplace-web/browser/url-util'
import {
  OnboardingModalModel,
  SingleStepOnboardingModalModel,
  clickEvent,
  viewEvent,
  viewScreenEvent,
} from '@marketplace-web/banners/banners-data'

import useBanners from '../../../hooks/useBanners'

type Props = {
  banner: OnboardingModalModel
  singleStepBanner?: SingleStepOnboardingModalModel
}

const useOnboarding = ({ banner, singleStepBanner }: Props) => {
  const { onBannerSeen, setSeenBannerTypeToCookies } = useBanners()
  const { track } = useTracking()
  const [isOpen, setIsOpen] = useState(true)
  const [slide, setSlide] = useState(0)
  const { replaceHistoryState, relativeUrl, urlQuery, searchParams } = useBrowserNavigation()

  const isSingleStepModalEnabled = singleStepBanner?.abTest.group.toLowerCase() === 'on'
  const slideName = banner.steps[slide]?.name

  useEffect(() => {
    if (isSingleStepModalEnabled) {
      onBannerSeen({ type: 'single_step_onboarding_modal', name: banner.name })
      setSeenBannerTypeToCookies('onboarding_modal')

      return
    }

    onBannerSeen({ type: banner.type, name: banner.name })
  }, [isSingleStepModalEnabled, setSeenBannerTypeToCookies, banner.name, banner.type, onBannerSeen])

  useEffect(() => {
    track(viewScreenEvent({ screen: banner.name }))
  }, [banner.name, track])

  useEffect(() => {
    if (!isOpen) return
    if (searchParams.onboarding_modal_status) return

    const updatedUrl = urlWithParams(relativeUrl, {
      ...searchParams,
      onboarding_modal_status: 'shown',
    })

    replaceHistoryState(updatedUrl)
  }, [isOpen, replaceHistoryState, relativeUrl, searchParams])

  useEffect(() => {
    if (isSingleStepModalEnabled) return
    if (!slideName) return

    track(
      viewEvent({
        screen: banner.name,
        target: 'onboarding_modal_card',
        targetDetails: slideName,
      }),
    )
  }, [banner.name, slideName, track, isSingleStepModalEnabled])

  const handleClose = () => {
    const urlWithoutParam = removeParamsFromQuery(relativeUrl, urlQuery, [
      'onboarding_modal_status',
    ])

    replaceHistoryState(urlWithoutParam)
    setIsOpen(false)
  }

  const handleModalClose = () => {
    if (isSingleStepModalEnabled) {
      track(
        clickEvent({
          screen: banner.name,
          target: 'close_screen',
        }),
      )
    } else {
      track(
        clickEvent({
          screen: banner.name,
          target: 'close_screen',
          targetDetails: slideName,
        }),
      )
    }

    handleClose()
  }

  const handlePrimaryClick = () => {
    if (isSingleStepModalEnabled) {
      track(
        clickEvent({
          screen: banner.name,
          target: 'upload_item',
        }),
      )

      return
    }

    track(
      clickEvent({
        screen: banner.name,
        target: 'upload_item',
        targetDetails: slideName,
      }),
    )
  }

  return {
    isOpen,
    isSingleStepModalEnabled,
    onModalClose: handleModalClose,
    onPrimaryClick: handlePrimaryClick,
    setSlide,
  }
}

export default useOnboarding
