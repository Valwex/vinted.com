'use client'

import { noop } from 'lodash'
import { Component, ComponentType, ErrorInfo, ReactNode } from 'react'

import { logError } from '@marketplace-web/observability/logging-util'
import { clientSideMetrics } from '@marketplace-web/observability/client-metrics-util'

import { FallbackComponentProps } from '../../types/error'

type Props = {
  FallbackComponent?: ComponentType<FallbackComponentProps>
  preventLog: boolean
  pathname?: string
  shouldIncrementCounter?: boolean
  children: ReactNode
  onError: (error: Error | null) => void
}

type State = {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

const initialState: Readonly<State> = {
  hasError: false,
  error: null,
  errorInfo: null,
}

class ErrorBoundary extends Component<Props, State> {
  static defaultProps = {
    preventLog: false,
    onError: noop,
  }

  state = { ...initialState }

  static getDerivedStateFromError(error): { hasError: boolean; error: Error } {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, preventLog, pathname, shouldIncrementCounter } = this.props

    if (errorInfo.componentStack === this.state.errorInfo?.componentStack) return

    this.setState({ errorInfo })

    if (pathname && shouldIncrementCounter)
      clientSideMetrics.counter('error_boundary_hit', { page: pathname }).increment()

    if (!preventLog) {
      logError(error)
    }

    onError(error)
  }

  handleRetry = () => this.setState({ ...initialState })

  render() {
    const { hasError, error, errorInfo } = this.state
    const { FallbackComponent, children } = this.props

    if (hasError) {
      if (!FallbackComponent) return null

      return (
        <FallbackComponent error={error} errorInfo={errorInfo} handleRetry={this.handleRetry} />
      )
    }

    return children
  }
}

export default ErrorBoundary
