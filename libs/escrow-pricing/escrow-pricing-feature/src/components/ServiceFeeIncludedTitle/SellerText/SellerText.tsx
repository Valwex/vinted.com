'use client'

import { Spacer, Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

type Props = {
  shouldMinimiseTitle?: boolean
}

const SellerText = ({ shouldMinimiseTitle }: Props) => {
  const translate = useTranslate('item.includes_buyer_protection')
  const getTextSize = () => (shouldMinimiseTitle ? 'caption' : 'subtitle')

  return (
    <>
      <Spacer size="x-small" orientation="vertical" />
      <Text
        clickable
        underline={false}
        text={translate('price_for_buyer')}
        type={getTextSize()}
        as="p"
      />
    </>
  )
}

export default SellerText
