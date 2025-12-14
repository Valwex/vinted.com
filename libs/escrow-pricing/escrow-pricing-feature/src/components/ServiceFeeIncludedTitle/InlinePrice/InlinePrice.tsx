'use client'

import { KeyboardEvent } from 'react'
import { Icon, Spacer, Text } from '@vinted/web-ui'
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
  isDisabled?: boolean
}

const InlinePrice = ({
  totalItemPrice,
  isItemOwner,
  isSellerBusiness,
  shouldTrimTitle,
  shouldMinimiseTitle,
  onClick,
  onKeyDown,
  isDisabled,
}: Props) => {
  const translate = useTranslate('item.includes_buyer_protection')
  const { locale } = useIntl()

  const formattedTotalPrice = formatCurrencyAmount(totalItemPrice, locale)

  const renderContent = () => (
    <>
      <span className="u-flexbox u-align-items-baseline u-flex-wrap">
        <Text
          type={shouldMinimiseTitle ? 'subtitle' : 'body'}
          text={formattedTotalPrice}
          underline={false}
          as="span"
          clickable={!isDisabled}
          theme={isDisabled ? 'amplified' : undefined}
        />
        <Spacer size="x-small" orientation="vertical" as="span" />
        <ServiceTitle
          isItemOwner={isItemOwner}
          isSellerBusiness={isSellerBusiness}
          shouldMinimiseTitle={shouldMinimiseTitle}
          shouldTrimTitle={shouldTrimTitle}
          isDisabled={isDisabled}
        />
      </span>
      <Spacer size="x-small" orientation="vertical" as="span" />
      <Icon
        color={isDisabled ? 'greyscale-level-1' : 'primary-default'}
        name={Shield12}
        testId="service-fee-included-icon"
      />
    </>
  )

  if (isDisabled) {
    return (
      <div className="u-flexbox u-align-items-flex-start">
        <div
          className="u-flexbox u-align-items-center u-flex-wrap"
          aria-label={translate('title', { price: formattedTotalPrice })}
        >
          {renderContent()}
        </div>
      </div>
    )
  }

  return (
    <div className="u-flexbox u-align-items-flex-start">
      <button
        className="u-flexbox u-align-items-center u-flex-wrap"
        tabIndex={0}
        aria-label={translate('title', { price: formattedTotalPrice })}
        onKeyDown={onKeyDown}
        onClick={onClick}
        type="button"
      >
        {renderContent()}
        {isItemOwner && <SellerText shouldMinimiseTitle={shouldMinimiseTitle} />}
      </button>
    </div>
  )
}

export default InlinePrice
