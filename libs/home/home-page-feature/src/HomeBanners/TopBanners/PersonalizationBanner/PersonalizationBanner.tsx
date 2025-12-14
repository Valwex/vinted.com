'use client'

import { Button, Text } from '@vinted/web-ui'

import { Banner } from '@marketplace-web/common-components/banner-ui'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { clickEvent } from '@marketplace-web/home/home-page-data'
import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'
import { FeedPersonalizationBannerModel } from '@marketplace-web/home/feed-personalisation-banner-data'

import { USER_PERSONALIZATION_SIZES_URL } from '../../../constants/routes'

type Props = {
  banner: Pick<
    FeedPersonalizationBannerModel,
    'bottomTitle' | 'bottomSubtitle' | 'bottomActionTitle'
  >
}

const PersonalizationBanner = ({ banner }: Props) => {
  const { track } = useTracking()
  const breakpoints = useBreakpoint()

  const handleClick = () => {
    const event = clickEvent({
      target: 'personalization_button_after_feed',
      targetDetails: 'feed_personalization_banner',
    })

    track(event)
  }

  const renderTitle = () => {
    return <Text text={banner.bottomTitle} type="heading" as="h2" />
  }

  const actions = [
    <Button
      text={banner.bottomActionTitle}
      url={USER_PERSONALIZATION_SIZES_URL}
      onClick={handleClick}
      styling="filled"
    />,
  ]

  return (
    <Banner
      isPhone={breakpoints.phones}
      title={renderTitle()}
      body={<Text text={banner.bottomSubtitle} as="p" />}
      actions={actions}
    />
  )
}

export default PersonalizationBanner
