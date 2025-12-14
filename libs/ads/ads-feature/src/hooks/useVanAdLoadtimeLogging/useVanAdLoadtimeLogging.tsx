import { useCallback } from 'react'

import {
  AdPage,
  AdPlatform,
  AdShape,
  VanAdLoggingType,
  systemTimingEvent,
} from '@marketplace-web/ads/ads-data'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { clientSideMetrics } from '@marketplace-web/observability/client-metrics-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'

import { MS_PER_SECOND } from '../../constants/date'

type Props = {
  countryCode: string
  shape: AdShape
  page: AdPage
  platform: AdPlatform
}

function useVanAdLoadtimeLogging({ countryCode, shape, page, platform }: Props) {
  const isAdsLoadTimeClientSideMetricsEnabled = useFeatureSwitch(
    'web_van_ads_load_time_client_side_metrics',
  )

  const { track } = useTracking()

  const onVanAdLoadTimeRequest = useCallback(
    (placementId: string, loadTime: number, adFilled: boolean) => {
      if (!isAdsLoadTimeClientSideMetricsEnabled) return

      const data = `Placement ID: ${placementId} Country code: ${countryCode} Ad filled: ${adFilled}`

      clientSideMetrics
        .histogram(VanAdLoggingType.AdLoad, {
          country_code: countryCode,
          shape,
          page,
          platform,
        })
        .observe(loadTime / MS_PER_SECOND)

      const extra = {
        section: VanAdLoggingType.AdLoad,
        duration: loadTime,
        completionState: 'succeeded',
        data,
      } as const

      track(systemTimingEvent(extra))
    },
    [isAdsLoadTimeClientSideMetricsEnabled, countryCode, shape, page, platform, track],
  )

  const onVanAdAssetLoadTimeRequest = useCallback(
    (placementId: string, loadTime: number) => {
      if (!isAdsLoadTimeClientSideMetricsEnabled) return

      const data = `Placement ID: ${placementId} Country code: ${countryCode}`

      clientSideMetrics
        .histogram(VanAdLoggingType.AdAssetLoad, {
          country_code: countryCode,
          shape,
          page,
          platform,
        })
        .observe(loadTime / MS_PER_SECOND)

      const extra = {
        section: VanAdLoggingType.AdAssetLoad,
        duration: loadTime,
        completionState: 'succeeded',
        data,
      } as const

      track(systemTimingEvent(extra))
    },

    [isAdsLoadTimeClientSideMetricsEnabled, countryCode, shape, page, platform, track],
  )

  return { onVanAdLoadTimeRequest, onVanAdAssetLoadTimeRequest }
}

export default useVanAdLoadtimeLogging
