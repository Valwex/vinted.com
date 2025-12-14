/* eslint-disable class-methods-use-this */
import { CaptionedImage, Card, ClassicCard } from '@braze/web-sdk'

import {
  BrazeInboxNotificationCardDto,
  BrazeMarketingChannelType,
} from '@marketplace-web/braze/braze-data'

import BrazeCardStore from './BrazeCardStore'
import { isValidBrazeCard } from './utils'

export default class InboxNotificationCardStore extends BrazeCardStore<BrazeInboxNotificationCardDto> {
  public isConsumable(card: Card): card is BrazeInboxNotificationCardDto {
    const channel = BrazeMarketingChannelType.InboxNotification

    return isValidBrazeCard(card, channel, ClassicCard, CaptionedImage)
  }
}
