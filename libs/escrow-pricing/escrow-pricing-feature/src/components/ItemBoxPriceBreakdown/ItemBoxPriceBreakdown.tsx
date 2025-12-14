'use client'

import { Spacer } from '@vinted/web-ui'

import { useSession } from '@marketplace-web/shared/session-data'
import { getTestId } from '@marketplace-web/vendor-abstractions/web-ui-util'
import { CurrencyAmountModel } from '@marketplace-web/currency/currency-data'
import { ProductItemUserModel } from '@marketplace-web/item-box/product-item-data'

import ServiceFeeIncludedTitle from '../ServiceFeeIncludedTitle'

type Props = {
  serviceFee?: CurrencyAmountModel | null
  id: number
  price: CurrencyAmountModel
  totalItemPrice?: CurrencyAmountModel
  user: ProductItemUserModel
  priceWithDiscount?: CurrencyAmountModel | null
  testId: string
  itemTitle: string
  itemPhotoSrc: string | null
}

const ItemBoxPriceBreakdown = ({
  serviceFee,
  id,
  price,
  totalItemPrice,
  user,
  priceWithDiscount,
  testId,
  itemTitle,
  itemPhotoSrc,
}: Props) => {
  const { user: currentUser } = useSession()

  const isViewingSelf = currentUser?.id === user.id
  const showPriceBreakdownChanges = !!serviceFee && !isViewingSelf

  if (!showPriceBreakdownChanges) return null

  return (
    <div data-testid={getTestId(testId, 'breakdown')}>
      <ServiceFeeIncludedTitle
        itemId={id}
        itemPrice={priceWithDiscount || price}
        serviceFee={serviceFee}
        totalItemPrice={totalItemPrice}
        isSellerBusiness={!!user.isBusiness}
        shouldTrimTitle
        shouldMinimiseTitle
        itemTitle={itemTitle}
        itemPhotoSrc={itemPhotoSrc}
      />
      <Spacer size="small" />
    </div>
  )
}

export default ItemBoxPriceBreakdown
