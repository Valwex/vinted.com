'use client'

import { useRef } from 'react'

import { HorizontalScrollArea } from '@marketplace-web/common-components/horizontal-scroll-area-ui'
import { HomepageBanner } from '@marketplace-web/banners/banners-feature'
import { BannerLayoutModel } from '@marketplace-web/banners/banners-data'
import {
  userClickHomepageElement,
  userViewHomepageElement,
} from '@marketplace-web/home/home-page-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

import HomepageBlockLayout from '../HomepageBlockLayout'

type Props = {
  elements: Array<BannerLayoutModel>
  name: string
  position: number
  homepageSessionId: string
  id: string
}

const BannersBlock = ({ elements, name, position, homepageSessionId, id }: Props) => {
  const { track } = useTracking()
  const seenBannerIndexes = useRef<Array<number>>([])
  const translateA11y = useTranslate('a11y')

  const bannerType = elements.length === 1 ? 'wide' : 'narrow'

  const getTrackingData = (banner: BannerLayoutModel, index: number) => ({
    blockName: name,
    position: index + 1,
    contentSource: banner.contentSource,
    contentSourceLabel: '',
    contentSourceId: banner.id,
    homepageSessionId,
    screen: 'news_feed',
  })

  const handleItemClick = (banner: BannerLayoutModel, index: number) => () => {
    track(userClickHomepageElement(getTrackingData(banner, index)))
  }

  const handleItemView = (banner: BannerLayoutModel, index: number) => (inView: boolean) => {
    if (!inView) return
    if (seenBannerIndexes.current.includes(index)) return

    seenBannerIndexes.current.push(index)

    track(userViewHomepageElement(getTrackingData(banner, index)))
  }

  const renderBanners = () =>
    elements.map((banner, index) => (
      <HomepageBanner
        key={index}
        banner={banner}
        type={bannerType}
        onClick={handleItemClick(banner, index)}
        onView={handleItemView(banner, index)}
      />
    ))

  return (
    <HomepageBlockLayout
      name={name}
      position={position}
      homepageSessionId={homepageSessionId}
      id={id}
      body={
        <HorizontalScrollArea
          controlsScrollType={HorizontalScrollArea.ControlScrollType.Partial}
          arrowLeftText={translateA11y('actions.move_left')}
          arrowRightText={translateA11y('actions.move_right')}
        >
          <div className={`${bannerType}-banners-layout-container`}>{renderBanners()}</div>
        </HorizontalScrollArea>
      }
    />
  )
}

export default BannersBlock
