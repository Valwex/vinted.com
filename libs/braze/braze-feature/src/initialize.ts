import { clientSideMetrics } from '@marketplace-web/observability/client-metrics-util'

import { InitializeBrazeOptions, InitializeBrazeReturnType } from './unsafe-initialize'
import { FALLBACK_STORES } from './utils/store'

export const FALLBACK_INITIALIZE_RETURN_VALUE: Awaited<InitializeBrazeReturnType> = {
  initialized: false,
  stores: FALLBACK_STORES,
  providers: null,
}

export const initializeBraze = async (
  options: InitializeBrazeOptions,
  onError?: (error: unknown) => void,
): InitializeBrazeReturnType => {
  try {
    const { unsafeInitializeBraze } = await import('./unsafe-initialize')
    clientSideMetrics.counter('braze_initialization').increment()

    return await unsafeInitializeBraze(options)
  } catch (error: unknown) {
    onError?.(error)

    return FALLBACK_INITIALIZE_RETURN_VALUE
  }
}
