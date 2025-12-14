'use client'

import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { noop } from 'lodash'

import { useIsConsentBannerLoaded, useConsent } from '@marketplace-web/consent/consent-feature'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useSystemConfiguration } from '@marketplace-web/shared/system-configuration-data'
import { useUserAgent } from '@marketplace-web/environment/request-context-data'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { AdPlatform, AdShape, RtbPlacementConfigModel } from '@marketplace-web/ads/ads-data'

import useAdLoadtimeLogging from '../../../hooks/useAdLoadtimeLogging'
import useRequestedAdLogging from '../../../hooks/useRequestedAdLogging'
import { getAdPlacementId } from '../utils'
import AdsContext from '../../../containers/AdsProvider/AdsContext'
import useAdRenderedCheck from '../../../hooks/useAdRenderedCheck'

type Props = {
  id: string
  config: RtbPlacementConfigModel
  isManuallyRendered?: boolean
  isManuallyRefreshed?: boolean
  onAdRender?: (isAdVisible: boolean) => void
  iabCategories?: Array<string> | null
}

const RtbAdvertisement = ({
  id,
  config,
  isManuallyRendered = false,
  isManuallyRefreshed = false,
  onAdRender = noop,
  iabCategories,
}: Props) => {
  const { registerPlacement, unregisterPlacement, getAdsPlatform } = useContext(AdsContext)

  const placementRegisteredRef = useRef(false)
  const [adDivElement, setAdDivElement] = useState<HTMLDivElement | null>(null)

  const refreshOrder = useRef(0)

  const translate = useTranslate('advertisements')
  const { track } = useTracking()
  const { userCountry: countryCode } = useSystemConfiguration() || {}
  const userAgent = useUserAgent()
  const isAdRevenueTrackingEnabled = useFeatureSwitch('web_received_ad_revenue_tracking')

  const { isCookieConsentVersion } = useConsent()

  const isRefreshEnabled = useMemo(
    () => config.platform === AdPlatform.Web || config.shape === AdShape.Leaderboard,
    [config.shape, config.platform],
  )

  const isConsentBannerLoaded = useIsConsentBannerLoaded()
  const placementId = getAdPlacementId(config)
  const { onRequest: onAdLoadtimeRequest, onLoad: onAdLoadtimeLoad } = useAdLoadtimeLogging({
    shape: config.shape,
    page: config.page,
    platform: config.platform,
    countryCode: config.countryCode,
  })
  const { onRequest: onRequestedAdRequest } = useRequestedAdLogging({
    placementId,
  })

  const handleOnPlacementLoad = useCallback(
    (event: googletag.events.SlotOnloadEvent) => {
      if (!event.slot) return

      onAdLoadtimeLoad()
    },
    [onAdLoadtimeLoad],
  )

  const handleOnPlacementRequest = useCallback(() => {
    onAdLoadtimeRequest()
    onRequestedAdRequest(refreshOrder.current)

    refreshOrder.current += 1
  }, [onAdLoadtimeRequest, onRequestedAdRequest])

  const trackingContext = useMemo(
    () =>
      isAdRevenueTrackingEnabled
        ? {
            track,
            countryCode,
            isMobileWeb: getAdsPlatform(userAgent) === AdPlatform.Mobile,
          }
        : undefined,
    [isAdRevenueTrackingEnabled, track, countryCode, getAdsPlatform, userAgent],
  )

  const handleRegisterPlacement = useCallback(() => {
    if (placementRegisteredRef.current) return

    registerPlacement({
      placementConfig: config,
      id,
      onPlacementLoad: handleOnPlacementLoad,
      onPlacementRequest: handleOnPlacementRequest,
      isRefreshEnabled,
      isManuallyRendered,
      isManuallyRefreshed,
      iframeTitle: translate('advertisement'),
      iabCategories,
      trackingContext,
    })

    placementRegisteredRef.current = true
  }, [
    config,
    id,
    isManuallyRendered,
    isManuallyRefreshed,
    isRefreshEnabled,
    translate,
    handleOnPlacementLoad,
    handleOnPlacementRequest,
    registerPlacement,
    iabCategories,
    trackingContext,
  ])

  const handleAdRender = useCallback(
    (isAdVisible: boolean) => {
      onAdRender(isAdVisible)
    },
    [onAdRender],
  )

  useAdRenderedCheck({ targetElement: adDivElement, onAdRender: handleAdRender })

  useEffect(() => {
    if (!adDivElement) return

    const isConsentValuesLoaded = isCookieConsentVersion && isConsentBannerLoaded

    if (isConsentValuesLoaded || !isCookieConsentVersion) {
      handleRegisterPlacement()
    }
  }, [adDivElement, handleRegisterPlacement, isCookieConsentVersion, isConsentBannerLoaded])

  useEffect(() => {
    return () => {
      if (!placementRegisteredRef.current) return

      unregisterPlacement(id)
    }
  }, [id, unregisterPlacement])

  return <div data-testid="main-slot" id={id} ref={setAdDivElement} />
}

export default RtbAdvertisement
