'use client'

import { MouseEvent, useEffect } from 'react'
import { X24 } from '@vinted/monochrome-icons'
import { Button, Cell, Dialog, Divider, Image, Navigation, Note, Text } from '@vinted/web-ui'

import { useIsDarkModeEnabledFromCookies } from '@marketplace-web/dark-mode/dark-mode-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { ScrollableArea } from '@marketplace-web/common-components/scrollable-area-ui'
import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'
import { ContentLoader } from '@marketplace-web/common-components/content-loader-ui'
import { ErrorState } from '@marketplace-web/error-display/error-display-feature'
import { UiState } from '@marketplace-web/shared/ui-state-util'
import {
  taxpayersClickEvent,
  taxpayersViewScreenEvent,
  TaxpayerEducationModel,
  TaxpayerEducationSectionModel,
} from '@marketplace-web/taxpayers/taxpayers-data'
import { useAsset } from '@marketplace-web/shared/assets'

type Props = {
  show: boolean
  uiState: UiState
  taxpayerEducation: TaxpayerEducationModel | null
  isSpecialVerification: boolean
  onClose: () => void
  onConfirm?: () => void
}

const TaxpayerEducationModal = ({
  show,
  uiState,
  taxpayerEducation,
  isSpecialVerification,
  onClose,
  onConfirm,
}: Props) => {
  const translate = useTranslate(
    isSpecialVerification ? 'taxpayer_special_verification.education_modal' : 'taxpayer_education',
  )
  const { track } = useTracking()
  const isDarkMode = useIsDarkModeEnabledFromCookies()
  const asset = useAsset('/assets/taxpayers/education')

  useEffect(() => {
    const trackSpecialVerificationEducationView = () => {
      track(
        taxpayersViewScreenEvent({
          screen: 'taxpayers_special_verification_education',
          details: null,
        }),
      )
    }

    if (!isSpecialVerification || !show) return

    trackSpecialVerificationEducationView()
  }, [isSpecialVerification, show, track])

  const handleSectionClick = (event: MouseEvent) => {
    if (!isSpecialVerification) return
    if (!(event.target instanceof HTMLAnchorElement)) return

    track(
      taxpayersClickEvent({
        screen: 'taxpayers_special_verification_education',
        target_name: 'info_about_dac7',
        target: 'button',
        target_details: null,
      }),
    )
  }

  const replaceNewLineSymbols = (sectionText: string) => sectionText.replace(/\n/g, '<br>')

  const getIconUrl = (iconType: string): string => {
    switch (iconType) {
      case 'requirement':
        return isDarkMode ? asset('magnifier-dark.svg') : asset('magnifier.svg')
      case 'process':
      case 'collected_data':
        return isDarkMode ? asset('shield-avatar-dark.svg') : asset('shield-avatar.svg')
      case 'obligations':
      case 'reporting':
        return isDarkMode ? asset('document-list-dark.svg') : asset('document-list.svg')
      case 'consequence':
      case 'restrictions':
        return isDarkMode ? asset('flag-exclamation-dark.svg') : asset('flag-exclamation.svg')
      case 'applicability':
        return isDarkMode ? asset('avatars-group-dark.svg') : asset('avatars-group.svg')
      default:
        return ''
    }
  }

  const renderSection = (section: TaxpayerEducationSectionModel) => {
    const iconUrl = getIconUrl(section.icon)

    return (
      <Cell
        key={section.title}
        title={section.title}
        body={<Text as="span" html text={replaceNewLineSymbols(section.body)} />}
        onClick={handleSectionClick}
        prefix={
          <Image src={iconUrl} size="medium" alt="" testId="taxpayer-education-section-icon" />
        }
        styling="default"
      />
    )
  }

  const renderSections = () => {
    if (!taxpayerEducation) return null

    return taxpayerEducation.sections.map(renderSection)
  }

  const renderDisclaimer = () => {
    if (!isSpecialVerification) return null

    return <Note text={translate('disclaimer')} />
  }

  const renderNavigation = () => (
    <div className="u-overflow-y-unset">
      <Navigation
        body={<Text as="h2" type="title" text={translate('header.title')} bold truncate />}
        right={<Button styling="flat" onClick={onClose} iconName={X24} inline />}
      />
    </div>
  )

  const renderBody = () => (
    <ScrollableArea className="u-flex-direction-row">
      <Cell styling="wide">
        <Text as="span" html text={translate('body.information')} />
      </Cell>
      {renderSections()}
      {renderDisclaimer()}
    </ScrollableArea>
  )

  const renderFooter = () => {
    if (isSpecialVerification) {
      return (
        <div className="u-flex-direction-row u-overflow-y-unset">
          <Cell>
            <Button
              type="button"
              text={translate('actions.start')}
              styling="filled"
              testId="taxpayer-education-start-button"
              onClick={onConfirm}
            />
          </Cell>
        </div>
      )
    }

    return (
      <div className="u-flex-direction-row u-overflow-y-unset">
        <Cell>
          <Button
            type="button"
            text={translate('actions.start')}
            styling="filled"
            testId="taxpayer-education-start-button"
            onClick={onClose}
          />
        </Cell>
      </div>
    )
  }

  const renderModalContent = () => {
    if (uiState === UiState.Pending) return <ContentLoader testId="taxpayer-education-loader" />
    if (uiState === UiState.Failure) return <ErrorState />

    return (
      <SeparatedList separator={<Divider />}>
        {renderNavigation()}
        {renderBody()}
        {renderFooter()}
      </SeparatedList>
    )
  }

  return (
    <Dialog show={show} hasScrollableContent className="u-flexbox u-flex-direction-column">
      {renderModalContent()}
    </Dialog>
  )
}

export default TaxpayerEducationModal
