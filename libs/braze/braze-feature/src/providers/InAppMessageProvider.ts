import { InAppMessage, subscribeToInAppMessage } from '@braze/web-sdk'

import { GenericInAppMessage } from '../types/generic-in-app-message'
import { storedInAppMessage } from '../utils/stored-in-app-message'
import BrazeProvider from './BrazeProvider'

export default class InAppMessageProvider extends BrazeProvider<GenericInAppMessage> {
  private isEnabled = true

  public disable() {
    this.isEnabled = false
  }

  public enable() {
    this.isEnabled = true
  }

  public publishStoredMessages() {
    const storedMessage = storedInAppMessage.get()

    if (!storedMessage) return

    this.publish(storedMessage)
    storedInAppMessage.clear()
  }

  protected createBrazeSubscription() {
    // TODO: [KK-2175] Instead of `storedInAppMessage`, use Braze SDK functions
    // once they're implemented (https://github.com/braze-inc/braze-web-sdk/issues/144)
    const handleInAppMessage = (genericInAppMessage: GenericInAppMessage) => {
      const areRestrictionsDisabled =
        genericInAppMessage instanceof InAppMessage &&
        genericInAppMessage.extras.restrictions === 'off'

      return this.isEnabled || areRestrictionsDisabled
        ? this.publish(genericInAppMessage)
        : storedInAppMessage.set(genericInAppMessage)
    }

    return subscribeToInAppMessage(handleInAppMessage)
  }
}
