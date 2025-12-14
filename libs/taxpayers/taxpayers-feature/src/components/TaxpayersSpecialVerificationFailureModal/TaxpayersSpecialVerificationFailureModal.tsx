'use client'

import { X24 } from '@vinted/monochrome-icons'
import { Button, Cell, Dialog, Divider, Image, Navigation, Spacer, Text } from '@vinted/web-ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { v4 as uuid } from 'uuid'

import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { ContentLoader } from '@marketplace-web/common-components/content-loader-ui'
import { ErrorState } from '@marketplace-web/error-display/error-display-feature'
import { useAsset } from '@marketplace-web/shared/assets'
import { UiState } from '@marketplace-web/shared/ui-state-util'

import { HelpCenterFaqEntryUrl } from '@marketplace-web/help-center/help-center-faq-entry-url-feature'
import {
  AccessChannel,
  FaqEntryType,
} from '@marketplace-web/help-center/help-center-faq-entry-url-data'
import {
  taxpayersClickEvent,
  taxpayersViewScreenEvent,
  getTaxpayersSpecialVerificationDeadline,
} from '@marketplace-web/taxpayers/taxpayers-data'
import { useRefUrl } from '@marketplace-web/ref-url/ref-url-feature'

import { SPECIAL_VERIFICATION_FORM_URL_WITH_REF } from '../../constants/routes'

const MS_PER_SECOND = 1000

type Props = {
  show: boolean
  onClose: () => void
}

const TaxpayersSpecialVerificationFailureModal = ({ show, onClose }: Props) => {
  const translate = useTranslate('taxpayer_special_verification.failure_modal')
  const { track } = useTracking()
  const { formatDate } = useIntl()
  const refUrl = useRefUrl()
  const asset = useAsset('/assets/taxpayers-special-verification')

  const specialVerificationSessionId = useMemo(() => uuid(), [])

  const [uiState, setUiState] = useState(UiState.Idle)
  const [deadlineDate, setDeadlineDate] = useState<string | null>(null)

  const formatDeadlineUnix = useCallback(
    (unixTime: number) => {
      const formattedDeadlineDate = formatDate(unixTime * MS_PER_SECOND, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      return formattedDeadlineDate
    },
    [formatDate],
  )

  useEffect(() => {
    const fetchSpecialVerificationDeadline = async () => {
      setUiState(UiState.Pending)
      const response = await getTaxpayersSpecialVerificationDeadline()

      if ('errors' in response) {
        setUiState(UiState.Failure)

        return
      }

      setUiState(UiState.Success)
      setDeadlineDate(formatDeadlineUnix(response.deadline))
    }

    fetchSpecialVerificationDeadline()
  }, [formatDeadlineUnix])

  useEffect(() => {
    const trackScreenView = () => {
      track(
        taxpayersViewScreenEvent({
          screen: 'taxpayers_special_verification_failure',
          details: null,
        }),
      )
    }

    if (!show) return

    trackScreenView()
  }, [show, track])

  const handleModalConfirm = () => {
    track(
      taxpayersClickEvent({
        screen: 'taxpayers_special_verification_failure',
        target: 'button',
        target_name: 'fix_taxpayers_report',
        target_details: null,
      }),
    )

    navigateToPage(SPECIAL_VERIFICATION_FORM_URL_WITH_REF(refUrl, specialVerificationSessionId))
  }

  const handleSecondaryButtonClick = () => {
    track(
      taxpayersClickEvent({
        screen: 'taxpayers_special_verification_failure',
        target: 'button',
        target_details: null,
        target_name: 'help_center_link',
      }),
    )
  }

  const renderHeader = () => {
    return (
      <>
        <Navigation
          body={<Text as="h2" type="title" text={translate('header.title')} />}
          right={
            <Button
              testId="special-verification-failure-close-button"
              styling="flat"
              onClick={onClose}
              iconName={X24}
              inline
            />
          }
        />
        <Divider />
      </>
    )
  }

  const renderBody = () => {
    return (
      <>
        <Image src={asset('/document-pen.svg')} alt="" />
        <Spacer size="x-large" />
        <Text as="h1" alignment="left" type="heading" text={translate('title')} />
        <Spacer size="large" />
        <div className="unordered-list-margin-top-none">
          <Text as="span" html alignment="left" type="body" text={translate('body_1')} />
        </div>
        <Spacer size="large" />
        <Text
          as="span"
          alignment="left"
          type="body"
          text={translate('body_2', {
            deadline: (
              <Text key="deadline" as="span" bold>
                {deadlineDate}
              </Text>
            ),
          })}
        />
        <Text as="span" alignment="center" type="body" />
      </>
    )
  }

  const renderFooter = () => {
    return (
      <>
        <Spacer size="large" />
        <Button
          styling="filled"
          text={translate('actions.primary')}
          testId="special-verification-failure-primary-button"
          onClick={handleModalConfirm}
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
                styling="outlined"
                text={translate('actions.secondary')}
                testId="special-verification-failure-secondary-button"
                onClick={handleSecondaryButtonClick}
              />
            </a>
          )}
        />
      </>
    )
  }

  const renderContent = () => {
    if (uiState === UiState.Failure) return <ErrorState />

    if (uiState === UiState.Pending)
      return <ContentLoader testId="content-loader" size={ContentLoader.Size.Large} />

    return (
      <Cell>
        {renderBody()}
        {renderFooter()}
      </Cell>
    )
  }

  return (
    <Dialog show={show} className="u-text-center">
      {renderHeader()}
      {renderContent()}
    </Dialog>
  )
}

export default TaxpayersSpecialVerificationFailureModal
