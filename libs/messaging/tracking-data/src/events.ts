import {
  BuyButtonPosition,
  EscrowBannerTrackingType,
  OfferRequestAction,
  TransactionSide,
  UserTarget,
} from './types'

type conversationReplyEventArgs = {
  userId: number
  itemId: number | null
}

export const conversationReplyEvent = (args: conversationReplyEventArgs) => {
  const { itemId, userId } = args

  const extra = {
    user_id: userId,
    item_id: itemId,
  }

  return {
    event: 'user.reply',
    extra,
  }
}

type SelectSuggestedMessageEventArgs = {
  id: string
  position?: number
  transactionId?: number | null
  itemIds?: string | null
}

type SelectSuggestedMessageEventExtra = {
  id: string
  position?: number
  transaction_id?: string | null
  item_ids?: string | null
}

export const selectSuggestedMessageEvent = (args: SelectSuggestedMessageEventArgs) => {
  const { id, position, transactionId, itemIds } = args

  const extra: SelectSuggestedMessageEventExtra = {
    id,
    transaction_id: transactionId?.toString() || null,
    item_ids: itemIds,
  }
  if (position) extra.position = position

  return {
    event: 'user.click_suggested_message',
    extra,
  }
}

type ViewSuggestedMessageEventArgs = {
  id: string
  position?: number
  transactionId?: number | null
  itemIds?: string | null
}

type ViewSuggestedMessageEventExtra = {
  id: string
  position?: number
  transaction_id?: string | null
  item_ids?: string | null
}

export const viewSuggestedMessageEvent = (args: ViewSuggestedMessageEventArgs) => {
  const { id, position, transactionId, itemIds } = args

  const extra: ViewSuggestedMessageEventExtra = {
    id,
    transaction_id: transactionId?.toString() || null,
    item_ids: itemIds,
  }
  if (position) extra.position = position

  return {
    event: 'user.view_suggested_message',
    extra,
  }
}

export const conversationPasteEvent = (conversationId: string) => ({
  event: 'user.conversation_paste',
  extra: {
    conversation_id: conversationId,
  },
})

type SellerActionOfferRequestArgs = {
  action: OfferRequestAction
  transactionId: number
  currentPrice: string
  offeredPrice: string
  offerRequestId: string
}

type SellerActionOfferRequestExtra = {
  offer_id: number
  transaction_id: number
  current_price: number
  offered_price: number
}

export const sellerActionOfferRequest = (args: SellerActionOfferRequestArgs) => {
  const { action, transactionId, currentPrice, offeredPrice, offerRequestId } = args

  const extra: SellerActionOfferRequestExtra = {
    transaction_id: transactionId,
    current_price: Number(currentPrice),
    offered_price: Number(offeredPrice),
    offer_id: Number(offerRequestId),
  }

  return {
    event: `seller.${action}_offer_request`,
    extra,
  }
}

type InboxConversationClickEventArgs = {
  conversationId: string
  lastMessageId: string | null
}

type InboxConversationClickEventExtra = {
  last_message_id: string
  message_thread_id: string
  is_offer_request_last_message: boolean
  screen: string
}

export const inboxConversationClickEvent = (args: InboxConversationClickEventArgs) => {
  const { conversationId, lastMessageId } = args

  const extra: InboxConversationClickEventExtra = {
    last_message_id: lastMessageId || '',
    message_thread_id: conversationId,
    is_offer_request_last_message: false,
    screen: 'message_list',
  }

  return {
    event: 'inbox.conversation_click',
    extra,
  }
}

export const userMessageThreadBannerViewEvent = (args: UserMessageThreadBannerArgs) => {
  const extra: UserMessageThreadBannerExtra = {
    transaction_id: args.transactionId,
    user_id: args.userId,
    user_side: args.userSide,
    banner_category: args.bannerCategory,
    banner_type: args.bannerType,
  }

  return {
    event: 'user.msg_thread_banner_view',
    extra,
  }
}

export const userMessageThreadBannerCloseEvent = (args: UserMessageThreadBannerArgs) => {
  const extra: UserMessageThreadBannerExtra = {
    transaction_id: args.transactionId,
    user_id: args.userId,
    user_side: args.userSide,
    banner_category: args.bannerCategory,
    banner_type: args.bannerType,
  }

  return {
    event: 'user.msg_thread_banner_close',
    extra,
  }
}

type UserMessageThreadBannerArgs = {
  transactionId: string | null
  userId: string | null
  userSide: TransactionSide | null
  bannerCategory: string
  bannerType: EscrowBannerTrackingType | string | null
}

type UserMessageThreadBannerExtra = {
  transaction_id: string | null
  user_id: string | null
  user_side: TransactionSide | null
  banner_category: string
  banner_type: EscrowBannerTrackingType | string | null
}

export const userMessageThreadBannerClickLinkEvent = (args: UserMessageThreadBannerArgs) => {
  const extra: UserMessageThreadBannerExtra = {
    transaction_id: args.transactionId,
    user_id: args.userId,
    user_side: args.userSide,
    banner_category: args.bannerCategory,
    banner_type: args.bannerType,
  }

  return {
    event: 'user.msg_thread_banner_click_link',
    extra,
  }
}

type EscrowWarningViewEventArgs = {
  userId?: string
  userSide: string
  msgThreadId?: string
  msgReplyId: string
  userIdRecipient?: string
  userIdSender: string
  msgConversationSide: string
  transactionId?: string
}

type EscrowWarningViewEventExtra = {
  user_id?: string
  user_side: string
  msg_thread_id?: string
  msg_reply_id: string
  user_id_recipient?: string
  user_id_sender: string
  msg_conversation_side: string
  transaction_id?: string
}

export const escrowWarningViewEvent = (args: EscrowWarningViewEventArgs) => {
  const {
    userId,
    userSide,
    msgThreadId,
    msgReplyId,
    userIdRecipient,
    userIdSender,
    msgConversationSide,
    transactionId,
  } = args

  const extra: EscrowWarningViewEventExtra = {
    user_id: userId,
    user_side: userSide,
    msg_thread_id: msgThreadId,
    msg_reply_id: msgReplyId,
    user_id_recipient: userIdRecipient,
    user_id_sender: userIdSender,
    msg_conversation_side: msgConversationSide,
    transaction_id: transactionId,
  }

  return {
    event: 'msg_escrow_warning_view',
    extra,
  }
}

type ConversationEventArgs = {
  transactionId: number | string
  conversationId: string
  userSide: string | null
  oppositeUserId: string | null | undefined
}

type ConversationEventExtra = {
  transaction_id: number | string
  conversation_id: string
  user_side: string | null
  opposite_user_id: string | null | undefined
}

export const conversationUserUsernameClick = (args: ConversationEventArgs) => {
  const { transactionId, conversationId, userSide, oppositeUserId } = args

  const extra: ConversationEventExtra = {
    transaction_id: transactionId,
    conversation_id: conversationId,
    user_side: userSide,
    opposite_user_id: oppositeUserId,
  }

  return {
    event: 'conversation.user_username_click',
    extra,
  }
}

export const conversationDetailsUserNameClick = (args: ConversationEventArgs) => {
  const { transactionId, conversationId, userSide, oppositeUserId } = args

  const extra: ConversationEventExtra = {
    transaction_id: transactionId,
    conversation_id: conversationId,
    user_side: userSide,
    opposite_user_id: oppositeUserId,
  }

  return {
    event: 'conversation.details_user_name_click',
    extra,
  }
}

export const conversationDetailsItemClick = (args: ConversationEventArgs) => {
  const { transactionId, conversationId, userSide, oppositeUserId } = args

  const extra: ConversationEventExtra = {
    transaction_id: transactionId,
    conversation_id: conversationId,
    user_side: userSide,
    opposite_user_id: oppositeUserId,
  }

  return {
    event: 'conversation.details_item_click',
    extra,
  }
}

export const conversationItemPhotoClick = (args: ConversationEventArgs) => {
  const { transactionId, conversationId, userSide, oppositeUserId } = args

  const extra: ConversationEventExtra = {
    transaction_id: transactionId,
    conversation_id: conversationId,
    user_side: userSide,
    opposite_user_id: oppositeUserId,
  }

  return {
    event: 'conversation.item_photo_click',
    extra,
  }
}

export const conversationMultipleItemsPhotosClick = (args: ConversationEventArgs) => {
  const { transactionId, conversationId, userSide, oppositeUserId } = args

  const extra: ConversationEventExtra = {
    transaction_id: transactionId,
    conversation_id: conversationId,
    user_side: userSide,
    opposite_user_id: oppositeUserId,
  }

  return {
    event: 'conversation.multiple_items_photos_click',
    extra,
  }
}

export const conversationInfoIconClick = (args: ConversationEventArgs) => {
  const { transactionId, conversationId, userSide, oppositeUserId } = args

  const extra: ConversationEventExtra = {
    transaction_id: transactionId,
    conversation_id: conversationId,
    user_side: userSide,
    opposite_user_id: oppositeUserId,
  }

  return {
    event: 'conversation.info_icon_click',
    extra,
  }
}

type ConversationUploadPhotoIconClickArgs = {
  transactionId: string | null
  conversationId: string | null
  userSide: TransactionSide | null
  oppositeUserId: string | null
}

type ConversationUploadPhotoIconClickExtra = {
  transaction_id: string | null
  conversation_id: string | null
  user_side: TransactionSide | null
  opposite_user_id: string | null
}

export const conversationUploadPhotoIconClick = (args: ConversationUploadPhotoIconClickArgs) => {
  const { transactionId, conversationId, userSide, oppositeUserId } = args

  const extra: ConversationUploadPhotoIconClickExtra = {
    transaction_id: transactionId,
    conversation_id: conversationId,
    user_side: userSide,
    opposite_user_id: oppositeUserId,
  }

  return {
    event: 'conversation.upload_photo_click',
    extra,
  }
}

type InboxButtonClickEventArgs = {
  isUnread: boolean
}

type InboxButtonClickEventExtra = {
  is_unread: boolean
}

export const inboxButtonClickEvent = (args: InboxButtonClickEventArgs) => {
  const { isUnread } = args

  const extra: InboxButtonClickEventExtra = {
    is_unread: isUnread,
  }

  return {
    event: 'inbox.button_click',
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

type MessagingClickTarget = 'open_conversation' | 'open_photo' | 'send_message' | 'copy_message'

type MessagingClickEventArgs = {
  target: MessagingClickTarget
  conversationId?: string | number
  userSide?: string | null
  screen: string
  messageId?: string
  info?: string
}

type MessagingClickEventExtra = {
  target: MessagingClickTarget
  conversation_id?: string | null
  user_side?: string | null
  screen: string
  info?: string
  target_details?: string | null
}

export const messagingClickEvent = (args: MessagingClickEventArgs) => {
  const { target, conversationId, userSide, screen, info, messageId } = args

  const extra: MessagingClickEventExtra = {
    screen,
    conversation_id: conversationId?.toString(),
    user_side: userSide,
    target,
    info,
    target_details: messageId,
  }

  return {
    event: 'messaging.click',
    extra,
  }
}

type MessagingViewEventArgs = {
  conversationId?: string | number
  screen: MessagingViewEventExtra['screen']
  userSide: MessagingViewEventExtra['user_side']
}

type MessagingViewEventExtra = {
  conversation_id: string | null
  screen: 'conversation' | 'inbox' | 'conversation_details'
  target: 'view_screen'
  user_side: 'buyer' | 'seller' | 'unknown'
}

export const messagingViewEvent = ({
  conversationId,
  screen,
  userSide: user_side,
}: MessagingViewEventArgs) => {
  const extra: MessagingViewEventExtra = {
    conversation_id: conversationId?.toString() ?? '',
    screen,
    target: 'view_screen',
    user_side,
  }

  return {
    event: 'messaging.view',
    extra,
  }
}

type SelfServiceViewScreenEventArgs = {
  screen: string
  transactionId: number | string
  faqEntryId?: number | string | null
  details?: string | null
  variant?: string | null
}

type SelfServiceViewScreenEventExtra = {
  screen: string
  transaction_id: number | string
  faq_entry_id?: number | string | null
  details?: string | null
  // "variant" is not present in the schema, however it is used in some places
  variant?: string | null
}

export const selfServiceViewScreenEvent = (args: SelfServiceViewScreenEventArgs) => {
  const { screen, transactionId, faqEntryId, details, variant } = args

  const extra: SelfServiceViewScreenEventExtra = {
    screen,
    transaction_id: transactionId,
  }

  if (faqEntryId) extra.faq_entry_id = faqEntryId
  if (details) extra.details = details
  if (variant) extra.variant = variant

  return {
    event: 'user.self_service.view_screen',
    extra,
  }
}

type WantItemButtonExtra =
  | 'message'
  | 'buy'
  | 'item_reservation_request'
  | 'make_offer'
  | 'create_bundle'

type BuyerWantItemEventExtra = {
  item_id: number | null
  transaction_id: number | null
  button: WantItemButtonExtra
  global_search_session_id: string | null
  global_catalog_browse_session_id?: string | null
  search_session_id: string | null
  homepage_session_id?: string | null
}

type BuyerWantItemEventArgs = {
  transactionId: number | null
  itemId: number | null
  button: WantItemButtonExtra
  globalSearchSessionId: string | null
  globalCatalogBrowseSessionId?: string | null
  searchSessionId: string | null
  homepageSessionId?: string | null
}

export const buyerWantItemEvent = ({
  transactionId,
  itemId,
  button,
  globalSearchSessionId,
  globalCatalogBrowseSessionId,
  searchSessionId,
  homepageSessionId,
}: BuyerWantItemEventArgs) => {
  const extra: BuyerWantItemEventExtra = {
    button,
    item_id: itemId,
    transaction_id: transactionId,
    global_search_session_id: globalSearchSessionId,
    global_catalog_browse_session_id: globalCatalogBrowseSessionId || undefined,
    search_session_id: searchSessionId,
    homepage_session_id: homepageSessionId,
  }

  return {
    event: 'buyer.want_item',
    extra,
  }
}

type BuyerBuyEventArgs = {
  transactionId: number
  screen: string
  globalSearchSessionId?: string | null
  globalCatalogBrowseSessionId?: string | null
  homepageSessionId?: string | null
  sellerOfferId?: number
  buttonPosition?: BuyButtonPosition
}

type BuyerBuyEventExtra = {
  transaction_id: number
  screen: string
  global_search_session_id?: string | null
  global_catalog_browse_session_id?: string | null
  homepage_session_id?: string | null
  seller_offer_id?: number
  button_position?: BuyButtonPosition
}

export const buyerBuyEvent = (args: BuyerBuyEventArgs) => {
  const {
    transactionId,
    screen,
    globalSearchSessionId,
    globalCatalogBrowseSessionId,
    homepageSessionId,
    sellerOfferId,
    buttonPosition,
  } = args

  const extra: BuyerBuyEventExtra = {
    transaction_id: transactionId,
    screen,
    global_search_session_id: globalSearchSessionId,
    global_catalog_browse_session_id: globalCatalogBrowseSessionId,
    homepage_session_id: homepageSessionId,
    seller_offer_id: sellerOfferId,
    button_position: buttonPosition,
  }

  return {
    event: 'buyer.buy',
    extra,
  }
}

type OpenOfferScreenEventArgs = {
  isBuyer: boolean
  currentPrice: number
  currencyCode: string
  openedFrom: string
  transactionId: number
}

type OpenOfferScreenEventExtra = {
  current_price: number
  currency: string
  opened_from: string
  transaction_id: number
}

export const openOfferScreenEvent = (args: OpenOfferScreenEventArgs) => {
  const { isBuyer, currentPrice, currencyCode, openedFrom, transactionId } = args

  const extra: OpenOfferScreenEventExtra = {
    current_price: currentPrice,
    currency: currencyCode,
    opened_from: openedFrom,
    transaction_id: transactionId,
  }

  return {
    event: isBuyer ? 'buyer.open_offer_screen' : 'seller.open_offer_screen',
    extra,
  }
}

type MessagingInteractionEventArgs = {
  conversationId: string | number | null
} & Omit<MessagingInteractionEventExtra, 'conversation_id'>

type MessagingInteractionEventExtra = {
  action: 'screen_load_duration_in_ms' | 'time_on_task_in_ms'
  screen: 'conversation' | 'inbox' | 'conversation_details'
  conversation_id: string | number | null
  duration: number
}

export const messagingInteractionEvent = ({
  screen,
  action,
  duration,
  conversationId,
}: MessagingInteractionEventArgs) => ({
  event: 'messaging.interaction',
  extra: {
    screen,
    action,
    duration,
    conversation_id: conversationId?.toString() || '',
  } as MessagingInteractionEventExtra,
})
