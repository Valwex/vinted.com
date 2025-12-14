'use client'

import { useEffect, useState } from 'react'
import { BottomSheet, Button, Cell, Dialog, Image, Navigation, Spacer, Text } from '@vinted/web-ui'
import { X24 } from '@vinted/monochrome-icons'

import { useIsDarkMode } from '@marketplace-web/dark-mode/dark-mode-feature'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'
import { useAbTest, useTrackAbTest } from '@marketplace-web/feature-flags/ab-tests-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { BeyondFashionBannerModel, clickEvent } from '@marketplace-web/banners/banners-data'

import useBanners from '../../../hooks/useBanners'
import { ITEM_UPLOAD_URL } from '../../../constants/routes'

type Props = {
  banner: BeyondFashionBannerModel
}

const BeyondFashion = ({ banner }: Props) => {
  const { onBannerSeen } = useBanners()
  const [isOpen, setIsOpen] = useState(true)
  const translate = useTranslate()
  const isDarkMode = useIsDarkMode()
  const breakpoints = useBreakpoint()
  const { track } = useTracking()

  useTrackAbTest(useAbTest(banner.abTest.name))

  const image = isDarkMode ? banner.darkImageUrl : banner.imageUrl

  const handleClose = () => {
    track(
      clickEvent({
        target: 'beyond_fashion_new_lister_banner',
        screen: 'news_feed',
        targetDetails: 'dismiss',
      }),
    )

    setIsOpen(false)
  }

  const handleAction = () => {
    track(
      clickEvent({
        target: 'beyond_fashion_new_lister_banner',
        screen: 'news_feed',
        targetDetails: 'upload_item',
      }),
    )
  }

  useEffect(() => {
    onBannerSeen({ type: banner.type, name: banner.name })
  }, [banner, onBannerSeen])

  const renderNavigation = () => {
    return (
      <Navigation
        right={
          <Button
            iconName={X24}
            inverse
            inline
            onClick={handleClose}
            aria={{ 'aria-label': translate('common.a11y.actions.dialog_close') }}
            testId="beyond-fashion-banner-navigation-close-button"
          />
        }
      />
    )
  }

  const renderImage = () => {
    if (!image) return null

    return (
      <div>
        <Image src={image} scaling="contain" />
      </div>
    )
  }

  const renderTitle = () => {
    if (!banner.title) return null

    return (
      <Text as="p" type="heading" alignment="center" width="parent">
        {banner.title}
      </Text>
    )
  }

  const renderBody = () => {
    if (!banner.body) return null

    return (
      <Text as="p" alignment="center" width="parent">
        {banner.body}
      </Text>
    )
  }

  const renderButton = () => {
    if (!banner.actions?.primary.title) return null

    return (
      <Cell>
        <Button theme="primary" styling="filled" url={ITEM_UPLOAD_URL} onClick={handleAction}>
          {banner.actions.primary.title}
        </Button>
      </Cell>
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
        {renderButton()}
      </>
    )
  }

  if (!isOpen) return null
  if (banner.abTest.group === 'off') return null

  if (breakpoints.phones) {
    return (
      <BottomSheet
        isVisible
        onClose={handleClose}
        initialHeight={1}
        a11yCloseIconTitle={translate('common.a11y.actions.dialog_close')}
      >
        {renderContent()}
      </BottomSheet>
    )
  }

  return (
    <Dialog
      show
      contentDimensions={{ maxWidth: '375px' }}
      closeOnOverlay
      defaultCallback={handleClose}
    >
      {renderContent()}
    </Dialog>
  )
}

export default BeyondFashion
