import { ControlMessage, HtmlMessage, InAppMessage, showInAppMessage } from '@braze/web-sdk'

import { logBrazeMessage } from '@marketplace-web/braze/braze-data'

import { BrazeConsumer } from './BrazeConsumer'

const htmlInAppMessageConsumer: BrazeConsumer<InAppMessage | ControlMessage> = {
  isConsumable(inAppMessage: InAppMessage | ControlMessage): inAppMessage is HtmlMessage {
    return inAppMessage instanceof HtmlMessage
  },

  consume(inAppMessage: HtmlMessage): void {
    const wasShown = showInAppMessage(inAppMessage)

    if (!wasShown) {
      logBrazeMessage('inAppMessageNotShown', String(inAppMessage.extras.tracking))
    }
  },
}

export default htmlInAppMessageConsumer
