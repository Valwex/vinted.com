'use client'

import { useState } from 'react'
import { Icon } from '@vinted/web-ui'
import { BuyerProtectionShield32 } from '@vinted/multichrome-icons'
import { InfoCircle16 } from '@vinted/monochrome-icons'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import {
  NonShippingEscrowFeeModel,
  clickEvent,
} from '@marketplace-web/escrow-pricing/escrow-pricing-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'

import FeeDetails from '../FeeDetails'
import BuyerProtectionModal from '../../BuyerProtectionModal'

type Props = {
  buyerProtection?: NonShippingEscrowFeeModel
  isSellerBusiness: boolean
  itemId: number
  hideDiscounts: boolean
}

const BuyerProtectionFee = ({
  buyerProtection,
  isSellerBusiness,
  itemId,
  hideDiscounts,
}: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const translate = useTranslate('item_price_breakdown_detailed')
  const { track } = useTracking()

  if (!buyerProtection) return null

  const showDiscountNote = !!buyerProtection?.showPriceRangeRuleNote

  const protectionFeeTranslation = isSellerBusiness
    ? 'buyer_protection_fee_pro'
    : 'buyer_protection_fee'

  const handelInfoIconClick = () => {
    setIsModalVisible(true)

    track(
      clickEvent({
        screen: 'price_breakdown_modal',
        target: 'service_fee_info',
        targetDetails: JSON.stringify({
          item_id: itemId,
        }),
      }),
    )
  }

  const renderInfoIcon = () => (
    <>
      <button
        className="u-flexbox u-align-self-center u-cursor-pointer"
        data-testid="item-pricing-details-icon"
        onClick={handelInfoIconClick}
        type="button"
        aria-label={
          isSellerBusiness
            ? translate('actions.a11y.buyer_protection_pro_info')
            : translate('actions.a11y.buyer_protection_info')
        }
      >
        <Icon name={InfoCircle16} color="greyscale-level-2" />
      </button>
      <BuyerProtectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        sellerIsBusinessUser={isSellerBusiness}
      />
    </>
  )

  return (
    <FeeDetails
      testId="item-price-breakdown-service-fee-cell"
      feeTitle={translate(protectionFeeTranslation)}
      escrowFee={buyerProtection}
      prefix={
        <Icon
          name={BuyerProtectionShield32}
          aria={{
            'aria-hidden': 'true',
          }}
        />
      }
      infoIcon={renderInfoIcon()}
      hideDiscounts={hideDiscounts}
      discountNote={showDiscountNote ? translate('bpf_price_range_title') : null}
    />
  )
}

export default BuyerProtectionFee
