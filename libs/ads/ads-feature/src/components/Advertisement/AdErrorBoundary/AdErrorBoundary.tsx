'use client'

import { ReactNode, useCallback } from 'react'

import { AdPage, crashAdComponentEvent } from '@marketplace-web/ads/ads-data'
import { ErrorBoundary } from '@marketplace-web/error-display/error-display-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'

type Props = {
  pageName: AdPage
  placementId: string
  children: ReactNode
}

const AdErrorBoundary = ({ children, pageName, placementId }: Props) => {
  const { track } = useTracking()

  const handleErrorBoundary = useCallback(
    (error: Error | null) => {
      track(
        crashAdComponentEvent({
          error: error ? error.toString() : '',
          placementId,
          pageName,
        }),
      )
    },
    [placementId, pageName, track],
  )

  return <ErrorBoundary onError={handleErrorBoundary}>{children}</ErrorBoundary>
}

export default AdErrorBoundary
