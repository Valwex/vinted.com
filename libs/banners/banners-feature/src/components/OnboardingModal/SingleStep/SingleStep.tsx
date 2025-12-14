'use client'

import { X24 } from '@vinted/monochrome-icons'
import { BottomSheet, Button, Cell, Image, Dialog, Navigation, Spacer, Text } from '@vinted/web-ui'

import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'
import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import {
  SingleStepOnboardingModalModel,
  SingleStepOnboardingModalSectionModel,
} from '@marketplace-web/banners/banners-data'

import { ITEM_UPLOAD_URL } from '../../../constants/routes'

type Props = {
  banner: SingleStepOnboardingModalModel
  onClose: () => void
  onPrimaryClick: () => void
}

const SingleStep = ({ onClose, banner, onPrimaryClick }: Props) => {
  const breakpoint = useBreakpoint()
  const translate = useTranslate()

  const handleCloseClick = () => {
    onClose()
  }

  const handleActionClick = () => {
    onPrimaryClick()
  }

  const renderNavigation = () => {
    return (
      <div className="u-ui-padding-top-small u-ui-padding-horizontal-small">
        <Navigation
          right={
            <Button
              inline
              iconName={X24}
              styling="flat"
              onClick={handleCloseClick}
              testId="single-step-onboarding-modal-close-button"
              aria={{ 'aria-label': translate('common.a11y.actions.dialog_close') }}
            />
          }
        />
      </div>
    )
  }

  const renderTitle = () => {
    return (
      <Text type="heading-xl" as="p">
        {banner.title}
      </Text>
    )
  }

  const renderSection = ({ imageUrl, title, body }: SingleStepOnboardingModalSectionModel) => {
    return (
      <div key={title} className="u-flexbox">
        <div>
          <Image src={imageUrl} size="x-large" />
        </div>
        <Spacer orientation="vertical" size="x-large" />
        <div>
          <Text type="title" as="p">
            {title}
          </Text>
          <Spacer size="regular" />
          <Text type="subtitle" as="p" theme="amplified">
            {body}
          </Text>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    if (!banner.sections?.length) return null

    return (
      <>
        <div className="u-ui-padding-top-large u-ui-padding-right-large u-ui-padding-left-large">
          {renderTitle()}
          <Spacer size="large" />
          <Spacer size="x-large" />
          <SeparatedList
            separator={<div className="single-step-onboarding-modal__content-separator" />}
          >
            {banner.sections.map(renderSection)}
          </SeparatedList>
        </div>
        <Spacer size="large" />
        <Spacer size="x-large" />
      </>
    )
  }

  const renderActions = () => {
    return (
      <Cell styling="default">
        <Button url={ITEM_UPLOAD_URL} styling="filled" onClick={handleActionClick}>
          {banner.actions?.primary.title}
        </Button>
      </Cell>
    )
  }

  if (breakpoint.phones) {
    return (
      <BottomSheet isVisible onClose={handleCloseClick} initialHeight={1} closeOnOverlayClick>
        {renderNavigation()}
        {renderContent()}
        <div className="u-sticky u-bottom">{renderActions()}</div>
      </BottomSheet>
    )
  }

  return (
    <Dialog
      show
      defaultCallback={handleCloseClick}
      closeOnOverlay
      contentDimensions={{ maxWidth: '343px' }}
    >
      {renderNavigation()}
      <div className="single-step-onboarding-modal__content">{renderContent()}</div>
      {renderActions()}
    </Dialog>
  )
}

export default SingleStep
