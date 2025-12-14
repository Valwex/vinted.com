import { removeSubscription } from '@braze/web-sdk'

import { BrazeConsumer } from '../consumers/BrazeConsumer'

export default abstract class BrazeProvider<
  T,
  SubscriptionOptions = never,
  S extends ReadonlyArray<BrazeConsumer<T, T>> = ReadonlyArray<BrazeConsumer<T, T>>,
> {
  private brazeSubscriptionId: string | undefined

  private readonly consumers: S

  constructor(...consumers: S) {
    this.consumers = consumers
  }

  protected clearConsumers(): void {
    this.consumers.forEach(consumer => consumer.clear?.())
  }

  public subscribeToBraze(options?: SubscriptionOptions): void {
    if (this.brazeSubscriptionId) return

    this.brazeSubscriptionId = this.createBrazeSubscription(options)
  }

  public unsubscribeFromBraze() {
    if (!this.brazeSubscriptionId) return

    removeSubscription(this.brazeSubscriptionId)

    this.brazeSubscriptionId = undefined
  }

  public publish = (entity: T) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const consumer of this.consumers) {
      if (consumer.isConsumable(entity)) {
        consumer.consume(entity)

        return
      }
    }
  }

  protected abstract createBrazeSubscription(options?: SubscriptionOptions): string | undefined
}
