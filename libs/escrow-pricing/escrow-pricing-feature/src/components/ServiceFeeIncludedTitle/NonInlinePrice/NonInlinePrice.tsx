'use client'

import { KeyboardEvent } from 'react'
import { Icon, Text } from '@vinted/web-ui'
import { Shield12 } from '@vinted/monochrome-icons'
import { useIntl } from 'react-intl'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { CurrencyAmountModel, formatCurrencyAmount } from '@marketplace-web/currency/currency-data'

import ServiceTitle from '../ServiceTitle'
import SellerText from '../SellerText'

type Props = {
  isItemOwner?: boolean
  isSellerBusiness: boolean
  totalItemPrice: CurrencyAmountModel
  shouldTrimTitle?: boolean
  shouldMinimiseTitle?: boolean
  onClick: () => void
  onKeyDown: (event: KeyboardEvent) => void
}

const NonInlinePrice = ({
  totalItemPrice,
  isItemOwner,
  isSellerBusiness,
  shouldTrimTitle,
  shouldMinimiseTitle,
  onClick,
  onKeyDown,
}: Props) => {
  const translate = useTranslate('item.includes_buyer_protection')
  const { locale } = useIntl()

  const formattedTotalPrice = formatCurrencyAmount(totalItemPrice, locale)

  return (
    <button
      tabIndex={0}
      aria-label={translate('title', { price: formattedTotalPrice })}
      onKeyDown={onKeyDown}
      onClick={onClick}
      type="button"
      className="u-text-left"
    >
      <Text
        as="div"
        type="title"
        text={formattedTotalPrice}
        clickable
        underline={false}
        tabIndex={-1}
      />
      <div>
        <span className="service-fee-included-title--text">
          <ServiceTitle
            isItemOwner={isItemOwner}
            isSellerBusiness={isSellerBusiness}
            shouldMinimiseTitle={shouldMinimiseTitle}
            shouldTrimTitle={shouldTrimTitle}
            inline
          />
        </span>
        <span className="service-fee-included-title--icon">
          <Icon color="primary-default" name={Shield12} testId="service-fee-included-icon" />
        </span>
        {isItemOwner && <SellerText shouldMinimiseTitle={shouldMinimiseTitle} />}
      </div>
    </button>
  )
}

export default NonInlinePrice
