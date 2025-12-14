import { clientSideMetrics } from '@marketplace-web/observability/client-metrics-util'

const PRICE_BREAKDOWN_LOAD_DURATION = 'frontend_price_breakdown_load_duration_seconds'
const BUCKETS = [0.05, 0.075, 0.1, 0.25, 0.5, 0.75, 1.0, 2.5, 5.0, 7.5, 10.0]
const MS_PER_SECOND = 1000

export type FlowType = 'item' | 'transaction'

export type ObserveEscrowFeesLoadTime = {
  isSuccess: boolean
  flowType: FlowType
  loadTime: number
}

export const observeEscrowFeesLoadTime = ({
  isSuccess,
  flowType,
  loadTime,
}: ObserveEscrowFeesLoadTime) => {
  clientSideMetrics
    .histogram(
      PRICE_BREAKDOWN_LOAD_DURATION,
      { is_success: isSuccess, flow_type: flowType },
      BUCKETS,
    )
    .observe(loadTime / MS_PER_SECOND)
}
