'use client'

import { Cell, Text, Icon } from '@vinted/web-ui'
import { Box32 } from '@vinted/multichrome-icons'
import { useIntl } from 'react-intl'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { EscrowShippingFeeModel } from '@marketplace-web/escrow-pricing/escrow-pricing-data'
import { formatCurrencyAmount } from '@marketplace-web/currency/currency-data'

type Props = {
  shippingFee: EscrowShippingFeeModel
  hideDiscounts: boolean
}

const ShippingDetails = ({ shippingFee, hideDiscounts }: Props) => {
  const translate = useTranslate('item_price_breakdown_detailed.shipping_info')
  const { locale } = useIntl()

  const shouldShowDiscount = !hideDiscounts && !!shippingFee?.maxDiscountPercentage
  const titleForScreenReaders = `${translate('title')} ${
    shouldShowDiscount
      ? `${translate('percentage_discount', {
          discount: shippingFee.maxDiscountPercentage,
        })}`
      : ''
  }`

  if (shippingFee) {
    const renderTitle = () => (
      <>
        <h2 className="u-visually-hidden">{titleForScreenReaders}</h2>
        <div aria-hidden="true" className="u-flexbox u-align-items-center u-gap-small">
          {translate('title')}
          {shouldShowDiscount && (
            <Text
              as="span"
              testId="shipping-details-discount-amount"
              theme="warning"
              text={`${translate('percentage_discount', {
                discount: shippingFee.maxDiscountPercentage,
              })}`}
            />
          )}
        </div>
      </>
    )

    return (
      <Cell
        testId="item-price-breakdown-shipping-note"
        styling="narrow"
        prefix={<Icon name={Box32} />}
        title={renderTitle()}
        body={
          <div>
            <div>
              <Text
                as="div"
                type="title"
                theme="amplified"
                text={`${translate('from_price', {
                  price: formatCurrencyAmount(shippingFee.finalPrice, locale),
                })}`}
              />
            </div>
            <div>
              <Text as="div" text={translate('text')} type="subtitle" theme="muted" />
            </div>
          </div>
        }
      />
    )
  }

  return (
    <Cell
      testId="item-price-breakdown-static-note"
      styling="narrow"
      prefix={
        <Icon
          name={Box32}
          aria={{
            'aria-hidden': 'true',
          }}
        />
      }
      title={translate('title')}
      body={<Text as="div" text={translate('text')} type="subtitle" theme="muted" />}
    />
  )
}

export default ShippingDetails
