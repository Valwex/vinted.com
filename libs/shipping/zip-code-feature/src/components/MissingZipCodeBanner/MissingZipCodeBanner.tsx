'use client'

import { useEffect, useState } from 'react'
import { Card, Icon, Spacer, Text } from '@vinted/web-ui'
import { LocationPin24 } from '@vinted/monochrome-icons'
import { useInView } from 'react-intersection-observer'
import classNames from 'classnames'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useSession } from '@marketplace-web/shared/session-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { ZipCodeCollectionBannerModel } from '@marketplace-web/banners/banners-data'
import { useAbTest, useTrackAbTestCallback } from '@marketplace-web/feature-flags/ab-tests-data'
import { useBanners } from '@marketplace-web/banners/banners-feature'
import {
  zipCodeScreenClickEvent,
  zipCodeScreenViewEvent,
} from '@marketplace-web/shipping/zip-code-data'

import MissingZipCodeDialog from '../MissingZipCodeDialog'
import useForceShowMissingZipCodeDialog from '../../hooks/useShowMissingZipCodeDialogPopUp'

type Props = {
  banner: ZipCodeCollectionBannerModel
  shouldShowTabs: boolean
}

const HOME_FEED_SCREEN = 'news_feed'
const ZIP_CODE_BANNER_COUNTRY_CODE = 'US'
const TAB_HEIGHT = 44 // equals to $header-tabs-height
const HEADER_TOTAL_HEIGHT_DESKTOPS = 98 // equals to $header-total-height-desktops
const HEADER_TOTAL_HEIGHT_PORTABLES = 105 // equals to $header-total-height-portables

const MissingZipCodeBanner = ({ banner, shouldShowTabs }: Props) => {
  const translate = useTranslate('item_upload.missing_zip_code')
  const { user, screen } = useSession()
  const trackAbTest = useTrackAbTestCallback()
  const {
    banners: { onboardingModal },
  } = useBanners()

  const { track } = useTracking()

  const usZipCollectionHomeFeedPageAbTest = useAbTest('us_zip_collection_home_feed_page')

  const { forceShowDialog, handleForceShowDialogClose } = useForceShowMissingZipCodeDialog(
    onboardingModal ? undefined : banner.popUpShowInterval,
  )

  const [ref, inView] = useInView({
    rootMargin: shouldShowTabs
      ? `-${HEADER_TOTAL_HEIGHT_PORTABLES + TAB_HEIGHT}px 0px 0px 0px`
      : `-${HEADER_TOTAL_HEIGHT_DESKTOPS}px 0px 0px 0px`, // Adjust the top margin by header height
    initialInView: true,
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isZipCodeSubmitted, setIsZipCodeSubmitted] = useState(false)

  const showBanner =
    usZipCollectionHomeFeedPageAbTest?.variant === 'on' &&
    screen === HOME_FEED_SCREEN &&
    user?.country_code === ZIP_CODE_BANNER_COUNTRY_CODE &&
    !user?.is_on_holiday &&
    !isZipCodeSubmitted

  useEffect(() => {
    if (!showBanner) return

    track(zipCodeScreenViewEvent({ screen: 'home_feed_zip_sticky_banner' }))
  }, [showBanner, track])

  useEffect(() => {
    if (
      screen === HOME_FEED_SCREEN &&
      user?.country_code === ZIP_CODE_BANNER_COUNTRY_CODE &&
      !user?.is_on_holiday
    ) {
      trackAbTest(usZipCollectionHomeFeedPageAbTest)
    }
  }, [
    screen,
    trackAbTest,
    usZipCollectionHomeFeedPageAbTest,
    user?.country_code,
    user?.is_on_holiday,
  ])

  const handleBannerClick = () => {
    setIsDialogOpen(true)

    track(
      zipCodeScreenClickEvent({
        screen: 'home_feed_zip_sticky_banner',
        target: 'sticky_zip_banner',
      }),
    )
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    handleForceShowDialogClose()
  }

  const handleContinue = () => {
    setIsDialogOpen(false)
    handleForceShowDialogClose()

    setIsZipCodeSubmitted(true)
  }

  const highlightLink = {
    highlight: (chunks: Array<React.ReactNode>) => (
      <Text key="highlight" as="span" type="subtitle" underline text={chunks} clickable />
    ),
  }

  const renderStaticBanner = () => {
    return (
      <div ref={ref}>
        <button className="u-fill-width" onClick={handleBannerClick} type="button">
          <Card testId="missing-zip-code-banner">
            <div className="missing-zip-code-banner--static">
              <div className="u-padding-left-medium">
                <span className="u-flexbox u-align-items-center">
                  <div>
                    <Icon name={LocationPin24} />
                    <Spacer orientation="vertical" />
                  </div>
                  <Text as="div" type="subtitle" text={translate('banner_body', highlightLink)} />
                </span>
              </div>
            </div>
          </Card>
        </button>
      </div>
    )
  }

  const renderStickyBanner = () => {
    return (
      <button
        data-testid="missing-zip-code-banner-sticky"
        className={classNames(
          'missing-zip-code-banner--sticky',
          shouldShowTabs && 'missing-zip-code-banner--sticky-with-tabs',
        )}
        onClick={handleBannerClick}
        type="button"
      >
        <span className="u-flexbox u-align-items-center">
          <div>
            <Icon name={LocationPin24} />
            <Spacer orientation="vertical" />
          </div>
          <Text as="div" type="subtitle" text={translate('banner_body', highlightLink)} />
        </span>
      </button>
    )
  }

  if (!showBanner) return null

  return (
    <>
      {renderStaticBanner()}
      {!inView && renderStickyBanner()}
      <Spacer size="x2-large" />
      <MissingZipCodeDialog
        isOpen={isDialogOpen || forceShowDialog}
        isItemUpload={false}
        onClose={handleClose}
        onContinue={handleContinue}
      />
    </>
  )
}

export default MissingZipCodeBanner
