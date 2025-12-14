'use client'

import { MouseEvent, ReactNode, useEffect, useState } from 'react'
import { Cell } from '@vinted/web-ui'
import { noop } from 'lodash'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'

import {
  getInfoBanner,
  InfoBannerModel,
  transformInfoBannerDto,
  ClickEventArgs,
  clickEvent,
} from '@marketplace-web/info-banner/info-banner-data'

import ExtraNotice from '../ExtraNotice'
import InfoBannerCard from '../InfoBannerCard'

type Props = {
  disabled?: boolean
  screen: string
  params?: Record<string, number | string>
  linkTracking?: ClickEventArgs
  render?: (banner: InfoBannerModel) => ReactNode
  onAnchorClick?: (event: MouseEvent) => void
  theme?: React.ComponentProps<typeof Cell>['theme']
  onBannerLoad?: (isBannerPresent: boolean) => void
}

const InfoBanner = ({
  screen,
  params,
  disabled,
  linkTracking,
  render,
  onAnchorClick = noop,
  theme,
  onBannerLoad = noop,
}: Props) => {
  const { track } = useTracking()
  const [banner, setBanner] = useState<InfoBannerModel>()

  // This would prevent refetching if memory ref for params has changed
  const paramsString = JSON.stringify(params)

  useEffect(() => {
    async function fetchBanners() {
      const response = await getInfoBanner({
        screen,
        params: paramsString && JSON.parse(paramsString),
      })

      if ('errors' in response) return

      onBannerLoad(!!response.info_banner)

      if (!response.info_banner) return

      setBanner(transformInfoBannerDto(response.info_banner))
    }

    fetchBanners()
  }, [paramsString, screen, onBannerLoad])

  function handleAnchorElementClick(event: MouseEvent) {
    onAnchorClick(event)

    if (!linkTracking) return
    if (!(event.target instanceof HTMLAnchorElement)) return

    track(clickEvent({ screen, ...linkTracking }))
  }

  if (!banner) return null

  if (render)
    return (
      <div role="none" onClick={handleAnchorElementClick}>
        {render(banner)}
      </div>
    )

  return (
    <div className="info-banner-container">
      {banner.extraNotice && <ExtraNotice screen={screen} banner={banner} />}
      <InfoBannerCard
        banner={banner}
        disabled={disabled}
        onBannerClick={handleAnchorElementClick}
        theme={theme}
      />
    </div>
  )
}

export default InfoBanner
