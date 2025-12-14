'use client'

import { Button, Navigation, Divider, Text } from '@vinted/web-ui'
import { X24 } from '@vinted/monochrome-icons'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

type Props = {
  onClose: () => void
}

const ModalNavigation = ({ onClose }: Props) => {
  const translate = useTranslate('item_price_breakdown_detailed')

  return (
    <>
      <Navigation
        body={
          <Text type="title" as="h1">
            {translate('breakdown_title')}
          </Text>
        }
        right={
          <Button
            styling="flat"
            iconName={X24}
            inline
            onClick={onClose}
            aria={{ 'aria-label': translate('actions.a11y.close') }}
            testId="item-price-breakdown-navigation-close-button"
          />
        }
      />
      <Divider />
    </>
  )
}

export default ModalNavigation
