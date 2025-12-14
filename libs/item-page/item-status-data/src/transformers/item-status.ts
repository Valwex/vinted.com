import { ItemAlertStatus } from '../constants/item-status'
import { ItemStatus } from '../types/item-status'

export const transformAlertToItemStatus = (alert: ItemAlertStatus): ItemStatus => {
  switch (alert) {
    case ItemAlertStatus.DarkGray:
      return 'hidden_from_catalog'
    case ItemAlertStatus.DelayedPublication:
    case ItemAlertStatus.ManualDelayedPublication:
      return 'delayed'
    default:
      return alert
  }
}
