'use client'

import { useIntl } from 'react-intl'

import {
  ItemBoxPriceBreakdown,
  ItemBoxPricing,
} from '@marketplace-web/escrow-pricing/escrow-pricing-feature'
import { CurrencyAmountModel, HomepageItemModel } from '@marketplace-web/home/home-page-data'

import { InformationBreakdown as InformationBreakdownComponent } from '@marketplace-web/item-box/item-box-feature'

const formatCurrency = (
  rawValue: string | number | null | undefined,
  props: { locale: string; currency: string },
) => {
  const { locale, currency } = props

  const value = rawValue || 0
  const numberValue = Number(value)

  return new Intl.NumberFormat(locale, {
    currency,
    style: 'currency',
    useGrouping: false,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue)
}

const formatCurrencyAmount = (rawValue: CurrencyAmountModel, locale: string) =>
  formatCurrency(rawValue.amount, { locale, currency: rawValue.currencyCode })

type Props = {
  item: HomepageItemModel
}

const InformationBreakdown = (props: Props) => {
  const { locale } = useIntl()
  const { item } = props

  return (
    <InformationBreakdownComponent
      description={{
        title: item.itemBox?.firstLine || '',
        subtitle: item.itemBox?.secondLine || '',
      }}
      testId="homepage-accepted-offer-widget-price-breakdown"
      renderPriceBreakdown={
        <ItemBoxPriceBreakdown
          {...item}
          itemTitle={item.title}
          itemPhotoSrc={item.thumbnailUrl}
          testId="homepage-accepted-offer-widget-price-breakdown"
        />
      }
      renderPrice={
        <ItemBoxPricing
          price={formatCurrencyAmount(item.priceWithDiscount || item.price, locale)}
          oldPrice={item.priceWithDiscount ? formatCurrencyAmount(item.price, locale) : null}
          testId="homepage-accepted-offer-widget-price"
        />
      }
      actions={item.itemBox?.actions}
      itemId={item.itemBox?.itemId}
    />
  )
}

export default InformationBreakdown
