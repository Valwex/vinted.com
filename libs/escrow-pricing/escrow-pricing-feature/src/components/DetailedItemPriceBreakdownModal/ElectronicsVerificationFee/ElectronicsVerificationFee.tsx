'use client'

import { useState } from 'react'
import { Icon } from '@vinted/web-ui'
import { ElectronicsBadgeMultichrome32 } from '@vinted/multichrome-icons'
import { InfoCircle16 } from '@vinted/monochrome-icons'

import {
  NonShippingEscrowFeeModel,
  clickEvent,
} from '@marketplace-web/escrow-pricing/escrow-pricing-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'

import FeeDetails from '../FeeDetails'
import ElectronicsVerificationModal from '../../ElectronicsVerificationModal'

type Props = {
  electronicsVerificationFee: NonShippingEscrowFeeModel
  hideDiscounts: boolean
  itemId: number
  isItemOwner: boolean
}

const ElectronicsVerificationFee = ({
  electronicsVerificationFee,
  hideDiscounts,
  itemId,
  isItemOwner,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const translate = useTranslate('item_price_breakdown_detailed')
  const { track } = useTracking()

  if (!electronicsVerificationFee) return null

  const handelInfoIconClick = () => {
    setIsModalOpen(true)

    track(
      clickEvent({
        screen: 'price_breakdown_modal',
        target: isItemOwner ? 'electronics_verification_seller' : 'electronics_verification_buyer',
        targetDetails: JSON.stringify({
          item_id: itemId,
        }),
      }),
    )
  }

  const renderInfoIcon = () => (
    <>
      <button
        className="u-flexbox u-align-items-center u-cursor-pointer"
        onClick={handelInfoIconClick}
        type="button"
        aria-label={translate('actions.a11y.electronics_verification_info')}
      >
        <Icon
          color="greyscale-level-2"
          name={InfoCircle16}
          testId="electronics-verification-info-icon"
        />
      </button>
      <ElectronicsVerificationModal
        show={isModalOpen}
        verificationFee={electronicsVerificationFee.finalPrice}
        onClose={() => setIsModalOpen(false)}
        isViewingOwnItem={isItemOwner}
        screen="price_breakdown_modal"
      />
    </>
  )

  return (
    <FeeDetails
      testId="item-price-breakdown-electronics-verification-cell"
      feeTitle={translate('electronics_verification')}
      escrowFee={electronicsVerificationFee}
      prefix={
        <Icon
          name={ElectronicsBadgeMultichrome32}
          aria={{
            'aria-hidden': 'true',
          }}
        />
      }
      infoIcon={renderInfoIcon()}
      hideDiscounts={hideDiscounts}
      noteText={
        isItemOwner ? translate('electronics_verification_seller_info') : translate('optional')
      }
    />
  )
}

export default ElectronicsVerificationFee
