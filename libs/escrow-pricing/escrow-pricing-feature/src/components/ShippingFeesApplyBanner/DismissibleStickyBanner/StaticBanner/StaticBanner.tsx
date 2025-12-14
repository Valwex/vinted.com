'use client'

import { Card, Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

import CloseButton from '../CloseButton'

type Props = {
  onClose?: () => void
}

const StaticBanner = ({ onClose }: Props) => {
  const translate = useTranslate('shipping_fees_applied_info_banner')

  return (
    <Card testId="shipping-fees-applied-banner">
      <div className="shipping-fees-applied-banner--static">
        <div className="u-padding-left-medium">
          <Text text={translate('title')} type="subtitle" as="div" />
        </div>
        {onClose && <CloseButton onClick={onClose} />}
      </div>
    </Card>
  )
}

export default StaticBanner
