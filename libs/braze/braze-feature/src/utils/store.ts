import { createDummyStore } from '../consumers/generic-store'
import { NullableBrazeStores } from '../types/store'

export const DEFAULT_STORES: NullableBrazeStores = {
  promoBoxCardStore: createDummyStore(null),
  inboxMessageCardStore: createDummyStore(null),
  inboxNotificationCardStore: createDummyStore(null),
  slideUpInAppMessageStore: createDummyStore(null),
  modalInAppMessageStore: createDummyStore(null),
  fullScreenInAppMessageStore: createDummyStore(null),
}

export const FALLBACK_STORES: NullableBrazeStores = {
  ...DEFAULT_STORES,
  promoBoxCardStore: createDummyStore([]),
  inboxMessageCardStore: createDummyStore([]),
  inboxNotificationCardStore: createDummyStore([]),
}
