'use client'

import { ArrowLeft24 } from '@vinted/monochrome-icons'
import { Button, Container, Dialog, Navigation, Spacer, Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { ScrollableArea } from '@marketplace-web/common-components/scrollable-area-ui'
import { HelpCenterFaqEntryUrl } from '@marketplace-web/help-center/help-center-faq-entry-url-feature'

import {
  AccessChannel,
  FaqEntryType,
} from '@marketplace-web/help-center/help-center-faq-entry-url-data'

type Props = {
  show: boolean
  onBack: () => void
}

const ClosetPromotionPreCheckoutHelpModal = ({ show, onBack }: Props) => {
  const translate = useTranslate('closet_promotion.pre_checkout_help_modal')
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
                testId="closet-promotion-pre-checkout-help-back-button"
                onClick={onBack}
                aria={{ 'aria-label': a11yTranslate('back') }}
              />
            }
            body={<Text as="h2" text={translate('title_v2')} type="title" />}
          />
          <Container>
            <Text as="p" text={translate('body')} type="body" html />
            <Spacer size="large" />
            <HelpCenterFaqEntryUrl
              type={FaqEntryType.ClosetPromotion}
              accessChannel={AccessChannel.ProductLink}
              render={url => (
                <a href={url} target="_blank" rel="noreferrer">
                  <Text as="span" text={translate('learn_more')} type="body" clickable />
                </a>
              )}
              key="read-more-link"
            />
          </Container>
        </ScrollableArea>
      </div>
    </Dialog>
  )
}

export default ClosetPromotionPreCheckoutHelpModal
