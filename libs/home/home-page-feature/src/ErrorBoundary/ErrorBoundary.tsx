'use client'

import { PropsWithChildren } from 'react'

import { ErrorBoundary } from '@marketplace-web/error-display/error-display-util'

import { incrementPageLoadFailureCounter, logHomeError } from '../utils/client-observability'
import useTabs from '../hooks/useTabs'
import ErrorState from '../common/ErrorState'

const HomeErrorBoundary = (props: PropsWithChildren<unknown>) => {
  const { currentTab } = useTabs()

  const trackBoundaryError = (boundaryError: Error | null) => {
    incrementPageLoadFailureCounter({ tab: currentTab.name, homepage_reason: 'boundary' })
    logHomeError(boundaryError)
  }

  return (
    <ErrorBoundary onError={trackBoundaryError} FallbackComponent={ErrorState}>
      {props.children}
    </ErrorBoundary>
  )
}

export default HomeErrorBoundary
