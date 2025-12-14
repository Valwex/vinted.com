'use client'

import { useIntl } from 'react-intl'
import { Text, List } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

type Props = {
  discountStartDate?: string
  discountEndDate?: string
}

const DiscountDates = ({ discountStartDate, discountEndDate }: Props) => {
  const { formatDate, formatTime } = useIntl()
  const translate = useTranslate('item_price_breakdown_detailed')

  if (!discountStartDate || !discountEndDate) return null

  const formattedDateTimeText = (date: string) =>
    `${formatDate(date, {
      day: 'numeric',
      month: 'short',
    })} ${formatTime(date)}`

  return (
    <List.Item>
      <Text
        as="div"
        theme="muted"
        type="subtitle"
        text={translate('promotion_period', {
          dateFrom: formattedDateTimeText(discountStartDate),
          dateTo: formattedDateTimeText(discountEndDate),
        })}
      />
    </List.Item>
  )
}

export default DiscountDates
