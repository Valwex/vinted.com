'use client'

import { Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'

type Props = {
  landingPageUri?: string
}

const DiscountTerms = ({ landingPageUri }: Props) => {
  const translate = useTranslate('item_price_breakdown_detailed')
  const isDiscountLinkEnabled = useFeatureSwitch('display_discount_links_in_price_breakdown')

  if (!landingPageUri || !isDiscountLinkEnabled) return null

  return (
    <Text
      as="div"
      type="subtitle"
      text={
        <a href={landingPageUri} target="_blank" rel="noopener noreferrer">
          {translate('discount_terms')}
        </a>
      }
      html
    />
  )
}

export default DiscountTerms
