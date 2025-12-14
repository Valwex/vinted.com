'use client'

import { Button, Cell, Container, Dialog, Divider, Text } from '@vinted/web-ui'
import { useEffect, useRef } from 'react'

import { useFetch } from '@marketplace-web/core-api/api-client-util'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { ContentLoader } from '@marketplace-web/common-components/content-loader-ui'
import { ErrorState } from '@marketplace-web/error-display/error-display-feature'
import {
  EscrowFeesModel,
  getItemEscrowFees,
  getTransactionEscrowFees,
  transformItemEscrowFeesResponse,
} from '@marketplace-web/escrow-pricing/escrow-pricing-data'
import { useSession } from '@marketplace-web/shared/session-data'
import { ScrollableArea } from '@marketplace-web/common-components/scrollable-area-ui'
import { CurrencyAmountModel } from '@marketplace-web/currency/currency-data'

import { observeEscrowFeesLoadTime } from '../../utils/observability'
import type { FlowType } from '../../utils/observability'
import BuyerProtectionFee from './BuyerProtectionFee'
import ElectronicsVerificationFee from './ElectronicsVerificationFee'
import ItemDetails from './ItemDetails'
import ItemVerificationFee from './ItemVerificationFee'
import LegalNote from './LegalNote'
import ModalNavigation from './ModalNavigation'
import ShippingDetails from './ShippingDetails'
import { formatEscrowFeeFallback } from '../../utils/escrow-pricing'

type Props = {
  isVisible: boolean
  onClose: () => void
  itemPhotoSrc?: string | null
  itemPrice: string
  itemTitle?: string
  escrowFees?: EscrowFeesModel | null
  isItemOwner: boolean
  isSellerBusiness: boolean
  transactionId?: number
  itemId: number
  itemsCount?: number
  escrowNoteTranslationKey?: string | null
  serviceFee?: CurrencyAmountModel | null
}

const DetailedItemPriceBreakdownModal = ({
  isVisible,
  onClose,
  itemPrice,
  itemTitle,
  itemPhotoSrc,
  escrowFees: providedEscrowFees,
  isSellerBusiness,
  isItemOwner,
  transactionId,
  itemId,
  itemsCount,
  escrowNoteTranslationKey: providedEscrowNoteTranslationKey,
  serviceFee,
}: Props) => {
  const translate = useTranslate('item_price_breakdown_detailed')
  const loadStartTime = useRef<number>(performance.now())

  const {
    transformedData: transactionEscrowFees,
    fetch: fetchTransactionEscrowFees,
    isLoading: isTransactionEscrowFeesLoading,
  } = useFetch(getTransactionEscrowFees, transformItemEscrowFeesResponse)

  const {
    transformedData: itemEscrowFees,
    fetch: fetchItemEscrowFees,
    isLoading: isItemEscrowFeesLoading,
  } = useFetch(getItemEscrowFees, transformItemEscrowFeesResponse)

  useEffect(() => {
    if (providedEscrowFees || !isVisible) return

    const observeLoadEnd = ({
      isSuccess,
      flowType,
    }: {
      isSuccess: boolean
      flowType: FlowType
    }) => {
      const escrowFeesLoadingTime = performance.now() - loadStartTime.current

      observeEscrowFeesLoadTime({ isSuccess, flowType, loadTime: escrowFeesLoadingTime })
    }

    if (transactionId) {
      fetchTransactionEscrowFees({ transactionId }).then(({ data }) => {
        observeLoadEnd({ isSuccess: !!data, flowType: 'transaction' })
      })
    } else {
      fetchItemEscrowFees({ itemId }).then(({ data }) => {
        observeLoadEnd({ isSuccess: !!data, flowType: 'item' })
      })
    }
  }, [
    providedEscrowFees,
    transactionId,
    isVisible,
    fetchTransactionEscrowFees,
    itemId,
    fetchItemEscrowFees,
  ])

  const escrowFees =
    providedEscrowFees ||
    transactionEscrowFees ||
    itemEscrowFees ||
    (serviceFee && formatEscrowFeeFallback(serviceFee))
  const { user } = useSession()
  const isUserLoggedIn = !!user
  const hideDiscounts = isItemOwner || !isUserLoggedIn

  const renderContent = () => {
    if (isTransactionEscrowFeesLoading || isItemEscrowFeesLoading) return <ContentLoader />
    if (!escrowFees) return <ErrorState />

    return (
      <>
        <Container styling="narrow">
          <ItemDetails
            itemPrice={itemPrice}
            itemTitle={itemTitle}
            itemPhotoSrc={itemPhotoSrc}
            itemsCount={itemsCount}
          />
          <BuyerProtectionFee
            buyerProtection={escrowFees.buyerProtection}
            isSellerBusiness={isSellerBusiness}
            itemId={itemId}
            hideDiscounts={hideDiscounts}
          />
        </Container>
        <Divider />
        <Container styling="narrow">
          <Cell styling="narrow">
            <Text text={translate('selected_at_checkout_title')} type="subtitle" as="label" />
          </Cell>
          <ItemVerificationFee
            itemVerification={escrowFees.itemVerification}
            hideDiscounts={hideDiscounts}
            itemId={itemId}
          />
          <ElectronicsVerificationFee
            electronicsVerificationFee={escrowFees.electronicsVerification}
            hideDiscounts={hideDiscounts}
            isItemOwner={isItemOwner}
            itemId={itemId}
          />
          <ShippingDetails shippingFee={escrowFees.shipping} hideDiscounts={hideDiscounts} />
        </Container>
        <LegalNote
          isSellerBusiness={isSellerBusiness}
          additionalNote={providedEscrowNoteTranslationKey || escrowFees.noteTranslationKey}
        />
      </>
    )
  }

  return (
    <Dialog hasScrollableContent testId="detailed-item-price-breakdown" show={isVisible}>
      <div className="u-fill-width">
        <ModalNavigation onClose={onClose} />
        <ScrollableArea>{renderContent()}</ScrollableArea>
        <Container styling="narrow">
          <Cell styling="narrow">
            <Button
              text={translate('actions.close')}
              styling="filled"
              onClick={onClose}
              testId="item-price-breakdown-close-button"
            />
          </Cell>
        </Container>
      </div>
    </Dialog>
  )
}

export default DetailedItemPriceBreakdownModal
