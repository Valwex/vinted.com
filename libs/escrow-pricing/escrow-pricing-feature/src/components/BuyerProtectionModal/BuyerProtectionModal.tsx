'use client'

import { useEffect } from 'react'
import { Cell, Dialog } from '@vinted/web-ui'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { clickEvent } from '@marketplace-web/escrow-pricing/escrow-pricing-data'

import NavigationCloseButton from './NavigationCloseButton'
import CloseButton from './CloseButton'
import ScrollableContentArea from './ScrollableContentArea'

type Props = {
  isVisible: boolean
  sellerIsBusinessUser: boolean
  onClose: () => void
  onServiceFeeHelpUrlClick?: () => void
  onModalView?: () => void
  onRefundPolicyClick?: () => void
  onRefundPolicyProClick?: () => void
  onRefundPolicyProWithdrawalClick?: () => void
}

const BuyerProtectionModal = ({
  isVisible,
  sellerIsBusinessUser,
  onClose,
  onServiceFeeHelpUrlClick,
  onModalView,
  onRefundPolicyClick,
  onRefundPolicyProClick,
  onRefundPolicyProWithdrawalClick,
}: Props) => {
  useEffect(() => {
    if (!isVisible) return

    onModalView?.()
  }, [isVisible, onModalView])

  const { track } = useTracking()

  const translationsPrefix = sellerIsBusinessUser
    ? 'buyer_protection_dialog.buyer_protection_info_business'
    : 'buyer_protection_dialog.buyer_protection_info'

  const handleClose = () => {
    track(
      clickEvent({
        screen: 'escrow_fee_education',
        target: 'close_screen',
      }),
    )

    onClose()
  }

  return (
    <Dialog hasScrollableContent show={isVisible} testId="service-fee-modal">
      <div>
        <NavigationCloseButton handleClose={handleClose} />

        <ScrollableContentArea
          sellerIsBusinessUser={sellerIsBusinessUser}
          translationsPrefix={translationsPrefix}
          onServiceFeeHelpUrlClick={onServiceFeeHelpUrlClick}
          onRefundPolicyClick={onRefundPolicyClick}
          onRefundPolicyProClick={onRefundPolicyProClick}
          onRefundPolicyProWithdrawalClick={onRefundPolicyProWithdrawalClick}
        />

        <Cell>
          <CloseButton translationsPrefix={translationsPrefix} handleClose={handleClose} />
        </Cell>
      </div>
    </Dialog>
  )
}

export default BuyerProtectionModal
