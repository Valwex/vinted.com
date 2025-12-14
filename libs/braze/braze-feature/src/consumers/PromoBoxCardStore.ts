/* eslint-disable class-methods-use-this */
import { Card, ImageOnly } from '@braze/web-sdk'
import { orderBy } from 'lodash'

import {
  BrazeMarketingChannelType,
  BrazePromoBoxCardDto,
  logIncorrectContentError,
  logMissingContentError,
} from '@marketplace-web/braze/braze-data'

import BrazeCardStore from './BrazeCardStore'
import { isValidBrazeCard } from './utils'

export default class PromoBoxCardStore extends BrazeCardStore<BrazePromoBoxCardDto> {
  protected getOrderedCards(cards: ReadonlyArray<BrazePromoBoxCardDto>) {
    return orderBy(
      cards,
      [card => Number(card.extras?.priority) || 0, card => card.created?.getTime()],
      ['desc', 'desc'],
    )
  }

  public isConsumable(card: Card): card is BrazePromoBoxCardDto {
    const channel = BrazeMarketingChannelType.PromoBox

    const isInvalidCard = !isValidBrazeCard(card, channel, ImageOnly)
    if (isInvalidCard) return false

    const page = Number(card.extras.page)
    const hasMissingContent = !card.pinned && !page
    const hasConflictingProperties = card.pinned && page > 0
    const hasImageUrl = Boolean(card.imageUrl)

    if (hasMissingContent) {
      logMissingContentError(card.id, 'page or pinned', channel, card.extras.tracking)
    }

    if (hasConflictingProperties) {
      logIncorrectContentError(card.id, 'page or pinned', channel, card.extras.tracking)
    }

    if (!hasImageUrl) logMissingContentError(card.id, 'imageUrl', channel, card.extras.tracking)

    return hasImageUrl && !hasMissingContent && !hasConflictingProperties
  }
}
