import { isNumber } from 'lodash'

import {
  AdBlockCheckEventArgs,
  AdBlockCheckEventExtra,
  AdReportEventArgs,
  AdReportEventExtra,
  ClickAdEventArgs,
  ClickAdEventExtra,
  CrashAdComponentEventArgs,
  ReceivedAdEventArgs,
  ReceivedAdEventExtra,
  ReceivedAdRevenueEventArgs,
  ReceivedAdRevenueEventExtra,
  RequestedAdEventArgs,
  RequestedAdEventExtra,
  VanFallbackEventArgs,
  VanFallbackEventExtra,
  ViewAdEventArgs,
  ViewAdEventExtra,
  VisibleDurationEventExtra,
} from '../types/events'

// Source: https://github.com/vinted/dwh-schema-registry/blob/5387d2ce7b44ee93711a15dfb97c60a4d984f22c/avro/events/common/shared/user.avdl#L25
type UserTarget = 'cookie_settings'

// https://github.com/vinted/dwh-schema-registry/blob/master/avro/events/common/shared/common.avdl#L34
type ContentSource = 'feed_ad'

// Source: https://github.com/vinted/dwh-schema-registry/blob/e39aec4da4a00a8e70a8839adfbc164d04d10b91/avro/events/common/shared/common.avdl#L34
type ContentTypes = 'ad'

export const requestedAdEvent = (args: RequestedAdEventArgs) => {
  const { screen, placementId, countryCode, correlationId, refreshOrder } = args

  const extra: RequestedAdEventExtra = {
    placement_id: placementId,
    country_code: countryCode.toUpperCase(),
    screen,
    correlation_id: correlationId,
    refresh_order: refreshOrder,
  }

  return {
    event: 'system.requested_ad',
    extra,
  }
}

export const receivedAdEvent = (args: ReceivedAdEventArgs) => {
  const { placementId, isMobileWeb, countryCode, creativeId, campaignId, correlationId, vanSkip } =
    args

  const extra: ReceivedAdEventExtra = {
    placement_id: placementId,
    is_mobile_web: isMobileWeb,
    creative_id: creativeId,
    campaign_id: campaignId,
    country_code: countryCode.toUpperCase(),
    correlation_id: correlationId,
    van_skip: vanSkip,
  }

  return {
    event: 'user.received_ad',
    extra,
  }
}

export const receivedAdRevenueEvent = (args: ReceivedAdRevenueEventArgs) => {
  const { placementId, isMobileWeb, countryCode, cpm, currency } = args

  const extra: ReceivedAdRevenueEventExtra = {
    placement_id: placementId,
    is_mobile_web: isMobileWeb,
    country_code: countryCode.toUpperCase(),
    currency,
    cpm,
  }

  return {
    event: 'system.web_received_ad_revenue',
    extra,
  }
}

export const viewAdEvent = (args: ViewAdEventArgs) => {
  const { placementId, isMobileWeb, creativeId, campaignId, countryCode, correlationId } = args

  const extra: ViewAdEventExtra = {
    placement_id: placementId,
    is_mobile_web: isMobileWeb,
    creative_id: creativeId,
    campaign_id: campaignId,
    country_code: countryCode.toUpperCase(),
    correlation_id: correlationId,
  }

  return {
    event: 'user.view_ad',
    extra,
  }
}

export const clickAdEvent = (args: ClickAdEventArgs) => {
  const { placementId, target, isMobileWeb, countryCode, creativeId, campaignId, correlationId } =
    args

  const extra: ClickAdEventExtra = {
    placement_id: placementId,
    target,
    is_mobile_web: isMobileWeb,
    country_code: countryCode.toUpperCase(),
    creative_id: creativeId,
    campaign_id: campaignId,
    correlation_id: correlationId,
  }

  return {
    event: 'ad.click',
    extra,
  }
}

export const crashAdComponentEvent = (args: CrashAdComponentEventArgs) => {
  const { error, pageName, placementId } = args

  return {
    event: 'system.ad_component_crash',
    extra: { error, screen_name: pageName, placement_id: placementId },
  }
}

export const adBlockCheckEvent = (args: AdBlockCheckEventArgs) => {
  const { isMobileWeb, isAdBlockerUsed } = args

  const extra: AdBlockCheckEventExtra = {
    is_mobile_web: isMobileWeb,
    is_adblock_used: isAdBlockerUsed,
  }

  return {
    event: 'user.adblock_check',
    extra,
  }
}

export const vanFallbackEvent = (args: VanFallbackEventArgs) => {
  const { screen, placementId, reason, reasonDetails } = args

  const extra: VanFallbackEventExtra = {
    placement_id: placementId,
    reason,
    reason_details: reasonDetails,
    screen,
  }

  return {
    event: 'system.van_fallback',
    extra,
  }
}

type ClickEventArgs = {
  target: UserTarget
  screen?: string | null
  targetDetails?: string | null
  path?: string | null
  env?: string | null
}

type ClickEventExtra = {
  target: UserTarget
  screen?: string
  target_details?: string
  path?: string | null
  env?: string | null
}

export const clickEvent = (args: ClickEventArgs) => {
  const { target, screen, targetDetails, env, path } = args
  const extra: ClickEventExtra = { target }

  if (screen) extra.screen = screen

  if (targetDetails) extra.target_details = targetDetails

  if (env) extra.env = env

  if (path) extra.path = path

  return {
    event: 'user.click',
    extra,
  }
}

type ImpressionEventArgs = {
  id: number | string
  contentType: ContentTypes
  contentSource: ContentSource
  position: number
  itemDistance?: number | null
  itemOwnerId?: string | number | null
  searchScore?: string
  searchSignals?: Array<string> | null
  searchCorrelationId?: string
  searchSessionId?: string | null
  globalSearchSessionId?: string | null
  globalCatalogBrowseSessionId?: string | null
  homepageSessionId?: string
  uploadSessionId?: string
  screen?: string
  metadata?: Record<string, Array<string>>
}

type ImpressionEventExtra = {
  content_type: ContentTypes
  content_source: ContentSource
  id: number | string
  position: number
  item_owner_id?: string | number
  search_score?: string
  search_signals?: Array<string>
  search_correlation_id?: string
  search_session_id?: string
  global_search_session_id?: string | null
  global_catalog_browse_session_id?: string | null
  buyer_item_distance_km?: number
  homepage_session_id?: string
  upload_session_id?: string
  screen?: string
  metadata?: Record<string, Array<string>>
}

export const impressionEvent = (args: ImpressionEventArgs) => {
  const {
    id,
    contentType,
    contentSource,
    itemDistance,
    itemOwnerId,
    position,
    searchScore,
    searchSignals,
    searchCorrelationId,
    searchSessionId,
    globalSearchSessionId,
    globalCatalogBrowseSessionId,
    homepageSessionId,
    uploadSessionId,
    screen,
    metadata,
  } = args

  const extra: ImpressionEventExtra = {
    id,
    position,
    content_type: contentType,
    content_source: contentSource,
  }

  if (itemOwnerId) extra.item_owner_id = itemOwnerId
  if (searchScore) extra.search_score = JSON.stringify(searchScore)
  if (searchSignals) extra.search_signals = searchSignals
  if (searchCorrelationId) extra.search_correlation_id = searchCorrelationId
  if (searchSessionId) extra.search_session_id = searchSessionId
  if (globalSearchSessionId) extra.global_search_session_id = globalSearchSessionId
  if (globalCatalogBrowseSessionId)
    extra.global_catalog_browse_session_id = globalCatalogBrowseSessionId
  if (isNumber(itemDistance)) extra.buyer_item_distance_km = itemDistance
  if (homepageSessionId) extra.homepage_session_id = homepageSessionId
  if (uploadSessionId) extra.upload_session_id = uploadSessionId
  if (screen) extra.screen = screen
  if (metadata) extra.metadata = metadata

  return {
    event: 'list.show_item',
    extra,
  }
}

type SystemTimingArgs = {
  section: 'largest_contentful_paint' | 'ad_load' | 'van_ad_load' | 'van_ad_asset_load'
  duration: number
  completionState: 'succeeded'
  data?: string
}

type SystemTimingExtra = {
  section: SystemTimingArgs['section']
  /** Duration in millisecond */
  duration: number
  completion_state: 'succeeded'
  data?: string
}

export const systemTimingEvent = (args: SystemTimingArgs) => {
  const { section, duration, completionState, data } = args

  const extra: SystemTimingExtra = { section, duration, completion_state: completionState, data }

  return {
    event: 'system.timing',
    extra,
  }
}

type VisibleDurationEventArgs = {
  duration: number
  campaignId: string
  correlationId: string
}

export const visibleDurationEvent = (args: VisibleDurationEventArgs) => {
  const { duration, campaignId, correlationId } = args

  const extra: VisibleDurationEventExtra = {
    campaign_id: campaignId,
    correlation_id: correlationId,
    duration,
  }

  return {
    event: 'ad.visible_duration',
    extra,
  }
}

export const adReportEvent = (args: AdReportEventArgs) => {
  const {
    placementId,
    campaignId,
    creativeId,
    countryCode,
    networkName,
    advertiserId,
    lineItemId,
    isMobileWeb,
  } = args

  const extra: AdReportEventExtra = {
    placement_id: placementId,
    campaign_id: campaignId,
    creative_id: creativeId,
    country_code: countryCode,
    network_name: networkName,
    advertiser_id: advertiserId,
    line_item_id: lineItemId,
    is_mobile_web: isMobileWeb,
  }

  return {
    event: 'ad.report',
    extra,
  }
}
