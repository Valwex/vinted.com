import { NOTIFICATIONS_URL, PROFILE_SETTINGS_URL } from './constants/routes'

const HOME_URL = '^/$'
const CATALOG_URL = '^/catalog/.+$'
const CLOSET_URL = '^/member/[0-9]+$'
const INBOX_URL = '^/inbox/.+$'

export const WHITELISTING_RULES = [
  HOME_URL,
  CATALOG_URL,
  CLOSET_URL,
  INBOX_URL,
  NOTIFICATIONS_URL,
  PROFILE_SETTINGS_URL,
]

export enum BrazeMarketingChannelType {
  InboxNotification = 'inbox-notification',
  InboxMessage = 'inbox-message',
  PromoBox = 'promobox',
  InAppMessage = 'in-app-message',
}

export const brazeChannels: Array<string> = Object.values(BrazeMarketingChannelType)

export const PROMO_BOX_PAGE_LENGTH = 20
export const PROMO_BOX_INDEX_IN_FEED_ROW = 3

export const IN_APP_MAX_BUTTONS_COUNT = 2

// In Braze dashboard, you are able to to choose between "Modal" and "Full Screen Modal" type
export enum FullScreenInAppStyle {
  Cover = 'cover',
  Splash = 'splash',
}

export enum BrazeCustomEvent {
  ListingCreated = 'listing_created',
  EscrowPurchaseCompleted = 'escrow_purchase_completed',
  MarkedAsSold = 'marked_as_sold',
  AddedToFavourites = 'added_to_favourites',
  EmptyUploadFormView = 'item_upload_empty_form_view',
  ItemUploadFormFillingStarted = 'item_upload_form_filling_started',
  ViewedCategory = 'viewed_category',
  SavedCategory = 'saved_category_search',
  SearchedBrand = 'brand_filter_used',
}

// deferred events are events that should be triggered after user has been navigated to another page
export const EVENTS_WITH_PROPERTIES_FROM_BACKEND = [
  BrazeCustomEvent.ListingCreated,
  BrazeCustomEvent.EscrowPurchaseCompleted,
  BrazeCustomEvent.MarkedAsSold,
  BrazeCustomEvent.AddedToFavourites,
]

export const BRAZE_VINTED_LOGO_IMAGE_PATH = '/no-photo/vinted-welcome.png'

export enum PromoBoxType {
  Braze,
  BrazeSticky,
}

export enum InAppModalMessageType {
  Splash = 'Splash',
  Cover = 'Cover',
  FullScreenSplash = 'FullScreenSplash',
}

export enum InAppMessageDismissMethod {
  CloseButton = 'x_button',
  BackgroundClick = 'background_click',
  NoUrlButton = 'no_url_button',
  AutoDismiss = 'auto_dismiss',
}

export enum NotificationPosition {
  Bottom,
  Top,
  TopRight,
  Parent,
}

export enum InboxNotificationType {
  Vinted = 'vinted',
  Braze = 'braze',
}
