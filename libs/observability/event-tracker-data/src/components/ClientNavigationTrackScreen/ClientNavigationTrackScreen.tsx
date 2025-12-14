'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

import { getPageConfiguration } from '@marketplace-web/environment/page-configuration-util'

import useTracking from '../../hooks/useTracking'

const ClientNavigationTrackScreen = () => {
  const pathname = usePathname()
  const { track } = useTracking()

  const lastTrackedScreenRef = useRef<string | null>(null)

  useEffect(() => {
    const currentPathname = pathname || '/'
    const { screen } = getPageConfiguration(currentPathname)

    if (!screen) return

    if (lastTrackedScreenRef.current === null) {
      lastTrackedScreenRef.current = screen

      return
    }
    if (lastTrackedScreenRef.current === screen) return

    track({
      event: 'user.view_screen',
      extra: { screen },
    })

    lastTrackedScreenRef.current = screen
  }, [pathname, track])

  return null
}

export default ClientNavigationTrackScreen
