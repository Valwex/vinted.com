'use client'

import { ReactNode, useEffect } from 'react'

import { ErrorBoundary } from '@marketplace-web/error-display/error-display-util'
import { ComponentError } from '@marketplace-web/error-display/error-display-feature'
import { useAuthenticationContext } from '@marketplace-web/auth-flow/auth-context-feature'

import { incrementPageLoadInitiatedCounter, handlePageLoadFailure } from '../../observability/utils'
import { ComponentLocation, ErrorReason } from '../../observability/constants'

type Props = {
  children: ReactNode
  componentLocation: ComponentLocation
}

const AuthenticationErrorBoundary = ({ children, componentLocation }: Props) => {
  const { authView } = useAuthenticationContext()

  useEffect(() => {
    incrementPageLoadInitiatedCounter({ authView, componentLocation })
  }, [authView, componentLocation])

  const handleError = (error: Error | null) => {
    handlePageLoadFailure({
      error,
      authView,
      componentLocation,
      reason: ErrorReason.ErrorBoundary,
    })
  }

  return (
    <ErrorBoundary onError={handleError} FallbackComponent={ComponentError} preventLog>
      {children}
    </ErrorBoundary>
  )
}

export default AuthenticationErrorBoundary
