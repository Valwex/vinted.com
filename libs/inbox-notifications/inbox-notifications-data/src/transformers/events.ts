// Source: https://github.com/vinted/dwh-schema-registry/blob/5387d2ce7b44ee93711a15dfb97c60a4d984f22c/avro/events/common/shared/user.avdl#L25
type UserTarget =
  | 'notification'
  // TODO: add it to the dwh-schema-registry
  | 'header_inbox_notifications'
  // TODO: add it to the dwh-schema-registry
  | 'header_inbox_notifications_see_all'

// Source: https://github.com/vinted/dwh-schema-registry/blob/master/avro/events/user/view.avdl#L25
type ViewEventTarget =
  | 'facebook_like_button'
  | 'my_items_grid'
  | 'my_items_list'
  | 'my_favorites_grid'
  | 'my_favorites_list'
  | 'catalog_grid'
  | 'catalog_list'
  | 'nps_survey'
  | 'sell_tab_survey'
  | 'seller_after_upload_instructions'
  | 'seller_after_sale_instructions'
  | 'seller_after_transaction_complete_instructions'
  | 'email_confirmation'
  | 'email_confirmed'
  | 'video'
  | 'seller_banner'
  | 'sell_tab_banner'
  | 'seller_funnel_welcome_slide'
  | 'wallet_setup_success'
  | 'wallet_pay_in_success'
  | 'newsletter_subscription_banner'
  | 'editorial_campaign_banner'
  | 'cta_prompt'
  | 'feed_personalization_banner'
  | 'personalization_banner_after_feed'
  | 'ad_box'
  | 'bump_promotion'
  | 'onboarding_modal_card'
  | 'app_rating_dialog'
  | 'upload_onboarding_carousel_card'
  | 'notification'
  | 'see_whole_closet_cta'
  | 'cookie_and_ad_personalization_banner'
  | 'ad_personalization_toggle'
  | 'shipping_price'
  | 'translation_hint'
  | 'listing_increase_banner'
  | 'taxpayers_report'
  | 'taxpayers_tax_rules'
  | 'taxpayers_dac7_banner'
  | 'taxpayers_balance_block_modal'
  | 'taxpayers_sales_block_modal'
  | 'taxpayers_tax_rules_testimonial'
  | 'local_search_suggestion'
  | 'brand_cluster_section'
  | 'photo_picker_info_banner'
  | 'crm_message_video'
  | 'free_return_label_modal'
  | 'catalog_popular_catalog'
  | 'label_type_selection'
  | 'return_order'
  | 'ship_fast_badge_description'
  | 'video_story_feed'
  | 'video_story'
  | 'video_story_upload'
  | 'verify'
  | 'didnt_receive_email'
  | 'start'
  | 'free_bump_top_card'
  | 'free_bump_bottom_banner'
  | 'free_bump_success_message'
  | 'physical_auth_buyer'
  | 'physical_auth_seller'
  | 'favorite_button'
  | 'shipping_discount_details'
  | 'physical_auth_eligible'
  | 'recommended_items_grid'
  | 'shop_bundle'
  | 'measurements_info'
  | 'value_select_modal'
  | 'crm_in_app_message_carousel_slide'
  | 'onboarding_video'
  | 'drop_off_point'
  | 'pricing_info_note'
  | 'taxpayers_dac7_special_verification_banner'
  | 'see_drop_off_points'
  | 'message_action'
  | 'bundle_discount_settings'
  | 'taxpayers_special_verification_balance_block_modal'
  | 'sca_start_modal'
  | 'extend_shipping_deadline'
  | 'verification_completed'
  | 'cp_reminder'
  | 'select_parcel_size'
  | 'user_last_seen'
  | 'seller_feedbacks'
  | 'feedback'
  | 'social_proof_banner'
  | 'promotional_listing_banner'
  | 'electronics_verification_buyer'
  | 'electronics_verification_eligible'
  | 'electronics_verification_seller'
  | 'view_all_user_items_card_cta'
  | 'more_similar_items_card_cta'
  | 'photo_tips'
  | 'username_change_disabled'
  | 'carrier_disable_feedback'
  | 'bump_precheckout_review_order_action'
  | 'get_instant_mobile_notifications_banner'
  | 'seller_insights_blocks'
  | 'campaign_landing_page'
  | 'homepage_icon_modal'
  | 'mv_visibility_banner'

export enum customEventName {
  inboxNotificationImpression = 'inbox_notification_impression',
}

type customEventArgs = {
  eventName: customEventName
  target: ViewEventTarget
  targetDetails?: string
  screen?: string
}

type ViewEventExtra = {
  target: ViewEventTarget
  target_details?: string
  screen?: string
}

export const customEvent = (args: customEventArgs) => {
  const { eventName, target, targetDetails, screen } = args

  const extra: ViewEventExtra = {
    target,
  }

  if (targetDetails) extra.target_details = targetDetails
  if (screen) extra.screen = screen

  return {
    event: eventName,
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
