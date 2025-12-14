import {
  Card,
  ContentCards,
  getCachedContentCards,
  subscribeToContentCardsUpdates,
} from '@braze/web-sdk'

import BrazeProvider from './BrazeProvider'

type SubscriptionOptions = { useCache?: boolean }

export default class ContentCardProvider extends BrazeProvider<Card, SubscriptionOptions> {
  private publishContentCards = ({ cards }: ContentCards) => {
    this.clearConsumers()
    cards.forEach(card => this.publish(card))
  }

  protected createBrazeSubscription(options?: SubscriptionOptions) {
    if (options?.useCache) {
      // The provided return type is misleading (https://vinted.slack.com/archives/C03BP72JW/p1675234221076539?thread_ts=1675159790.506279&cid=C03BP72JW)
      const cachedContentCards: ContentCards | undefined = getCachedContentCards()

      if (cachedContentCards && cachedContentCards.cards.length > 0) {
        this.publishContentCards(cachedContentCards)
      }
    }

    return subscribeToContentCardsUpdates(this.publishContentCards)
  }
}
