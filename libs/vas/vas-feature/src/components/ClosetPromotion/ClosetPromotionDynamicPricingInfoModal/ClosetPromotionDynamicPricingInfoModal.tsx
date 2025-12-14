'use client'

import { ArrowLeft24 } from '@vinted/monochrome-icons'
import { Button, Cell, Dialog, Navigation, Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { ScrollableArea } from '@marketplace-web/common-components/scrollable-area-ui'

type Props = {
  show: boolean
  onBack: () => void
}

const ClosetPromotionDynamicPricingInfoModal = ({ show, onBack }: Props) => {
  const translate = useTranslate('closet_promotion.dynamic_pricing_info_modal')
  const a11yTranslate = useTranslate('closet_promotion.a11y.actions')

  return (
    <Dialog show={show} hasScrollableContent>
      <div className="u-fill-width">
        <ScrollableArea>
          <Navigation
            left={
              <Button
                theme="amplified"
                iconName={ArrowLeft24}
                styling="flat"
                testId="closet-promotion-dynamic-pricing-info-back-button"
                onClick={onBack}
                aria={{ 'aria-label': a11yTranslate('back') }}
              />
            }
            body={<Text as="h2" text={translate('title_v2')} type="title" />}
          />
          <Cell
            title={<Text as="h3" text={translate('what.title')} type="title" />}
            body={<Text as="span" text={translate('what.body_v2')} html />}
          />
          <Cell
            title={<Text as="h3" text={translate('how.title_v2')} type="title" />}
            body={<Text as="span" text={translate('how.body_v2')} html />}
          />
        </ScrollableArea>
      </div>
    </Dialog>
  )
}

export default ClosetPromotionDynamicPricingInfoModal
