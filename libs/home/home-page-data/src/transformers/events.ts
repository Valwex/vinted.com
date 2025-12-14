import { isNumber } from 'lodash'

import { ItemBlockCtaType } from '../constants'
import { ContentSource } from '../types/events'

// Source: https://github.com/vinted/dwh-schema-registry/blob/5387d2ce7b44ee93711a15dfb97c60a4d984f22c/avro/events/common/shared/user.avdl#L25
type UserTarget =
  | 'personalization_button_after_feed'
  | 'favorite'
  | 'feed_load_more_button'
  | 'homepage_icon_modal_cta'
  | 'homepage_cta_widget_cta'
  | 'homepage_accepted_offer_widget_cta'

// Source: https://github.com/vinted/dwh-schema-registry/blob/e39aec4da4a00a8e70a8839adfbc164d04d10b91/avro/events/common/shared/common.avdl#L34
type ContentTypes = 'item'

type UserViewHomepageBlockArgs = {
  blockName: string
  blockPosition: number
  homepageSessionId?: string
  id?: string | number | null
}

type UserViewHomepageBlockExtra = {
  block_name: string
  block_position: number
  homepage_session_id?: string
  id?: string | number | null
}

export const userViewHomepageBlock = (args: UserViewHomepageBlockArgs) => {
  const { blockName, blockPosition, homepageSessionId, id } = args

  const extra: UserViewHomepageBlockExtra = {
    block_name: blockName,
    block_position: blockPosition,
  }

  if (homepageSessionId) extra.homepage_session_id = homepageSessionId
  if (id) extra.id = id

  return {
    event: 'user.view_homepage_block',
    extra,
  }
}

type UserViewHomepageBlockCtaArgs = {
  type: ItemBlockCtaType
  blockName: string
  blockPosition: number
  homepageSessionId?: string
  id?: string | number | null
}

type UserViewHomepageBlockCtaExtra = {
  type: ItemBlockCtaType
  block_name: string
  block_position: number
  homepage_session_id?: string
  id?: string | number | null
}

export const userViewHomepageBlockCta = (args: UserViewHomepageBlockCtaArgs) => {
  const { type, blockName, blockPosition, homepageSessionId, id } = args

  const extra: UserViewHomepageBlockCtaExtra = {
    type,
    block_name: blockName,
    block_position: blockPosition,
  }

  if (homepageSessionId) extra.homepage_session_id = homepageSessionId
  if (id) extra.id = id

  return {
    event: 'user.view_homepage_block_cta',
    extra,
  }
}

type UserClickHomepageBlockCtaArgs = {
  type: ItemBlockCtaType
  blockName: string
  blockPosition: number
  homepageSessionId?: string
  id?: string | number | null
}

type UserClickHomepageBlockCtaExtra = {
  type: ItemBlockCtaType
  block_name: string
  block_position: number
  homepage_session_id?: string
  id?: string | number | null
}

export const userClickHomepageBlockCta = (args: UserClickHomepageBlockCtaArgs) => {
  const { type, blockName, blockPosition, homepageSessionId, id } = args

  const extra: UserClickHomepageBlockCtaExtra = {
    type,
    block_name: blockName,
    block_position: blockPosition,
  }

  if (homepageSessionId) extra.homepage_session_id = homepageSessionId
  if (id) extra.id = id

  return {
    event: 'user.click_homepage_block_cta',
    extra,
  }
}

type UserClickHomepageVerticalArgs = {
  homepageSessionId?: string
  target: string
}

type UserClickHomepageVerticalExtra = { target: string; homepage_session_id?: string }

export const userClickHomepageVertical = (args: UserClickHomepageVerticalArgs) => {
  const { target, homepageSessionId } = args
  const extra: UserClickHomepageVerticalExtra = { target }

  if (homepageSessionId) extra.homepage_session_id = homepageSessionId

  return {
    event: 'user.click_homepage_vertical',
    extra,
  }
}

type UserHomepageElementArgs = {
  blockName: string
  position: number
  contentSource: string
  contentSourceId: string | null
  contentSourceLabel?: string
  extraAttributes?: string
  homepageSessionId: string
  screen?: string
}

type UserHomepageElementExtra = {
  block_name: string
  position: number
  content_source: string
  content_source_id?: string
  content_source_label: string
  extra_attributes?: string
  homepage_session_id: string
  screen?: string
}

export const userClickHomepageElement = (args: UserHomepageElementArgs) => {
  const extra: UserHomepageElementExtra = {
    block_name: args.blockName,
    position: args.position,
    content_source: args.contentSource,
    content_source_label: args.contentSourceLabel || '',
    homepage_session_id: args.homepageSessionId,
    screen: args.screen,
  }

  if (args.contentSourceId) extra.content_source_id = args.contentSourceId
  if (args.extraAttributes) extra.extra_attributes = args.extraAttributes

  return {
    event: 'user.click_homepage_element',
    extra,
  }
}

export const userViewHomepageElement = (args: UserHomepageElementArgs) => {
  const extra: UserHomepageElementExtra = {
    block_name: args.blockName,
    position: args.position,
    content_source: args.contentSource,
    content_source_label: args.contentSourceLabel || '',
    homepage_session_id: args.homepageSessionId,
  }

  if (args.screen) extra.screen = args.screen
  if (args.contentSourceId) extra.content_source_id = args.contentSourceId
  if (args.extraAttributes) extra.extra_attributes = args.extraAttributes

  return {
    event: 'user.view_homepage_element',
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

type FavouriteItemEventArgs = {
  itemId: number
  isFollowEvent: boolean
  contentSource?: ContentSource | null
  searchCorrelationId?: string
  searchSessionId?: string
  globalSearchSessionId?: string | null
  globalCatalogBrowseSessionId?: string | null
  homepageSessionId?: string
  itemOwnerId?: string | number | null
}

type FavouriteItemEventExtra = {
  item_id: number
  content_source?: ContentSource
  search_correlation_id?: string
  search_session_id?: string
  global_search_session_id?: string | null
  global_catalog_browse_session_id?: string | null
  homepage_session_id?: string
  item_owner_id?: string | number
}

export const favouriteItemEvent = ({
  itemId,
  isFollowEvent,
  contentSource,
  searchCorrelationId,
  searchSessionId,
  globalSearchSessionId,
  globalCatalogBrowseSessionId,
  homepageSessionId,
  itemOwnerId,
}: FavouriteItemEventArgs) => {
  const eventName = isFollowEvent ? 'user.favorite_item' : 'user.unfavorite_item'
  const extra: FavouriteItemEventExtra = { item_id: itemId }

  if (contentSource) extra.content_source = contentSource
  if (searchCorrelationId) extra.search_correlation_id = searchCorrelationId
  if (searchSessionId) extra.search_session_id = searchSessionId
  if (globalSearchSessionId) extra.global_search_session_id = globalSearchSessionId
  if (globalCatalogBrowseSessionId)
    extra.global_catalog_browse_session_id = globalCatalogBrowseSessionId
  if (homepageSessionId) extra.homepage_session_id = homepageSessionId
  if (itemOwnerId) extra.item_owner_id = itemOwnerId

  return {
    event: eventName,
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
type ViewEventTarget = 'homepage_icon_modal'

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
