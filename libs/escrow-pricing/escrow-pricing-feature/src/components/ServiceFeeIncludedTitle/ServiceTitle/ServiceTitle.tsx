'use client'

import { Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

type Props = {
  isItemOwner?: boolean
  isSellerBusiness: boolean
  shouldTrimTitle?: boolean
  shouldMinimiseTitle?: boolean
  inline?: boolean
  isDisabled?: boolean
}

const ServiceTitle = ({
  isItemOwner,
  shouldTrimTitle,
  isSellerBusiness,
  shouldMinimiseTitle,
  inline,
  isDisabled = false,
}: Props) => {
  const translate = useTranslate('item.includes_buyer_protection')
  const getTextSize = () => (shouldMinimiseTitle ? 'caption' : 'subtitle')
  const userTypeSuffix = isSellerBusiness ? '_pro' : ''

  const titleTestId = isSellerBusiness
    ? 'service-fee-included-title-pro'
    : 'service-fee-included-title'

  const formatTitle = () => {
    const isTrimmed = shouldTrimTitle || isItemOwner ? '_trimmed' : ''

    return translate(`title_without_price${userTypeSuffix}${isTrimmed}`)
  }

  return (
    <Text
      underline={false}
      text={formatTitle()}
      type={getTextSize()}
      testId={titleTestId}
      inline={inline}
      as="span"
      tabIndex={-1}
      clickable={!isDisabled}
      theme={isDisabled ? 'amplified' : undefined}
    />
  )
}

export default ServiceTitle
