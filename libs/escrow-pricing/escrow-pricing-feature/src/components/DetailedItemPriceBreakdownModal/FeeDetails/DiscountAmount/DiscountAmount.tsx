'use client'

import { Text } from '@vinted/web-ui'
import { useIntl } from 'react-intl'

import { CurrencyAmountModel, formatCurrencyAmount } from '@marketplace-web/currency/currency-data'

type Props = {
  originalPrice: CurrencyAmountModel
}

const DiscountAmount = ({ originalPrice }: Props) => {
  const { locale } = useIntl()

  return (
    <div aria-hidden className="u-padding-right-small">
      <Text
        as="div"
        theme="muted"
        type="subtitle"
        strikethrough
        text={formatCurrencyAmount(originalPrice, locale)}
      />
    </div>
  )
}

export default DiscountAmount
