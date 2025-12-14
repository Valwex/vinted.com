'use client'

import { useEffect } from 'react'

import { GoogleTagManagerEvent } from '../../constants'
import useGoogleTagManagerTrack from '../../hooks/useGoogleTagManagerTrack'

const GoogleAnalyticsTracker = () => {
  const { googleAnalyticsTrack } = useGoogleTagManagerTrack()

  useEffect(() => {
    googleAnalyticsTrack({
      event: GoogleTagManagerEvent.pageLoad,
    })
  }, [googleAnalyticsTrack])

  return null
}

export default GoogleAnalyticsTracker
