'use client'

import { useIntl } from 'react-intl'
import { List, Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { formatCurrencyAmount, CurrencyAmountModel } from '@marketplace-web/currency/currency-data'

type Props = {
  lowestPrice30Days?: CurrencyAmountModel
}

const LowestPrice30Days = ({ lowestPrice30Days }: Props) => {
  const translate = useTranslate('item_price_breakdown_detailed')
  const { locale } = useIntl()

  if (!lowestPrice30Days) return null

  return (
    <List.Item>
      <Text
        as="div"
        theme="muted"
        type="subtitle"
        text={translate('lowest_price_in_30_days_header', {
          amount: formatCurrencyAmount(lowestPrice30Days, locale),
        })}
      />
    </List.Item>
  )
}

export default LowestPrice30Days
