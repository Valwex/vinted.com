/* eslint-disable class-methods-use-this */
import { ControlMessage, InAppMessage, ModalMessage } from '@braze/web-sdk'

import {
  BrazeMarketingChannelType,
  BrazeModalInAppMessageDto,
  logContentParseError,
  logMissingContentError,
} from '@marketplace-web/braze/braze-data'

import InAppMessageStore from './InAppMessageStore'

const MINIMUM_BUTTON_COUNT = 1

export default class ModalInAppMessageStore extends InAppMessageStore<BrazeModalInAppMessageDto> {
  public isConsumable(
    inAppMessage: InAppMessage | ControlMessage,
  ): inAppMessage is BrazeModalInAppMessageDto {
    if (!(inAppMessage instanceof ModalMessage)) return false

    const channel = BrazeMarketingChannelType.InAppMessage
    const id = 'modal-in-app-message'
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

    const hasButtons = inAppMessage.buttons.length >= MINIMUM_BUTTON_COUNT
    if (!hasButtons) logMissingContentError(id, 'buttons', channel, tracking)

    return hasMessage && hasCampaign && hasButtons
  }
}
