/* eslint-disable class-methods-use-this */
import { CaptionedImage, Card, ClassicCard } from '@braze/web-sdk'

import {
  BrazeInboxMessageCardDto,
  BrazeMarketingChannelType,
  logContentParseError,
  logMissingContentError,
} from '@marketplace-web/braze/braze-data'

import BrazeCardStore from './BrazeCardStore'
import { isValidBrazeCard } from './utils'

export default class InboxMessageCardStore extends BrazeCardStore<BrazeInboxMessageCardDto> {
  public isConsumable(card: Card): card is BrazeInboxMessageCardDto {
    const channel = BrazeMarketingChannelType.InboxMessage

    if (!isValidBrazeCard(card, channel, ClassicCard, CaptionedImage)) return false

    let trackingData: Record<string, string>

    try {
      trackingData = JSON.parse(card.extras.tracking!)
    } catch {
      logContentParseError(card.id, card.extras.channel!, card.extras.tracking)
      trackingData = {}
    }

    const hasCampaign = Boolean(trackingData.campaign_name)
    if (!hasCampaign) logMissingContentError(card.id, 'campaignName', channel, card.extras.tracking)

    return hasCampaign
  }
}
