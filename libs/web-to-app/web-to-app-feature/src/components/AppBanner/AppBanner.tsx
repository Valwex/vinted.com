'use client'

import { Button, Cell, Divider, Image, Rating, Spacer, Text } from '@vinted/web-ui'
import { useState } from 'react'
import { useIsClient } from 'usehooks-ts'

import { cookiesDataByName, useCookie } from '@marketplace-web/environment/cookies-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useUserAgent } from '@marketplace-web/environment/request-context-data'
import { useSession } from '@marketplace-web/shared/session-data'
import { useAsset } from '@marketplace-web/shared/assets'
import { clickEvent } from '@marketplace-web/web-to-app/web-to-app-data'

import { isIOS, isAndroid, parseOS } from '../../utils/device'

// It is decided to have hardcoded app rating with no need to sync it with store
const APP_RATING = 4.5
const APP_RATING_MAX = 5
const APP_URL =
  'https://4uwb.adj.st/?adjust_t=l2fpdc8_rnxf4nj&adjust_campaign=UX_SmartBanner&adjust_engagement_type=fallback_click'
const LATEST_ALLOWED_ANDROID_VERSION = 7

const AppBanner = () => {
  const { track } = useTracking()
  const translate = useTranslate('app_banner')
  const translateRating = useTranslate()
  const userAgent = useUserAgent()
  const userId = useSession().user?.id
  const asset = useAsset('/assets/logo/square')
  const isClientSide = useIsClient()
  const cookies = useCookie()

  const getAndroidVersion = () => {
    const match = userAgent.toLowerCase().match(/android\s([0-9.]*)/i)

    return match ? parseInt(match[1]!, 10) : LATEST_ALLOWED_ANDROID_VERSION
  }

  const shouldNotRenderOnMobile = () =>
    !isIOS(userAgent) &&
    !(isAndroid(userAgent) && getAndroidVersion() >= LATEST_ALLOWED_ANDROID_VERSION)

  const [isHidden, setIsHidden] = useState(false)

  if (!isClientSide) return null
  if (isHidden) return null
  if (userId) return null
  if (cookies.get(cookiesDataByName.app_banner)) return null
  if (shouldNotRenderOnMobile()) return null

  function trackClick(target: Parameters<typeof clickEvent>[0]['target']) {
    track(
      clickEvent({
        target,
        targetDetails: parseOS(userAgent),
      }),
    )
  }

  function handleOpenClick() {
    trackClick('install_app_banner')
  }

  function handleCloseClick() {
    setIsHidden(true)
    trackClick('cancel_install_app_banner')
    cookies.set(cookiesDataByName.app_banner, 'hidden')
  }

  function renderActions() {
    return (
      <div className="u-flexbox">
        <Button
          size="medium"
          text={translate('close_cta')}
          onClick={handleCloseClick}
          testId="app-banner-close-button"
        />
        <Spacer orientation="vertical" />
        <Button
          theme="primary"
          styling="filled"
          size="medium"
          text={translate('cta')}
          onClick={handleOpenClick}
          url={APP_URL}
          testId="app-banner-open-button"
        />
      </div>
    )
  }

  function renderTabletActions() {
    return <div className="u-tablets-only">{renderActions()}</div>
  }

  function renderPhoneActions() {
    return (
      <div className="u-phones-only">
        <Spacer size="large" />
        <Cell styling="tight">{renderActions()}</Cell>
      </div>
    )
  }

  function renderTitle() {
    return (
      <div className="u-flexbox">
        <Text as="h2" type="title" text={translate('title')} truncate />
        <Spacer orientation="vertical" size="small" />
        <div>
          <Spacer size="x-small" />
          <Rating
            value={APP_RATING}
            aria={{
              'aria-labelledby': translateRating('user.a11y.rating', {
                rating: APP_RATING,
                max_rating: APP_RATING_MAX,
              }),
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="sticky-footer" data-testid="app-banner-wrapper">
      <div className="u-line-height-default">
        <Divider />
        <Cell>
          <Cell
            styling="tight"
            prefix={<Image size="large" src={asset('transparent.png')} />}
            suffix={renderTabletActions()}
            title={renderTitle()}
            body={<Text as="span" text={translate('description')} truncate />}
            fullWidthTitle
          />

          {renderPhoneActions()}
        </Cell>
      </div>
    </div>
  )
}

export default AppBanner
