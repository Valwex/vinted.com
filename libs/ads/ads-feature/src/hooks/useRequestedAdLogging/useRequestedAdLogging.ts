import { useCallback } from 'react'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useSession } from '@marketplace-web/shared/session-data'
import { useSystemConfiguration } from '@marketplace-web/shared/system-configuration-data'
import { requestedAdEvent } from '@marketplace-web/ads/ads-data'

type Props = {
  placementId: string
  correlationId?: string
}

function useRequestedAdLogging({ placementId, correlationId }: Props) {
  const { screen } = useSession()
  const { userCountry: countryCode } = useSystemConfiguration() || {}

  const isRequestedAdLoggingEnabled = useFeatureSwitch('web_ads_requested_ad_logging')

  const { track } = useTracking()

  const onRequest = useCallback(
    (refreshOrder?: number) => {
      if (!isRequestedAdLoggingEnabled || !countryCode) return

      track(
        requestedAdEvent({
          placementId,
          screen,
          countryCode,
          correlationId,
          refreshOrder,
        }),
      )
    },
    [isRequestedAdLoggingEnabled, countryCode, placementId, screen, correlationId, track],
  )

  return { onRequest }
}

export default useRequestedAdLogging
