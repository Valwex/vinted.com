'use client'

import { ReactNode } from 'react'
import { Cell, Text, List } from '@vinted/web-ui'
import { useIntl } from 'react-intl'

import { formatCurrencyAmount } from '@marketplace-web/currency/currency-data'
import { NonShippingEscrowFeeModel } from '@marketplace-web/escrow-pricing/escrow-pricing-data'

import DiscountDates from './DiscountDates'
import LowestPrice30Days from './LowestPrice30Days'
import FeeTitle from './FeeTitle'
import DiscountAmount from './DiscountAmount'
import DiscountNote from './DiscountNote'
import FeeNote from './FeeNote'
import DiscountTerms from './DiscountTerms'

type Props = {
  feeTitle: string
  prefix: ReactNode
  infoIcon: ReactNode
  escrowFee: NonShippingEscrowFeeModel
  discountNote?: string | null
  testId: string
  noteText?: string
  hideDiscounts: boolean
}

const FeeDetails = ({
  feeTitle,
  prefix,
  infoIcon,
  escrowFee,
  discountNote,
  testId,
  noteText,
  hideDiscounts,
}: Props) => {
  const { locale } = useIntl()

  if (!escrowFee) return null

  const {
    discountPercentage,
    isFree,
    finalPrice,
    originalPrice,
    discountStartDate,
    discountEndDate,
    lowestPrice30Days,
    landingPageUri,
  } = escrowFee

  const shouldShowDiscount = !!discountPercentage && !hideDiscounts

  const renderDiscountDetails = () => (
    <>
      <DiscountNote discountNote={discountNote} />
      <DiscountDates discountStartDate={discountStartDate} discountEndDate={discountEndDate} />
      <LowestPrice30Days lowestPrice30Days={lowestPrice30Days} />
      <DiscountTerms landingPageUri={landingPageUri} />
    </>
  )

  return (
    <Cell
      testId={testId}
      styling="narrow"
      title={
        <FeeTitle
          feeTitle={feeTitle}
          isFree={isFree}
          discountPercentage={discountPercentage}
          shouldShowDiscount={shouldShowDiscount}
          infoIcon={infoIcon}
        />
      }
      prefix={prefix}
      body={
        <>
          <div className="u-flexbox u-gap-small">
            <Text
              as="div"
              text={formatCurrencyAmount(finalPrice, locale)}
              type="title"
              theme="amplified"
            />
            {shouldShowDiscount && <DiscountAmount originalPrice={originalPrice} />}
          </div>
          {(shouldShowDiscount || noteText) && (
            <List size="tight">
              <FeeNote noteText={noteText} />
              {shouldShowDiscount && renderDiscountDetails()}
            </List>
          )}
        </>
      }
    />
  )
}

export default FeeDetails
