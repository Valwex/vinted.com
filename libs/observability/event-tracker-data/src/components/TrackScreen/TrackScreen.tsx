'use client'

import { useEffect } from 'react'

import useTracking from '../../hooks/useTracking'

type Props = {
  screen: string
}

const TrackScreen = ({ screen }: Props) => {
  const { track } = useTracking()

  useEffect(() => {
    track({
      event: 'user.view_screen',
      extra: {
        screen,
      },
    })
  }, [screen, track])

  return null
}

export default TrackScreen
