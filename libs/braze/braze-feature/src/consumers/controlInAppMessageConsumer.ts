import { ControlMessage, InAppMessage, showInAppMessage } from '@braze/web-sdk'

import { BrazeMarketingChannelType, logSdkLoggingFailure } from '@marketplace-web/braze/braze-data'

import { BrazeConsumer } from './BrazeConsumer'

const controlInAppMessageConsumer: BrazeConsumer<InAppMessage | ControlMessage> = {
  isConsumable(inAppMessage: InAppMessage | ControlMessage): inAppMessage is ControlMessage {
    return inAppMessage instanceof ControlMessage
  },

  consume(inAppMessage: ControlMessage): void {
    const wasShown = showInAppMessage(inAppMessage)

    if (!wasShown)
      logSdkLoggingFailure(
        undefined,
        'control-in-app-impression',
        BrazeMarketingChannelType.InAppMessage,
        undefined,
      )
  },
}

export default controlInAppMessageConsumer
