import { Badge } from '@vinted/web-ui'

import { ItemAlertDto, ItemAlertStatus } from '../constants/item-status'
import { ItemStatus } from '../types/item-status'
import { transformAlertToItemStatus } from '../transformers/item-status'

type ItemStatusProps = {
  isDraft?: boolean
  isReserved?: boolean
  isHidden?: boolean
  isClosed?: boolean
  itemClosingAction?: 'sold' | null
  statsVisible?: boolean
  itemAlertType?: ItemAlertStatus
  itemAlert?: ItemAlertDto
  isProcessing?: boolean
  promoted?: boolean
}

const getItemStatus = (
  item: ItemStatusProps,
  showSensitive = false,
): ItemStatus | null | undefined => {
  const {
    isDraft,
    isReserved,
    isHidden,
    isClosed,
    itemClosingAction,
    statsVisible,
    itemAlertType,
    itemAlert,
    isProcessing,
    promoted,
  } = item

  if (isProcessing) return 'processing'
  if (
    itemAlert?.item_alert_type &&
    showSensitive &&
    itemAlert.item_alert_type !== ItemAlertStatus.EligibleForAuthenticity &&
    itemAlert.item_alert_type !== ItemAlertStatus.VerifiedOnlineAuthenticity
  ) {
    return transformAlertToItemStatus(itemAlert.item_alert_type)
  }
  if (itemAlertType && showSensitive) return transformAlertToItemStatus(itemAlertType)
  if (isDraft) return 'draft'
  if (isClosed) {
    return itemClosingAction
  }
  if (isReserved) return 'reserved'
  if (isHidden) return 'hidden'
  if (!statsVisible || !showSensitive) return null
  if (promoted) return 'bumped'

  return null
}

const getItemStatusMessage = (status: ItemStatus | null | undefined) => {
  if (!status) return null

  let theme: NonNullable<React.ComponentProps<typeof Badge>['theme']> | null = null
  let content = `item.status.${status}`

  switch (status) {
    case 'processing':
      content = 'item.status.processing'
      theme = 'amplified'
      break

    case 'reserved':
      theme = 'amplified'
      break

    case 'bumped':
      theme = 'primary'
      break

    case 'draft':
    case 'hidden':
      theme = 'muted'
      break

    case 'sold':
      theme = 'success'
      break

    case 'missing_subcategory':
    case 'change_description':
    case 'hidden_from_catalog':
    case 'package_size':
      theme = 'warning'
      break

    case 'delayed':
      content = 'item.status.delayed'
      theme = 'amplified'
      break

    case ItemAlertStatus.UnderReview:
      content = 'item.status.under_review'
      theme = 'amplified'
      break

    case ItemAlertStatus.ReplicaProof:
      content = 'item.status.hidden'
      theme = 'warning'
      break

    default:
      theme = null
  }

  if (theme === null) return null

  return {
    content,
    theme,
  }
}

export { getItemStatus, getItemStatusMessage }
