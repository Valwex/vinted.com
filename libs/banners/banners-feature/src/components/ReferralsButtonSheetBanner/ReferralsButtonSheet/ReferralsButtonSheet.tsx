'use client'

import { X24 } from '@vinted/monochrome-icons'
import { Dialog, Navigation, Button, Image, Cell, Text, Spacer, BottomSheet } from '@vinted/web-ui'
import { useEffect, useState } from 'react'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useIsDarkMode } from '@marketplace-web/dark-mode/dark-mode-feature'
import { clickEvent, ReferralsBottomSheetBannerModel } from '@marketplace-web/banners/banners-data'
import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'

import useBanners from '../../../hooks/useBanners'
import { REFERRALS_URL } from '../../../constants/routes'

type Props = {
  banner: ReferralsBottomSheetBannerModel
}

const ReferralsButtonSheet = ({ banner }: Props) => {
  const isDarkMode = useIsDarkMode()
  const [isBannerOpen, setIsBannerOpen] = useState(true)
  const translate = useTranslate()
  const { onBannerSeen } = useBanners()
  const { track } = useTracking()
  const breakpoints = useBreakpoint()

  useEffect(() => {
    onBannerSeen({ type: banner.type, name: banner.name })
  }, [banner, onBannerSeen])

  const image = isDarkMode ? banner.darkImageUrl : banner.imageUrl

  const handleClose = () => {
    track(
      clickEvent({
        target: 'referrals_bottom_sheet_banner',
        screen: 'news_feed',
        targetDetails: 'dismiss_banner',
      }),
    )
    setIsBannerOpen(false)
  }

  const renderImage = () => {
    if (!image) return null

    return (
      <div>
        <Image src={image} scaling="contain" />
      </div>
    )
  }
  const renderCTAButton = () => {
    return (
      <Cell>
        <Button
          theme="primary"
          styling="filled"
          url={REFERRALS_URL}
          aria={{ 'aria-label': banner.actions?.primary?.title }}
          testId="referrals-bottom-sheet-banner-cta-button"
        >
          {banner?.actions?.primary.title}
        </Button>
      </Cell>
    )
  }

  const renderNavigation = () => {
    return (
      <Navigation
        right={
          <Button
            iconName={X24}
            iconColor={isDarkMode ? 'greyscale-level-6' : 'primary-dark'}
            inverse
            inline
            onClick={handleClose}
            aria={{ 'aria-label': translate('common.a11y.actions.dialog_close') }}
            testId="referrals-bottom-sheet-banner-navigation-close-button"
          />
        }
      />
    )
  }

  const renderBody = () => {
    return (
      <Text html as="p" alignment="center" width="parent">
        {banner.body}
      </Text>
    )
  }
  const renderTitle = () => {
    return (
      <Text as="p" type="heading" alignment="center" width="parent">
        {banner.title}
      </Text>
    )
  }

  const renderContent = () => {
    return (
      <>
        {renderNavigation()}
        {renderImage()}
        <Cell>
          {renderTitle()}
          <Spacer size="large" />
          {renderBody()}
        </Cell>
        <Spacer size="large" />
        {renderCTAButton()}
      </>
    )
  }

  if (!isBannerOpen || banner.abTest.group.toLowerCase() === 'off') return null

  return breakpoints.phones ? (
    <BottomSheet
      isVisible
      onClose={handleClose}
      initialHeight={1}
      a11yCloseIconTitle={translate('common.a11y.actions.dialog_close')}
    >
      {renderContent()}
    </BottomSheet>
  ) : (
    <Dialog
      show
      defaultCallback={handleClose}
      contentDimensions={{ maxWidth: '375px' }}
      closeOnOverlay
    >
      {renderContent()}
    </Dialog>
  )
}

export default ReferralsButtonSheet
