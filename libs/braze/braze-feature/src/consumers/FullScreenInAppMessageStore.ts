/* eslint-disable class-methods-use-this */
import { ControlMessage, FullScreenMessage, InAppMessage } from '@braze/web-sdk'
import { includes } from 'lodash'

import {
  BrazeFullScreenInAppMessageDto,
  BrazeMarketingChannelType,
  FullScreenInAppStyle,
  logContentParseError,
  logMissingContentError,
} from '@marketplace-web/braze/braze-data'

import InAppMessageStore from './InAppMessageStore'

const MINIMAL_BUTTONS_COUNT = 1

export default class FullScreenInAppMessageStore extends InAppMessageStore<BrazeFullScreenInAppMessageDto> {
  public isConsumable(
    inAppMessage: InAppMessage | ControlMessage,
  ): inAppMessage is BrazeFullScreenInAppMessageDto {
    if (!(inAppMessage instanceof FullScreenMessage)) return false

    const channel = BrazeMarketingChannelType.InAppMessage
    const id = 'fullscreen-in-app-message'
    const { tracking, inAppStyle } = inAppMessage.extras

    let trackingData: Record<string, string>

    try {
      trackingData = JSON.parse(tracking!)
    } catch {
      logContentParseError(id, channel, tracking)
      trackingData = {}
    }

    const hasMessage = Boolean(inAppMessage.message)
    if (!hasMessage) logMissingContentError(id, 'message', channel, tracking)

    const hasCampaign = Boolean(trackingData.campaign_name)
    if (!hasCampaign) logMissingContentError(id, 'campaignName', channel, tracking)

    const hasButtons = inAppMessage.buttons.length >= MINIMAL_BUTTONS_COUNT
    if (!hasButtons) logMissingContentError(id, 'buttons', channel, tracking)

    const styleArray = [FullScreenInAppStyle.Splash, FullScreenInAppStyle.Cover]
    const isValidStyle = !inAppStyle || includes(styleArray, inAppStyle)
    if (!isValidStyle) logMissingContentError(id, 'inAppStyle', channel, tracking)

    return hasMessage && hasCampaign && hasButtons && isValidStyle
  }
}
