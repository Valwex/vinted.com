import { ProductItemModel } from '../types/product-item'
import { ItemAlertStatus } from '../types/item-alert'
import { ItemStatus } from '../types/item-status'
import { transformAlertToItemStatus } from '../transformers/item-status'

export const getProductItemStatus = (
  item: ProductItemModel,
  showSensitive = false,
): ItemStatus | null => {
  const {
    isDraft,
    isReserved,
    isHidden,
    isClosed,
    canPushUp,
    areStatsVisible,
    itemAlertType,
    itemAlert,
    itemClosingAction,
    isProcessing,
    isPromoted,
  } = item

  if (isProcessing) return 'processing'
  if (
    itemAlert?.itemAlertType &&
    showSensitive &&
    itemAlert.itemAlertType !== ItemAlertStatus.EligibleForAuthenticity &&
    itemAlert.itemAlertType !== ItemAlertStatus.VerifiedOnlineAuthenticity
  ) {
    return transformAlertToItemStatus(itemAlert.itemAlertType)
  }
  if (itemAlertType && showSensitive) return transformAlertToItemStatus(itemAlertType)
  if (isDraft) return 'draft'
  if (isClosed && itemClosingAction) {
    return itemClosingAction
  }
  if (isReserved) return 'reserved'
  if (isHidden) return 'hidden'
  if (!areStatsVisible) return null
  if (!showSensitive) return null
  if (canPushUp) return null
  if (isPromoted) return 'bumped'

  return null
}
