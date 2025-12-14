'use client'

import { useEffect, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { Button, Cell, Dialog, Divider, Navigation, Spacer, Text } from '@vinted/web-ui'
import { X16 } from '@vinted/monochrome-icons'

import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { UiState } from '@marketplace-web/shared/ui-state-util'

import { HelpCenterFaqEntryUrl } from '@marketplace-web/help-center/help-center-faq-entry-url-feature'
import {
  AccessChannel,
  FaqEntryType,
} from '@marketplace-web/help-center/help-center-faq-entry-url-data'
import {
  clickEvent,
  taxpayersViewEvent,
  dismissTaxpayerRestrictionModal,
} from '@marketplace-web/taxpayers/taxpayers-data'
import { useRefUrl } from '@marketplace-web/ref-url/ref-url-feature'

import { SPECIAL_VERIFICATION_FORM_URL_WITH_REF } from '../../../constants/routes'

type Props = {
  show: boolean
  screen?: string
  onClose: () => void
}

const TaxpayersSpecialVerificationRestrictionInfoModal = ({ show, screen, onClose }: Props) => {
  const translate = useTranslate(
    'taxpayer_special_verification.verification_restriction.verification_restriction_modal',
  )
  const { track } = useTracking()
  const refUrl = useRefUrl()

  const specialVerificationSessionId = useMemo(() => uuid(), [])

  const [uiState, setUiState] = useState(UiState.Idle)

  useEffect(() => {
    if (!show || !screen) return

    track(
      taxpayersViewEvent({
        screen,
        target: 'block_modal',
        target_details: 'special_verification',
      }),
    )
  }, [screen, show, track])

  const handleFinaliseTaxpayersSpecialVerificationForm = (
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    if (uiState === UiState.Pending) {
      event.preventDefault()

      return
    }

    track(
      clickEvent({
        screen,
        target: 'taxpayers_special_verification_balance_block_modal',
        targetDetails: 'finalise',
      }),
    )

    dismissTaxpayerRestrictionModal()
    setUiState(UiState.Pending)
    navigateToPage(
      `${SPECIAL_VERIFICATION_FORM_URL_WITH_REF(refUrl, specialVerificationSessionId)}`,
    )
  }

  const handleLearnMore = () => {
    track(
      clickEvent({
        screen,
        target: 'taxpayers_special_verification_balance_block_modal',
        targetDetails: 'learn',
      }),
    )

    dismissTaxpayerRestrictionModal()
  }

  const handleClose = () => {
    track(
      clickEvent({
        screen,
        target: 'taxpayers_special_verification_balance_block_modal',
        targetDetails: 'close',
      }),
    )
    onClose()
  }

  return (
    <Dialog show={show} className="u-flexbox u-flex-direction-column">
      <Navigation
        body={<Text as="h2" type="title" text={translate('header')} bold />}
        right={
          <Button
            styling="flat"
            onClick={handleClose}
            testId="taxpayers-special-verification-restriction-modal-close"
            iconName={X16}
            inline
          />
        }
      />
      <Divider />
      <Cell>
        <Text as="h1" type="heading" width="parent" alignment="center" text={translate('title')} />
        <Spacer size="large" />
        <Text as="span" type="body" text={translate('body')} />
        <Spacer size="x-large" />
        <Button
          styling="filled"
          isLoading={uiState === UiState.Pending}
          testId="special-verification-restriction-primary-button"
          text={translate('actions.verify_your_information')}
          onClick={handleFinaliseTaxpayersSpecialVerificationForm}
        />
        <Spacer size="large" />
        <HelpCenterFaqEntryUrl
          type={FaqEntryType.Dac7SpecialVerification}
          accessChannel={AccessChannel.ProductLink}
          render={url => (
            <a
              data-testid="dac7-special-verification-faq-entry-link"
              className="u-disable-underline"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                text={translate('actions.learn_more')}
                testId="special-verification-restriction-secondary-button"
                onClick={handleLearnMore}
              />
            </a>
          )}
        />
      </Cell>
    </Dialog>
  )
}

export default TaxpayersSpecialVerificationRestrictionInfoModal
