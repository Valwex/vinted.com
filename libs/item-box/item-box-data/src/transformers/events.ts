import { isNumber } from 'lodash'

// Source: https://github.com/vinted/dwh-schema-registry/blob/5387d2ce7b44ee93711a15dfb97c60a4d984f22c/avro/events/common/shared/user.avdl#L25
type UserTarget = 'favorite' | 'item_box_action'

// https://github.com/vinted/dwh-schema-registry/blob/master/avro/events/common/shared/common.avdl#L34
export type ContentSource =
  | 'followed_user_items'
  | 'followed_brand_items'
  | 'vinted_picks'
  | 'promo'
  | 'video_items'
  | 'nearby_items'
  | 'marketing_items'
  | 'new_user_catalog_item'
  | 'new_user_popular_item'
  | 'new_user_sold_item'
  | 'catalog'
  | 'favorite_items'
  | 'user_items'
  | 'marketing_page'
  | 'item_group'
  | 'similar_items'
  | 'other_user_items'
  | 'editorial'
  | 'bundle'
  | 'brand_suggestion'
  | 'promoted_items'
  | 'new_upload'
  | 'new_user_upload'
  | 'new_seller_upload'
  | 'recommended_seller_upload'
  | 'promoted_members'
  | 'promoted_closets'
  | 'promoted_closets_preview'
  | 'find_friends'
  | 'user_discovery'
  | 'news_feed'
  | 'item_collection'
  | 'search'
  | 'catalog_promoted_items'
  | 'search_promoted_items'
  | 'recommended_items'
  | 'random_items'
  | 'canonical_items'
  | 'popular_items'
  | 'popular_promoted_items'
  | 'query_recommended_items'
  | 'favorite_promoted_items'
  | 'items_based_on_recent_purchases'
  | 'personalized_promoted_items'
  | 'lister_activation_banner'
  | 'verified_items'
  | 'verified_promoted_items'
  | 'catalog_promoted_closets'
  | 'search_promoted_closets'
  | 'catalog_ad'
  | 'search_ad'
  | 'feed_ad'
  | 'featured_collection'
  | 'gallery_image'
  | 'gallery_ad'
  | 'recommended_category_items'
  | 'galleried_items'
  | 'price_range_brand_items'
  | 'followed_users'
  | 'price_range_category_items'
  | 'seasonal_thumbnails'
  | 'recently_viewed_items'
  | 'complementary_items'
  | 'saved_search_items'
  | 'hvf_items'
  | 'hvf_promoted_items'
  | 'accessories_banner'
  | 'search_by_image'
  | 'hvf_banner'
  | 'ivs_banner'
  | 'homepage_block'
  | 'dac7_banner'
  | 'spring_cleaning_banner'
  | 'edit_price'
  | 'designer_recommended_items'
  | 'designer_items_based_on_recent_purchases'
  | 'designer_shop_by_brand'
  | 'designer_new_item_upload'
  | 'designer_ivs_banner'
  | 'electronics_new_item_upload'
  | 'electronics_items_by_categories'
  | 'electronics_recommended_items'
  | 'electronics_recommended_brand_items'
  | 'electronics_suggested_categories'
  | 'electronics_video_games_and_consoles_banner'
  | 'electronics_mobile_phones_and_tablets_banner'
  | 'video_games_and_consoles_banner'
  | 'mobile_phones_and_tablets_banner'
  | 'more_similar_items'
  | 'electronics_general_banner'
  | 'electronics_highlights_banner'
  | 'electronics_phones_and_tablets_banner'
  | 'electronics_laptops_banner'
  | 'collectibles_banner'
  | 'high_value_electronics_banner'
  | 'promoted_category_items'
  | 'feed_women_recommended_items'
  | 'feed_men_recommended_items'
  | 'feed_kids_recommended_items'
  | 'feed_entertainment_recommended_items'
  | 'feed_home_recommended_items'
  | 'feed_pet_care_recommended_items'
  | 'feed_sports_recommended_items'
  | 'feed_hobbies_collectables_recommended_items'
  | 'feed_women_new_items'
  | 'feed_men_new_items'
  | 'feed_kids_new_items'
  | 'feed_entertainment_new_items'
  | 'feed_home_new_items'
  | 'feed_pet_care_new_items'
  | 'feed_sports_new_items'
  | 'feed_hobbies_collectables_new_items'

// Source: https://github.com/vinted/dwh-schema-registry/blob/7726a66903b34c91df67e51284bcf1f60cdbefae/avro/events/common/shared/common.avdl#L34
type ContentTypes =
  | 'item'
  | 'user'
  | 'brand'
  | 'matching_brand_suggestion'
  | 'promo'
  | 'ad'
  | 'native_ad'
  | 'promoted_user'
  | 'promoted_closet'
  | 'lister_activation_banner'
  | 'featured_collection'
  | 'followed_user_block'

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

export type ClickListItemEventArgs = {
  id: number | string
  contentType: ContentTypes
  contentSource: ContentSource
  position: number
  searchCorrelationId?: string
  searchSessionId?: string | null
  globalSearchSessionId?: string | null
  globalCatalogBrowseSessionId?: string | null
  searchScore?: string
  searchSignals?: Array<string> | null
  itemDistance?: number | null
  homepageSessionId?: string
  screen?: string
  metadata?: Record<string, Array<string>>
}

type ClickListEventExtra = {
  content_type: ContentTypes
  content_source: ContentSource
  id: number | string
  position: number
  search_correlation_id?: string
  search_session_id?: string
  global_search_session_id?: string | null
  global_catalog_browse_session_id?: string | null
  search_score?: string
  search_signals?: Array<string>
  buyer_item_distance_km?: number
  homepage_session_id?: string
  screen?: string
  metadata?: Record<string, Array<string>>
}

export const clickListItemEvent = (args: ClickListItemEventArgs) => {
  const {
    id,
    contentType,
    contentSource,
    position,
    searchCorrelationId,
    searchSessionId,
    globalSearchSessionId,
    globalCatalogBrowseSessionId,
    searchScore,
    searchSignals,
    itemDistance,
    homepageSessionId,
    screen,
    metadata,
  } = args

  const extra: ClickListEventExtra = {
    id,
    position,
    content_type: contentType,
    content_source: contentSource,
  }

  if (searchCorrelationId) extra.search_correlation_id = searchCorrelationId
  if (searchSessionId) extra.search_session_id = searchSessionId
  if (globalSearchSessionId) extra.global_search_session_id = globalSearchSessionId
  if (globalCatalogBrowseSessionId)
    extra.global_catalog_browse_session_id = globalCatalogBrowseSessionId
  if (searchScore) extra.search_score = searchScore
  if (searchSignals) extra.search_signals = searchSignals
  if (isNumber(itemDistance)) extra.buyer_item_distance_km = itemDistance
  if (homepageSessionId) extra.homepage_session_id = homepageSessionId
  if (screen) extra.screen = screen
  if (metadata) extra.metadata = metadata

  return {
    event: 'user.click_list_item',
    extra,
  }
}
