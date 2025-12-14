import { useCallback } from 'react'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'

import { abTestExposeEvent } from '../transfomers/events'
import { AbTestDto } from '../types/ab-test'
import { ShouldTrackExposeCallback } from '../types/exposee'

import useExposee from './useExposee'

const useTrackAbTestCallback = () => {
  const { track } = useTracking()
  const exposee = useExposee()

  return useCallback(
    (abTest: AbTestDto | undefined, shouldTrack: boolean | ShouldTrackExposeCallback = true) => {
      if (!abTest) return

      if (typeof shouldTrack === 'function') {
        if (!shouldTrack(abTest, exposee)) return
      } else if (!shouldTrack) return

      track(abTestExposeEvent({ ...exposee, ...abTest }))
    },
    [exposee, track],
  )
}

export default useTrackAbTestCallback
