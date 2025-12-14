import type braze from '@braze/web-sdk'

import { Conversation } from '@marketplace-web/messaging/conversation-messaging-data'
import { GenericInboxNotificationModel } from '@marketplace-web/inbox-notifications/inbox-notifications-data'
// Temporary workaround. Resolve ASAP. Do not add more ignores like this.
// eslint-disable-next-line eslint-comments/no-restricted-disable
// eslint-disable-next-line @nx/enforce-module-boundaries
import { NotificationPosition } from '@marketplace-web/common-components/notification-ui'
import { Translation } from '@marketplace-web/i18n/i18n-data'

import {
  FullScreenInAppStyle,
  IN_APP_MAX_BUTTONS_COUNT,
  InAppModalMessageType,
  InboxNotificationType,
  PROMO_BOX_INDEX_IN_FEED_ROW,
  PROMO_BOX_PAGE_LENGTH,
  PromoBoxType,
} from './constants'
import {
  BrazeFullScreenInAppMessageDto,
  BrazeInboxMessageCardDto,
  BrazeInboxNotificationCardDto,
  BrazeModalInAppMessageDto,
  BrazePromoBoxCardDto,
  BrazeSlideUpInAppMessageDto,
} from './types/dtos'
import {
  GenericPromoBoxModel,
  InAppMessageTrackingDataModel,
  InAppModalMessageModel,
  InAppNotificationMessageModel,
} from './types/models'
import { logContentParseError } from './utils/observability'

export const transformInAppMessageTrackingData = (
  dto: BrazeSlideUpInAppMessageDto | BrazeModalInAppMessageDto | BrazeFullScreenInAppMessageDto,
): InAppMessageTrackingDataModel => {
  let result: Record<string, string | undefined>

  try {
    result = JSON.parse(dto.extras.tracking)
  } catch {
    logContentParseError(dto.message, 'in-app-message', dto.extras.tracking)
    result = {}
  }

  return {
    campaignName: result.campaign_name,
    campaignMessageName: result.campaign_message_name,
    canvasName: result.canvas_name,
    canvasVariantName: result.canvas_variant_name,
  }
}

export const transformBrazeInboxCardNotificationDto = (
  dto: BrazeInboxNotificationCardDto,
): GenericInboxNotificationModel => ({
  id: dto.id,
  body: dto.description,
  link: dto.url,
  photoUrl: dto.extras.logoURL,
  photoStyle: 'circle',
  time: dto.updated.getTime(),
  type: InboxNotificationType.Braze,
  isViewed: dto.viewed,
  isControl: dto.extras.variant === 'control',
  note: null, // TODO: check if we need to transform dto.description into note
})

export const transformBrazeInboxMessageCardDto = (dto: BrazeInboxMessageCardDto): Conversation => ({
  id: dto.id,
  conversationType: 'braze',
  messages: [], // braze message will be handled separately from context API to simplify parsing
  transactionId: undefined,
  isTranslated: false,
  oppositeUser: null,
  buyerId: undefined,
  isPaymentActionAvailable: false,
  translationType: Translation.None,
  isReadByOppositeUser: dto.viewed,
  itemId: undefined,
  isReplyAllowed: true,
  isSuspicious: false,
  isDeletionRestricted: false,
  isBundleAvailable: false,
  transaction: null,
  suggestedMessages: undefined,
  item: null,
  education: null,
  moderatedItems: null,
  isControl: dto.extras.variant === 'control',
  userHasSupportRole: false,
  isFirstTimeListerEducationRequired: false,
})

export const transformBrazePromoBoxCardDto = (dto: BrazePromoBoxCardDto): GenericPromoBoxModel => {
  const position =
    !dto.pinned && dto.extras?.page && Number(dto.extras.page)
      ? (Number(dto.extras.page) - 1) * PROMO_BOX_PAGE_LENGTH + PROMO_BOX_INDEX_IN_FEED_ROW
      : undefined

  return {
    id: dto.id,
    url: dto.url,
    backgroundColor: undefined,
    imageUrl: dto.imageUrl,
    imageAlt: dto.extras.content_description,
    impressionUrl: null,
    isControl: dto.extras?.variant === 'control',
    type: dto.pinned ? PromoBoxType.BrazeSticky : PromoBoxType.Braze,
    position,
  }
}

const resolveInAppDuration = (inAppMessage: braze.InAppMessage) =>
  inAppMessage.dismissType === 'AUTO_DISMISS' ? inAppMessage.duration : undefined

const resolveInAppButtonUrl = (button: braze.InAppMessageButton | undefined) =>
  button?.clickAction === 'URI' ? button.uri : undefined

const sortButtons = (buttons: BrazeModalInAppMessageDto['buttons']) => {
  const hasTwoButtons = buttons.length === IN_APP_MAX_BUTTONS_COUNT

  if (hasTwoButtons) {
    return {
      primaryButton: buttons[0],
      secondaryButton: buttons[1],
    }
  }

  const button = buttons[0]
  const hasUrl = button.clickAction === 'URI'

  return {
    primaryButton: hasUrl ? button : undefined,
    secondaryButton: hasUrl ? undefined : button,
  }
}

export const transformBrazeSlideUpInAppMessageDto = (
  dto: BrazeSlideUpInAppMessageDto,
): InAppNotificationMessageModel => {
  return {
    message: dto.message,
    imageUrl: dto.imageUrl,
    duration: resolveInAppDuration(dto),
    url: dto.uri,
    position: dto.slideFrom === 'TOP' ? NotificationPosition.Top : NotificationPosition.Bottom,
    shouldOpenLinkInNewTab: dto.openTarget === 'BLANK',
    original: dto,
    ...transformInAppMessageTrackingData(dto),
  }
}

export const transformBrazeModalInAppMessageDto = (
  dto: BrazeModalInAppMessageDto,
): InAppModalMessageModel => {
  const { primaryButton, secondaryButton } = sortButtons(dto.buttons)

  return {
    header: dto.header,
    message: dto.message,
    imageUrl: dto.imageUrl,
    duration: resolveInAppDuration(dto),
    primaryButtonText: primaryButton?.text,
    secondaryButtonText: secondaryButton?.text,
    primaryButtonUrl: resolveInAppButtonUrl(primaryButton),
    secondaryButtonUrl: resolveInAppButtonUrl(secondaryButton),
    videoURL: undefined,
    type: InAppModalMessageType.Splash,
    shouldOpenLinkInNewTab: dto.openTarget === 'BLANK',
    original: dto,
    ...transformInAppMessageTrackingData(dto),
  }
}

export const transformBrazeFullScreenInAppMessageDto = (
  dto: BrazeFullScreenInAppMessageDto,
): InAppModalMessageModel => {
  const type =
    dto.extras.inAppStyle === FullScreenInAppStyle.Cover
      ? InAppModalMessageType.Cover
      : InAppModalMessageType.FullScreenSplash

  const videoURL =
    type === InAppModalMessageType.FullScreenSplash && dto.extras.videoURL
      ? dto.extras.videoURL
      : undefined

  const { primaryButton, secondaryButton } = sortButtons(dto.buttons)

  return {
    header: dto.header,
    message: dto.message,
    imageUrl: dto.imageUrl,
    duration: resolveInAppDuration(dto),
    primaryButtonText: primaryButton?.text,
    secondaryButtonText: secondaryButton?.text,
    primaryButtonUrl: resolveInAppButtonUrl(primaryButton),
    secondaryButtonUrl: resolveInAppButtonUrl(secondaryButton),
    videoURL,
    type,
    shouldOpenLinkInNewTab: dto.openTarget === 'BLANK',
    original: dto,
    ...transformInAppMessageTrackingData(dto),
  }
}
