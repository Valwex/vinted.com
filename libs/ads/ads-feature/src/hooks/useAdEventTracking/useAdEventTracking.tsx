'use client'

import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useSystemConfiguration } from '@marketplace-web/shared/system-configuration-data'
import {
  receivedAdEvent,
  viewAdEvent,
  AdKind,
  AdPlatform,
  AdsPlacementModel,
  trackVanRealTimeImpression,
  AdPage,
} from '@marketplace-web/ads/ads-data'

import { getAdPlacementId } from '../../components/Advertisement/utils'
import { withExponentialRetry } from '../../utils/withExponentialRetry'

type Props = {
  isAdRendered: boolean
  placementConfig: AdsPlacementModel
  customPlacementId?: string
  shouldTrack?: boolean
  shouldTrackReceivedAd?: boolean
  shouldTrackViewAd?: boolean
  onReceivedAdTracked?: () => void
  onViewAdTracked?: () => void
}

function getCampaignId(placementConfig: AdsPlacementModel): string | undefined {
  if (placementConfig.kind === AdKind.Van) {
    return placementConfig.id ?? undefined
  }

  return undefined
}

const getVanImpressionScreen = (placementConfig: AdsPlacementModel) => {
  if (placementConfig.page === AdPage.Messages) {
    return 'message_list'
  }

  return placementConfig.page
}

const useAdEventTracking = ({
  isAdRendered,
  placementConfig,
  customPlacementId,
  shouldTrack = true,
  shouldTrackReceivedAd,
  shouldTrackViewAd,
  onReceivedAdTracked,
  onViewAdTracked,
}: Props) => {
  const viewableImpressionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isViewableImpressionTracked = useRef(false)
  const isImpressionTrackingEnabled = useFeatureSwitch('web_ads_impression_tracking')
  const isVanImpressionTrackingEnabled = useFeatureSwitch('van_real_time_impressions_enabled')
  const { userCountry: countryCode } = useSystemConfiguration() || {}

  const { track } = useTracking()

  const placementId = customPlacementId ?? getAdPlacementId(placementConfig)

  const { ref: viewableImpressionRef } = useInView({
    threshold: [0, 0.5],
    root: null,
    rootMargin: '0px',
    onChange: (_, entry) => {
      // intersectionRatio of 0.5 represents 50% of the ad being visible
      // and viewable impression (viewAdEvent) has to be tracked after
      // 50% of the ad being visible for at least 1 second

      if (viewableImpressionTimeoutRef.current) {
        clearTimeout(viewableImpressionTimeoutRef.current)
        viewableImpressionTimeoutRef.current = null
      }

      const canTrackViewAd = shouldTrackViewAd === undefined ? shouldTrack : shouldTrackViewAd

      if (
        isViewableImpressionTracked.current ||
        !canTrackViewAd ||
        !countryCode ||
        !entry.isIntersecting ||
        entry.intersectionRatio < 0.5
      )
        return

      viewableImpressionTimeoutRef.current = setTimeout(() => {
        isViewableImpressionTracked.current = true

        const campaignId = getCampaignId(placementConfig)

        track(
          viewAdEvent({
            placementId,
            isMobileWeb: placementConfig.platform === AdPlatform.Mobile,
            countryCode,
            creativeId:
              placementConfig.kind === AdKind.Van ? placementConfig.creative?.id : undefined,
            campaignId,
            correlationId: placementConfig.correlationId,
          }),
        )

        onViewAdTracked?.()
      }, 1000)
    },
    skip: !isImpressionTrackingEnabled || !isAdRendered,
  })

  const { ref: impressionRef } = useInView({
    threshold: [0.0, 0.001],
    root: null,
    rootMargin: '0px',
    onChange: (_, entry) => {
      // intersectionRatio of 0.001 represents 1px of the ad being visible
      // and to match the logic of mobile platforms impression (receivedAdEvent)
      // should be tracked only when user is exposed to at least 1px of the ad

      const canTrackReceivedAd =
        shouldTrackReceivedAd === undefined ? shouldTrack : shouldTrackReceivedAd

      if (
        !canTrackReceivedAd ||
        !countryCode ||
        !entry.isIntersecting ||
        entry.intersectionRatio < 0.001
      )
        return

      const campaignId = getCampaignId(placementConfig)

      track(
        receivedAdEvent({
          placementId,
          isMobileWeb: placementConfig.platform === AdPlatform.Mobile,
          countryCode,
          creativeId:
            placementConfig.kind === AdKind.Van ? placementConfig.creative?.id : undefined,
          campaignId: getCampaignId(placementConfig),
          correlationId: placementConfig.correlationId,
          vanSkip: placementConfig.kind === AdKind.Van ? isVanImpressionTrackingEnabled : undefined,
        }),
      )

      if (
        placementConfig.kind === AdKind.Van &&
        isVanImpressionTrackingEnabled &&
        campaignId &&
        placementConfig.priceReference &&
        placementConfig.correlationId
      ) {
        withExponentialRetry(trackVanRealTimeImpression)({
          screen: getVanImpressionScreen(placementConfig),
          placementId,
          campaignId,
          countryCode,
          priceReference: placementConfig.priceReference,
          correlationId: placementConfig.correlationId,
        })
      }

      onReceivedAdTracked?.()
    },
    skip: !isImpressionTrackingEnabled || !isAdRendered,
    triggerOnce: true,
  })

  useEffect(() => {
    if (isAdRendered) return

    if (viewableImpressionTimeoutRef.current) {
      clearTimeout(viewableImpressionTimeoutRef.current)
      viewableImpressionTimeoutRef.current = null
    }

    isViewableImpressionTracked.current = false
  }, [isAdRendered])

  return {
    impressionRef,
    viewableImpressionRef,
  }
}

export default useAdEventTracking
