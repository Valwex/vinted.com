import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useSession } from '@marketplace-web/shared/session-data'
import { vanFallbackEvent, VanFallbackReason } from '@marketplace-web/ads/ads-data'

function useVanAdFallbackTracking() {
  const { screen } = useSession()

  const { track } = useTracking()

  const onTrackFallback = (
    placementId: string,
    reason: VanFallbackReason,
    reasonDetails?: string,
  ) => {
    track(
      vanFallbackEvent({
        placementId,
        screen,
        reason,
        reasonDetails,
      }),
    )
  }

  return { onTrackFallback }
}

export default useVanAdFallbackTracking
