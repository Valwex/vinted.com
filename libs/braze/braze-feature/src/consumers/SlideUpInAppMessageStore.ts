/* eslint-disable class-methods-use-this */
import { ControlMessage, InAppMessage, SlideUpMessage } from '@braze/web-sdk'

import {
  BrazeMarketingChannelType,
  BrazeSlideUpInAppMessageDto,
  logContentParseError,
  logMissingContentError,
} from '@marketplace-web/braze/braze-data'

import InAppMessageStore from './InAppMessageStore'

export default class SlideUpInAppMessageStore extends InAppMessageStore<BrazeSlideUpInAppMessageDto> {
  public isConsumable(
    inAppMessage: InAppMessage | ControlMessage,
  ): inAppMessage is BrazeSlideUpInAppMessageDto {
    if (!(inAppMessage instanceof SlideUpMessage)) return false

    const channel = BrazeMarketingChannelType.InAppMessage
    const id = 'slide-up-in-app-message'
    const { tracking } = inAppMessage.extras

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

    return hasMessage && hasCampaign
  }
}
