'use client'

import { DashedCheckCircle24, ElectronicsBadge24, Money24 } from '@vinted/monochrome-icons'
import { Button, Cell, Dialog, Icon, Image, Spacer, Text } from '@vinted/web-ui'
import { useEffect } from 'react'

import { useTracking, TrackingEvent } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useImageSrcSet } from '@marketplace-web/shared/assets'

import { clickEvent, viewEvent } from '@marketplace-web/escrow-pricing/escrow-pricing-data'
import { HelpCenterFaqEntryUrl } from '@marketplace-web/help-center/help-center-faq-entry-url-feature'
import {
  AccessChannel,
  FaqEntryType,
} from '@marketplace-web/help-center/help-center-faq-entry-url-data'

type Props = {
  screen: string
  show: boolean
  onClose: () => void
  /** Optionally overrides the default user.view tracking event that is triggered when the modal is in view. */
  viewEvent?: TrackingEvent
}

const ElectronicsVerificationSellerModal = ({
  show,
  screen,
  onClose,
  viewEvent: viewEventOverride,
}: Props) => {
  const translate = useTranslate('item.offline_verification.electronics_seller_modal')
  const { track } = useTracking()
  const { src, srcSet } = useImageSrcSet({
    baseName: 'electronics-verification-375x212',
    darkMode: false,
    assetBasePath: '/assets/electronics-verification',
  })

  function handleLearnMoreClick() {
    track(clickEvent({ screen, target: 'electronics_verification_learn_more' }))
  }

  function handleClose() {
    track(clickEvent({ screen, target: 'electronics_verification_got_it' }))
    onClose()
  }

  useEffect(() => {
    if (!show) return

    track(
      viewEventOverride ||
        viewEvent({
          screen,
          target: 'electronics_verification_seller',
        }),
    )
  }, [track, show, screen, viewEventOverride])

  return (
    <Dialog show={show} testId="electronics-verification-seller-modal" hasScrollableContent>
      <div className="u-fill-width">
        <div className="u-overflow-auto">
          <Spacer size="large" />
          <div className="u-flexbox u-justify-content-center">
            <Image
              src={src}
              srcset={srcSet}
              styling="rounded"
              alt={translate('a11y.illustration_alt')}
            />
          </div>

          <Cell>
            <Text as="h1" text={translate('title')} type="heading" width="parent" />
          </Cell>

          <Cell
            testId="electronics-verification-seller-modal-cell-1"
            prefix={<Icon name={DashedCheckCircle24} color="greyscale-level-3" />}
            title={translate('cell_1.title')}
            body={
              <>
                {translate('cell_1.body')}
                <HelpCenterFaqEntryUrl
                  type={FaqEntryType.ElectronicsVerificationSeller}
                  accessChannel={AccessChannel.ProductLink}
                  render={url => (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={handleLearnMoreClick}
                      data-testid="electronics-verification-seller-modal-learn-more-action"
                    >
                      <Text
                        as="span"
                        clickable
                        theme="inverse"
                        width="parent"
                        text={translate('cell_1.action')}
                      />
                    </a>
                  )}
                />
              </>
            }
          />

          <Cell
            testId="electronics-verification-seller-modal-cell-2"
            prefix={<Icon name={ElectronicsBadge24} color="greyscale-level-3" />}
            title={translate('cell_2.title')}
            body={translate('cell_2.body')}
          />

          <Cell
            testId="electronics-verification-seller-modal-cell-3"
            prefix={<Icon name={Money24} color="greyscale-level-3" />}
            title={translate('cell_3.title')}
            body={translate('cell_3.body')}
          />
        </div>

        <Cell>
          <Button
            text={translate('actions.close')}
            styling="filled"
            onClick={handleClose}
            testId="electronics-verification-seller-modal-close-button"
          />
        </Cell>
        <Spacer size="large" />
      </div>
    </Dialog>
  )
}

export default ElectronicsVerificationSellerModal
