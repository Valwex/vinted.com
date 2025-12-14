import {
  ControlMessage,
  FullScreenMessage,
  InAppMessage,
  ModalMessage,
  SlideUpMessage,
} from '@braze/web-sdk'

import { BrazeConsumer } from './BrazeConsumer'
import GenericStore from './generic-store'

export default abstract class InAppMessageStore<
    T extends ModalMessage | FullScreenMessage | SlideUpMessage | InAppMessage | ControlMessage,
  >
  extends GenericStore<T | null>
  implements
    BrazeConsumer<
      ModalMessage | FullScreenMessage | SlideUpMessage | InAppMessage | ControlMessage,
      T
    >
{
  constructor() {
    super(null)
  }

  public abstract isConsumable(
    inAppMessage: ModalMessage | FullScreenMessage | SlideUpMessage | InAppMessage | ControlMessage,
  ): inAppMessage is T

  public consume(inAppMessage: T): void {
    this.state = inAppMessage
  }
}
