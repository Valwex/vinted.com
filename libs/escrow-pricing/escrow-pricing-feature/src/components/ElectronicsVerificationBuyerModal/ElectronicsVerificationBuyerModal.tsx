'use client'

import { useEffect } from 'react'
import { Button, Cell, Icon, Dialog, Navigation, Spacer, Text } from '@vinted/web-ui'
import { useIntl } from 'react-intl'
import {
  EyeMagnifyingGlass24,
  SortingCenter24,
  VerifiedCheck24,
  InfoCircle24,
  X24,
} from '@vinted/monochrome-icons'
import { ElectronicsBadgeMultichrome64 } from '@vinted/multichrome-icons'

import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'

import { viewEvent } from '@marketplace-web/escrow-pricing/escrow-pricing-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useTracking, TrackingEvent } from '@marketplace-web/observability/event-tracker-data'
import { CurrencyAmountModel, formatCurrencyAmount } from '@marketplace-web/currency/currency-data'
import { ScrollableArea } from '@marketplace-web/common-components/scrollable-area-ui'

type Props = {
  show: boolean
  onClose: () => void
  verificationFee?: CurrencyAmountModel
  screen: string
  /** Optionally overrides the default user.view tracking event that is triggered when the modal is in view. */
  viewEvent?: TrackingEvent
}

const ElectronicsVerificationBuyerModal = ({
  verificationFee,
  show,
  onClose,
  screen,
  viewEvent: viewEventOverride,
}: Props) => {
  const translate = useTranslate('item.electronics_verification_modal.buyer')
  const { locale } = useIntl()
  const { track } = useTracking()

  useEffect(() => {
    if (!show) return

    track(viewEventOverride || viewEvent({ screen, target: 'electronics_verification_buyer' }))
  }, [show, track, screen, viewEventOverride])

  const contentRows: Array<{
    translationId: string
    iconName?: React.ComponentProps<typeof Icon>['name']
  }> = [
    { translationId: 'verification_hub', iconName: SortingCenter24 },
    { translationId: 'specialists_check', iconName: EyeMagnifyingGlass24 },
    { translationId: 'sending', iconName: VerifiedCheck24 },
    { translationId: 'refund', iconName: InfoCircle24 },
    { translationId: 'what_is_included' },
    { translationId: 'duration' },
  ]

  const renderContentRow = (
    translationId: string,
    iconName: React.ComponentProps<typeof Icon>['name'] | null = null,
  ) => {
    return (
      <Cell
        key={translationId}
        styling="tight"
        prefix={
          iconName && (
            <Icon
              name={iconName}
              testId={`content-icon-${iconName.Title}`}
              aria={{
                'aria-hidden': 'true',
              }}
              color="greyscale-level-2"
            />
          )
        }
        title={
          <Text
            as="h2"
            text={translate(`${translationId}_title`)}
            type="title"
            testId={`content-title-${translationId}`}
          />
        }
        body={
          <Text
            as="span"
            text={translate(`${translationId}_body`)}
            testId={`content-description-${translationId}`}
          />
        }
      />
    )
  }

  const formattedVerificationFee = verificationFee && formatCurrencyAmount(verificationFee, locale)

  return (
    <Dialog hasScrollableContent show={show} testId="electronics-verification-buyer-modal">
      <div>
        <Navigation
          right={
            <Button
              styling="flat"
              onClick={onClose}
              icon={<Icon name={X24} testId="icon-x" />}
              inline
              testId="electronics-verification-modal-navigation-close-button"
              aria={{
                'aria-label': translate('a11y.actions.close'),
              }}
            />
          }
        />
        <ScrollableArea>
          <div
            className="u-ui-padding-horizontal-x2-large"
            data-testid="electronics-verification-modal-content"
          >
            <div className="u-text-center">
              <Icon
                name={ElectronicsBadgeMultichrome64}
                color="primary-default"
                aria={{
                  'aria-hidden': 'true',
                }}
              />
              <Spacer size="large" />
              <Text as="h1" text={translate('title')} type="heading" alignment="center" />
              {verificationFee && (
                <Text
                  as="span"
                  text={translate('fee', { amount: formattedVerificationFee })}
                  theme="inherit"
                  type="body"
                  testId="electronics-verification-modal-fee-title"
                  alignment="center"
                />
              )}
            </div>
            <div className="u-ui-padding-vertical-x-large">
              <SeparatedList separator={<Spacer size="x-large" />}>
                {contentRows.map(({ translationId, iconName }) =>
                  renderContentRow(translationId, iconName),
                )}
                <Text
                  as="span"
                  text={translate('more')}
                  html
                  testId="electronics-verification-modal-learn-more"
                />
                <Text
                  as="h3"
                  text={translate('legal_disclaimer')}
                  type="subtitle"
                  testId="electronics-verification-modal-legal-disclaimer"
                />
              </SeparatedList>
            </div>
          </div>
        </ScrollableArea>
        <Cell>
          <Button
            text={translate('action.close')}
            styling="filled"
            onClick={onClose}
            testId="electronics-verification-modal-close-button"
            aria={{
              'aria-label': translate('a11y.actions.close'),
            }}
          />
        </Cell>
      </div>
    </Dialog>
  )
}

export default ElectronicsVerificationBuyerModal
