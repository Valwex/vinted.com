import { memoize } from 'lodash'

import { logError, logMessage } from '@marketplace-web/observability/logging-util'
import { clientSideMetrics } from '@marketplace-web/observability/client-metrics-util'

export const logBrazeMessage = (message: string, extra?: string) =>
  logMessage(message, { feature: 'braze', ...(extra && { extra }) })

export const logBrazeError = (error: Error, extra?: string) =>
  logError(error, { feature: 'braze', ...(extra && { extra }) })

export enum BrazeErrorType {
  InitializationFailure = 'initializationFailure',
  ChunkTimeout = 'chunkTimeout',
  ChunkError = 'chunkError',
  JWTEmpty = 'emptyJwt',
  JWTError = 'errorJWT',
  SDKKeyMissing = 'sdkKeyMissing',
  UserExternalIdMissing = 'userExternalIdMissing',
}

const isBrazeErrorType = (value: string) => {
  return Object.values(BrazeErrorType).includes(value as BrazeErrorType)
}

export const trackInitFailureMetrics = errorMessage => {
  let label = 'unknown'
  if (isBrazeErrorType(errorMessage)) {
    label = errorMessage
  } else if (errorMessage.includes('Loading chunk')) {
    if (errorMessage.includes('timeout')) {
      label = BrazeErrorType.ChunkTimeout
    } else {
      label = BrazeErrorType.ChunkError
    }
  } else if (errorMessage.includes('failedJwtRetrieval')) {
    label = BrazeErrorType.JWTError
  }

  if (label) clientSideMetrics.counter('braze_initialization_failure', { label }).increment()
}

/**
 * Will log a new `failureConfiguringSdk` error for each unique combination of failing parameters.
 */
export const logConfigurationFailure = memoize(
  (options: { brazeSdkKey: string | undefined; userExternalId: string | null | undefined }) => {
    const reason = (() => {
      if (!options.brazeSdkKey) return BrazeErrorType.SDKKeyMissing
      if (!options.userExternalId) return BrazeErrorType.UserExternalIdMissing

      return 'unknown' // in theory, should never happen
    })()

    logBrazeMessage('failureConfiguringSDK', `reason: ${reason}`)
    trackInitFailureMetrics(reason)
  },
  (...args) => JSON.stringify(args),
)

type BrazeCampaignProperty =
  | 'campaignName'
  | 'url'
  | 'message'
  | 'imageUrl'
  | 'buttons'
  | 'inAppStyle'
  | 'channel'
  | 'page or pinned'

/**
 * Will log a new `missingContentError` error for each unique card and its property that is failing.
 */
export const logMissingContentError = memoize(
  // `_id` is unused, but required in the memoize's resolver, so we get a unique key
  (
    _id: string,
    property: BrazeCampaignProperty,
    channel: string | undefined,
    campaignData: string | undefined,
  ) => {
    const channelMessage = channel ? `, channel: ${channel}` : ''

    logBrazeMessage(
      `missingContentError(property: ${property}${channelMessage})`,
      String(campaignData),
    )
  },
  (...args) => args.join(','),
)

/**
 * Will log a new `incorrectContentError` error for each unique card and its property that is failing.
 */
export const logIncorrectContentError = memoize(
  // `_id` is unused, but required in the memoize's resolver, so we get a unique key
  (
    _id: string,
    property: BrazeCampaignProperty,
    channel: string,
    campaignData: string | undefined,
  ) =>
    logBrazeMessage(
      `incorrectContentError(property: ${property}, channel: ${channel})`,
      String(campaignData),
    ),
  (...args) => args.join(','),
)

/**
 * Will log a new `contentParseError` error for each unique card that has faulty JSON
 */
export const logContentParseError = memoize(
  // `_id` is unused, but required in the memoize's resolver, so we get a unique key
  (_id: string, channel: string, trackingData: string | undefined) =>
    logBrazeMessage(`contentParseError(channel: ${channel})`, String(trackingData)),
  (...args) => args.join(','),
)

export const logSdkLoggingFailure = memoize(
  // `_id` is unused, but required in the memoize's resolver, so we get a unique key
  (
    _id: string | undefined,
    type: string,
    channel: string | undefined,
    campaignData: string | undefined,
  ) => {
    logBrazeMessage(
      `loggingFailure(type: ${type}, channel: ${String(channel)})`,
      String(campaignData),
    )
  },
  (...args) => JSON.stringify(args),
)
