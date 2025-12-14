'use client'

import { useState } from 'react'
import { Icon } from '@vinted/web-ui'
import { AuthenticityDiamond32 } from '@vinted/multichrome-icons'
import { InfoCircle16 } from '@vinted/monochrome-icons'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import {
  clickEvent,
  NonShippingEscrowFeeModel,
} from '@marketplace-web/escrow-pricing/escrow-pricing-data'

import FeeDetails from '../FeeDetails'
import ItemVerificationBuyerModal from '../../ItemVerificationBuyerModal'

type Props = {
  itemVerification: NonShippingEscrowFeeModel
  hideDiscounts: boolean
  itemId: number
}

const ItemVerificationFee = ({ itemVerification, hideDiscounts, itemId }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const translate = useTranslate('item_price_breakdown_detailed')
  const { track } = useTracking()

  if (!itemVerification) return null

  const handelInfoIconClick = () => {
    setIsModalOpen(true)

    track(
      clickEvent({
        screen: 'price_breakdown_modal',
        target: 'item_verification_fee_info',
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
        aria-label={translate('actions.a11y.item_verification_info')}
      >
        <Icon color="greyscale-level-2" name={InfoCircle16} testId="item-verification-info-icon" />
      </button>
      <ItemVerificationBuyerModal
        show={isModalOpen}
        verificationFee={itemVerification.finalPrice}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )

  return (
    <FeeDetails
      testId="item-price-breakdown-item-verification-cell"
      feeTitle={translate('item_verification')}
      escrowFee={itemVerification}
      prefix={
        <Icon
          name={AuthenticityDiamond32}
          aria={{
            'aria-hidden': 'true',
          }}
        />
      }
      infoIcon={renderInfoIcon()}
      hideDiscounts={hideDiscounts}
      noteText={translate('optional')}
    />
  )
}

export default ItemVerificationFee
