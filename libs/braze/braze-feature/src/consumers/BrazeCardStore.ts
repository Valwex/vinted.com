/* eslint-disable class-methods-use-this */
import type { Card } from '@braze/web-sdk'
import { isEqual, orderBy } from 'lodash'

import { BrazeConsumer } from './BrazeConsumer'
import GenericStore from './generic-store'

export default abstract class BrazeCardStore<T extends Card>
  extends GenericStore<ReadonlyArray<T>>
  implements BrazeConsumer<Card, T>
{
  constructor() {
    super([])
  }

  protected getOrderedCards(cards: ReadonlyArray<T>): ReadonlyArray<T> {
    return orderBy(cards, card => card.updated?.getTime(), 'desc')
  }

  public abstract isConsumable(card: Card): card is T

  public clear(): void {
    this.state = []
  }

  public consume(card: T): void {
    const index = this.state.findIndex(stateEntity => stateEntity.id === card.id)

    if (index === -1) {
      this.state = this.getOrderedCards([...this.state, card])

      return
    }

    if (!isEqual(this.state[index], card)) {
      const stateCopy = Array.from(this.state)

      stateCopy[index] = card

      this.state = stateCopy
    }
  }
}
