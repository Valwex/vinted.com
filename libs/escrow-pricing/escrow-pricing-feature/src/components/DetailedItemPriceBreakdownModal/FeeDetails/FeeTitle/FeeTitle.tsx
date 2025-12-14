'use client'

import { ReactNode } from 'react'
import { Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

type Props = {
  isFree: boolean
  feeTitle: string
  shouldShowDiscount: boolean
  infoIcon: ReactNode
  discountPercentage: number | null
}

const FeeTitle = ({
  shouldShowDiscount,
  isFree,
  feeTitle,
  infoIcon,
  discountPercentage,
}: Props) => {
  const translate = useTranslate('item_price_breakdown_detailed')
  const discountText = isFree ? `${translate('is_free')}` : `(-${discountPercentage as number}%)`
  const titleForScreenReaders = `${feeTitle} ${shouldShowDiscount ? discountText : ''}`

  return (
    <div className="u-flexbox u-align-items-center u-gap-small">
      <h2 className="u-visually-hidden">{titleForScreenReaders}</h2>
      <span aria-hidden="true">{feeTitle}</span>
      {shouldShowDiscount && (
        <Text aria={{ 'aria-hidden': true }} as="span" theme="warning" text={discountText} />
      )}
      {infoIcon}
    </div>
  )
}

export default FeeTitle
