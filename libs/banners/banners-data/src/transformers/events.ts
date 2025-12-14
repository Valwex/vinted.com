import { isNumber } from 'lodash'

// Source: https://github.com/vinted/dwh-schema-registry/blob/5387d2ce7b44ee93711a15dfb97c60a4d984f22c/avro/events/common/shared/user.avdl#L25
type UserTarget =
  | 'upload_item'
  | 'close_screen'
  | 'close_lister_activation_banner'
  | 'upload_after_lister_activation_banner'
  | 'faq_first_list_modal'
  | 'close_first_list_modal'
  | 'upload_first_list_modal'
  | 'learn_how_modal'
  | 'promotional_listing_banner'
  | 'ivs_guideline_banner'
  | 'beyond_fashion_new_lister_banner'
  | 'referrals_bottom_sheet_banner'

// https://github.com/vinted/dwh-schema-registry/blob/master/avro/events/common/shared/common.avdl#L34
export type ContentSource = 'catalog' | 'popular_items' | 'lister_activation_banner'

// https://github.com/vinted/dwh-schema-registry/blob/e39aec4da4a00a8e70a8839adfbc164d04d10b91/avro/events/common/shared/common.avdl#L34
type ContentTypes = 'lister_activation_banner'

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

// Source: https://github.com/vinted/dwh-schema-registry/blob/master/avro/events/user/view.avdl#L25
type ViewEventTarget = 'onboarding_modal_card' | 'promotional_listing_banner'

type ViewEventArgs = {
  target: ViewEventTarget
  targetDetails?: string
  screen?: string
}

type ViewEventExtra = {
  target: ViewEventTarget
  target_details?: string
  screen?: string
}

export const viewEvent = (args: ViewEventArgs) => {
  const { target, targetDetails, screen } = args

  const extra: ViewEventExtra = {
    target,
  }

  if (targetDetails) extra.target_details = targetDetails
  if (screen) extra.screen = screen

  return {
    event: 'user.view',
    extra,
  }
}

type ViewScreenEventArgs = {
  screen: string
}

export const viewScreenEvent = (args: ViewScreenEventArgs) => {
  const { screen } = args

  const extra = {
    screen,
  }

  return {
    event: 'user.view_screen',
    extra,
  }
}

type ItemUploadClickEventArgs = {
  screen?: string
  target: UserTarget
  targetDetails?: string | null
  uploadSessionId: string | null
}

type ItemUploadClickEventExtra = {
  screen?: string
  target: UserTarget
  target_details?: string | null
  upload_session_id: string | null
}

export const itemUploadClickEvent = (args: ItemUploadClickEventArgs) => {
  const { screen, target, targetDetails, uploadSessionId } = args

  const extra: ItemUploadClickEventExtra = {
    target,
    upload_session_id: uploadSessionId,
  }

  if (screen) extra.screen = screen
  if (targetDetails) extra.target_details = targetDetails

  return {
    event: 'upload_form.user.click',
    extra,
  }
}
