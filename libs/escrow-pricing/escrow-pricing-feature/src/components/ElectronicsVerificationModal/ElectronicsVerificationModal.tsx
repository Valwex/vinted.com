'use client'

import { CurrencyAmountModel } from '@marketplace-web/currency/currency-data'
import { TrackingEvent } from '@marketplace-web/observability/event-tracker-data'

import ElectronicsVerificationModalBuyer from '../ElectronicsVerificationBuyerModal'
import ElectronicsVerificationSellerModal from '../ElectronicsVerificationSellerModal'

type Props = {
  show: boolean
  isViewingOwnItem: boolean
  onClose: () => void
  verificationFee?: CurrencyAmountModel
  screen: string
  /** Optionally overrides the default user.view tracking event that is triggered when the modal is in view. */
  viewEvent?: TrackingEvent
}

const ElectronicsVerificationModal = (props: Props) => {
  const { isViewingOwnItem, ...rest } = props

  if (isViewingOwnItem) {
    return <ElectronicsVerificationSellerModal {...rest} />
  }

  return <ElectronicsVerificationModalBuyer {...rest} />
}

export default ElectronicsVerificationModal
