'use client'

import { useEffect } from 'react'

import useTrackAbTestCallback from './useTrackAbTestCallback'

const useTrackAbTest = (
  ...[abTest, shouldTrack]: Parameters<ReturnType<typeof useTrackAbTestCallback>>
) => {
  const track = useTrackAbTestCallback()

  useEffect(() => {
    track(abTest, shouldTrack)
  }, [abTest, shouldTrack, track])
}

export default useTrackAbTest
