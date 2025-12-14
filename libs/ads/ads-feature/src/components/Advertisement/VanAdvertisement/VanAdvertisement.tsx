'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { noop } from 'lodash'

import { VanFallbackReason, VanPlacementConfigModel } from '@marketplace-web/ads/ads-data'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'

import { getVanCreative } from './utils'
import { getAdPlacementId } from '../utils'
import useRequestedAdLogging from '../../../hooks/useRequestedAdLogging'
import useVanAdFallbackTracking from '../../../hooks/useVanAdFallbackTracking'
import useVanAdLoadtimeLogging from '../../../hooks/useVanAdLoadtimeLogging'

type Props = {
  id: string
  config: VanPlacementConfigModel
  onAdError: () => void
  onAdRender?: (isAdVisible: boolean) => void
}

const VanAdvertisement = ({ id, config, onAdRender = noop, onAdError }: Props) => {
  const [iframeContent, setIframeContent] = useState<string>()
  const isRequestedRef = useRef(false)
  const { onRequest: onRequestedAdRequest } = useRequestedAdLogging({
    placementId: getAdPlacementId(config),
  })

  const { onTrackFallback } = useVanAdFallbackTracking()
  const { onVanAdLoadTimeRequest, onVanAdAssetLoadTimeRequest } = useVanAdLoadtimeLogging({
    countryCode: config.countryCode,
    shape: config.shape,
    page: config.page,
    platform: config.platform,
  })

  const shouldForceVanAdError = useFeatureSwitch('web_van_ad_force_error')
  const shouldAllowSendingDetailedErrors = useFeatureSwitch('web_van_allow_detailed_errors')

  const fetchCreative = useCallback(async () => {
    isRequestedRef.current = true

    onVanAdLoadTimeRequest(config.placementId, config.fetchTime, Boolean(config.creative))

    onRequestedAdRequest()

    if (!config?.creative) {
      onTrackFallback(config.placementId, VanFallbackReason.NoFill)

      onAdRender(false)
      onAdError()

      return
    }

    const fetchStartTime = Date.now()

    const { response, text } = await getVanCreative(
      config.creative.contentLink,
      shouldForceVanAdError,
    )

    if (response.ok && response.status === 200 && text) {
      const fetchEndTime = Date.now()
      const fetchTime = fetchEndTime - fetchStartTime

      onVanAdAssetLoadTimeRequest(config.placementId, fetchTime)
      setIframeContent(text)
      onAdRender(true)
    } else {
      const reasonDetails = `response status: ${response.status} data: ${text}`

      if (shouldAllowSendingDetailedErrors) {
        onTrackFallback(config.placementId, VanFallbackReason.NetworkError, reasonDetails)
      } else {
        onTrackFallback(config.placementId, VanFallbackReason.NetworkError)
      }

      onAdRender(false)
      onAdError()
    }
  }, [
    config,
    onRequestedAdRequest,
    onAdRender,
    onAdError,
    onTrackFallback,
    onVanAdLoadTimeRequest,
    onVanAdAssetLoadTimeRequest,
    shouldForceVanAdError,
    shouldAllowSendingDetailedErrors,
  ])

  useEffect(() => {
    if (iframeContent || isRequestedRef.current) return

    fetchCreative()
  }, [fetchCreative, iframeContent])

  if (!iframeContent || !config.creative) {
    return null
  }

  return (
    <div data-testid="van-slot" id={id}>
      <iframe
        title={`van-${config.id}-${config.creative.id}-iframe`}
        width={config.creative.size.width}
        height={config.creative.size.height}
        style={{ border: 'none' }}
        srcDoc={iframeContent}
      />
    </div>
  )
}

export default VanAdvertisement
