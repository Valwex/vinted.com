import { useRef } from 'react'

import { AdPage, AdPlatform, AdShape, systemTimingEvent } from '@marketplace-web/ads/ads-data'

import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { clientSideMetrics } from '@marketplace-web/observability/client-metrics-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'

import { MS_PER_SECOND } from '../../constants/date'

type Props = {
  countryCode?: string
  shape: AdShape | 'Rokt'
  page: AdPage
  platform: AdPlatform
}

function useAdLoadtimeLogging({ countryCode, shape, page, platform }: Props) {
  const isAdsLoadTimeClientSideMetricsEnabled = useFeatureSwitch(
    'web_ads_load_time_client_side_metrics',
  )
  const { track } = useTracking()

  const adRequestTimestampRef = useRef(0)

  const onRequest = () => {
    if (!isAdsLoadTimeClientSideMetricsEnabled) return

    adRequestTimestampRef.current = Date.now()
  }

  const onLoad = () => {
    if (!adRequestTimestampRef.current || !isAdsLoadTimeClientSideMetricsEnabled || !countryCode)
      return

    const adLoadTime = Date.now() - adRequestTimestampRef.current

    const data = `Country code: ${countryCode}, Shape: ${shape}, Page: ${page}, Platform: ${platform}`

    track(
      systemTimingEvent({
        section: 'ad_load',
        duration: adLoadTime,
        completionState: 'succeeded',
        data,
      }),
    )

    clientSideMetrics
      .histogram('ad_load', {
        country_code: countryCode,
        shape,
        page,
        platform,
      })
      .observe(adLoadTime / MS_PER_SECOND)
  }

  return { onRequest, onLoad }
}

export default useAdLoadtimeLogging
