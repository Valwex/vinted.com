'use client'

import {
  ExclamationPoint24,
  EyeMagnifyingGlass24,
  SortingCenter24,
  VerifiedCheck24,
  X24,
} from '@vinted/monochrome-icons'
import { Button, Cell, Dialog, Icon, Image, Navigation, Spacer, Text } from '@vinted/web-ui'
import { useEffect } from 'react'
import { useIntl } from 'react-intl'

import { useTracking, TrackingEvent } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'
import { useAsset } from '@marketplace-web/shared/assets'
import { viewEvent } from '@marketplace-web/escrow-pricing/escrow-pricing-data'
import { ScrollableArea } from '@marketplace-web/common-components/scrollable-area-ui'
import { CurrencyAmountModel, formatCurrencyAmount } from '@marketplace-web/currency/currency-data'

type Props = {
  show: boolean
  onClose: () => void
  verificationFee?: CurrencyAmountModel
  /** Optionally overrides the default user.view tracking event that is triggered when the modal is in view. */
  viewEvent?: TrackingEvent
}

const VERIFICATION_ICON = 'authenticity-diamond-48.svg'
const VERIFICATION_DARK_ICON = 'authenticity-diamond-48-dark.svg'

const ItemVerificationBuyerModal = ({
  verificationFee,
  show,
  onClose,
  viewEvent: viewEventOverride,
}: Props) => {
  const translate = useTranslate('item.authenticity_fee_modal')
  const { track } = useTracking()
  const asset = useAsset('/assets/offline-authenticity')
  const { locale } = useIntl()

  useEffect(() => {
    if (!show) return

    track(viewEventOverride || viewEvent({ target: 'physical_auth_buyer' }))
  }, [show, track, viewEventOverride])

  const contentRows: Array<{
    translationId: string
    iconName?: React.ComponentProps<typeof Icon>['name']
  }> = [
    { translationId: 'auth_center', iconName: SortingCenter24 },
    { translationId: 'check', iconName: EyeMagnifyingGlass24 },
    { translationId: 'verified', iconName: VerifiedCheck24 },
    { translationId: 'rejected', iconName: ExclamationPoint24 },
    { translationId: 'includes' },
    { translationId: 'delivery' },
  ]

  const verificationIconPath = asset(VERIFICATION_ICON, { theme: { dark: VERIFICATION_DARK_ICON } })

  const formattedVerificationFee = verificationFee && formatCurrencyAmount(verificationFee, locale)

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

  return (
    <Dialog hasScrollableContent show={show} testId="offline-verification-modal">
      <div>
        <Navigation
          right={
            <Button
              styling="flat"
              onClick={onClose}
              icon={<Icon name={X24} testId="icon-x" />}
              inline
              testId="offline-verification-modal-navigation-close-button"
            />
          }
        />
        <ScrollableArea>
          <div
            className="u-ui-padding-horizontal-x2-large"
            data-testid="offline-verification-modal-content"
          >
            <div className="u-text-center">
              <Image src={verificationIconPath} size="x-large" alt="" />
              <Spacer size="large" />
              <Text as="h1" text={translate('title')} type="heading" />
              {formattedVerificationFee && (
                <Text
                  as="span"
                  text={translate('fee', { amount: formattedVerificationFee })}
                  theme="inherit"
                  type="body"
                  testId="offline-verification-modal-fee-title"
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
                  testId="offline-verification-modal-learn-more"
                />
                <Text
                  as="h3"
                  text={translate('legal_disclaimer')}
                  type="subtitle"
                  testId="offline-verification-modal-legal-disclaimer"
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
            testId="offline-verification-modal-close-button"
          />
        </Cell>
      </div>
    </Dialog>
  )
}

export default ItemVerificationBuyerModal
