import { clientSideMetrics } from '@marketplace-web/observability/client-metrics-util'

const REQUEST_BLOCKED_BY_DATADOME_METRIC = 'frontend_request_blocked_by_datadome'
const DATADOME_CAPTCHA_FAILED_TO_RENDER_METRIC = 'frontend_datadome_captcha_failed_to_render'
const REQUEST_HANDLED_BY_DATADOME_METRIC = 'frontend_request_handled_by_datadome'
const DATA_DOME_RESPONSE_DISPLAYED_DURATION_METRIC =
  'frontend_data_dome_response_displayed_duration'
const DATA_DOME_RESPONSE_ERROR_DURATION_METRIC = 'frontend_data_dome_response_error_duration'
const DATA_DOME_INITIALIZATION_DURATION_METRIC = 'frontend_data_dome_initialization_duration'

export const incrementDataDomeRequestBlocked = ({ url }: { url: string }) => {
  clientSideMetrics.counter(REQUEST_BLOCKED_BY_DATADOME_METRIC, { url }).increment()
}

export const incrementDataDomeScriptMissing = ({
  reason,
  url,
}: {
  reason: string
  url: string
}) => {
  clientSideMetrics.counter(DATADOME_CAPTCHA_FAILED_TO_RENDER_METRIC, { reason, url }).increment()
}

export const incrementDataDomeRequestHandled = ({ event, url }: { event: string; url: string }) => {
  clientSideMetrics.counter(REQUEST_HANDLED_BY_DATADOME_METRIC, { event, url }).increment()
}

export const dataDomeResponseDisplayedDurationTimer = () =>
  clientSideMetrics.histogram(DATA_DOME_RESPONSE_DISPLAYED_DURATION_METRIC).startTimer()

export const dataDomeResponseErrorDurationTimer = () =>
  clientSideMetrics.histogram(DATA_DOME_RESPONSE_ERROR_DURATION_METRIC).startTimer()

export const dataDomeInitializationTimer = () =>
  clientSideMetrics.histogram(DATA_DOME_INITIALIZATION_DURATION_METRIC).startTimer()
