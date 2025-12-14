'use client'

import { KeyboardEvent, useState } from 'react'
import { useIntl } from 'react-intl'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { KeyboardKey, onA11yKeyDown } from '@marketplace-web/vendor-abstractions/web-ui-util'
import { CurrencyAmountModel, formatCurrencyAmount } from '@marketplace-web/currency/currency-data'
import { clickEvent, EscrowFeesModel } from '@marketplace-web/escrow-pricing/escrow-pricing-data'

import DetailedItemPriceBreakdownModal from '../DetailedItemPriceBreakdownModal'
import InlinePrice from './InlinePrice'
import NonInlinePrice from './NonInlinePrice'

type Props = {
  itemId: number
  isItemOwner?: boolean
  itemPrice: CurrencyAmountModel
  isSellerBusiness: boolean
  totalItemPrice?: CurrencyAmountModel | null
  serviceFee?: CurrencyAmountModel | null
  shouldTrimTitle?: boolean
  shouldMinimiseTitle?: boolean
  onModalOpen?: () => void
  onModalClose?: () => void
  itemPhotoSrc?: string | null
  escrowFees?: EscrowFeesModel | null
  itemTitle?: string
  transactionId?: number
  itemsCount?: number
  showInclinePrice?: boolean
  isDisabled?: boolean
  escrowNoteTranslationKey?: string
}

const ServiceFeeIncludedTitle = ({
  itemId,
  totalItemPrice,
  itemPrice,
  serviceFee,
  isItemOwner,
  isSellerBusiness,
  shouldTrimTitle,
  shouldMinimiseTitle,
  onModalOpen,
  onModalClose,
  itemPhotoSrc,
  escrowFees,
  itemTitle,
  transactionId,
  itemsCount,
  showInclinePrice = true,
  isDisabled,
  escrowNoteTranslationKey,
}: Props) => {
  const [isPriceBreakdownModalOpen, setIsPriceBreakdownModalOpen] = useState(false)

  const { track } = useTracking()
  const { locale } = useIntl()

  const formattedItemPrice = formatCurrencyAmount(itemPrice, locale)

  const handleClick = () => {
    if (isDisabled) return

    track(
      clickEvent({
        target: 'pricing_details',
        targetDetails: JSON.stringify({ item_id: itemId }),
      }),
    )

    if (isPriceBreakdownModalOpen) onModalClose?.()
    else onModalOpen?.()

    setIsPriceBreakdownModalOpen(prevState => !prevState)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    onA11yKeyDown(event, { keys: [KeyboardKey.Enter, KeyboardKey.Space] }, handleClick)
  }

  if (!totalItemPrice?.amount) return null

  const priceProps = {
    onKeyDown: handleKeyDown,
    onClick: handleClick,
    isSellerBusiness,
    totalItemPrice,
    isItemOwner,
    shouldMinimiseTitle,
    shouldTrimTitle,
  }

  return (
    <>
      {showInclinePrice ? (
        <InlinePrice {...priceProps} isDisabled={isDisabled} />
      ) : (
        <NonInlinePrice {...priceProps} />
      )}
      <DetailedItemPriceBreakdownModal
        itemTitle={itemTitle}
        itemPhotoSrc={itemPhotoSrc}
        escrowFees={escrowFees}
        transactionId={transactionId}
        itemsCount={itemsCount}
        isVisible={isPriceBreakdownModalOpen}
        itemPrice={formattedItemPrice}
        onClose={handleClick}
        isSellerBusiness={isSellerBusiness}
        isItemOwner={!!isItemOwner}
        itemId={itemId}
        escrowNoteTranslationKey={escrowNoteTranslationKey}
        serviceFee={serviceFee}
      />
    </>
  )
}

export default ServiceFeeIncludedTitle
