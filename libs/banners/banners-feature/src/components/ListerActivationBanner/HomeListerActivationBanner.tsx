'use client'

import { useInView } from 'react-intersection-observer'
import { useRef } from 'react'

import { impressionEvent } from '@marketplace-web/banners/banners-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'

import useHomeListerActivationBanner from './useHomeListerActivationBanner'
import ListerActivationBanner from './ListerActivationBanner'

type Props = ReturnType<typeof useHomeListerActivationBanner> & {
  position: number
}

const LISTER_ACTIVATION_BREAKPOINT_ITEM_COUNT = {
  phones: 1,
  tablets: 3,
  default: 4,
}

const HomeListerActivationBanner = (props: Props) => {
  const banner = props.generateListerActivationBannerItem(props.position)
  const { track } = useTracking()
  const wasSeen = useRef(false)

  const { ref } = useInView({
    onChange: inView => {
      if (!inView || wasSeen.current) return

      track(
        impressionEvent({
          id: banner.catalogId,
          position: props.position,
          contentType: 'lister_activation_banner',
          contentSource: 'lister_activation_banner',
        }),
      )

      wasSeen.current = true
    },
  })

  if (!banner) return null

  return (
    <ListerActivationBanner
      banner={banner}
      onClose={() => props.handleBannerDismiss(props.position)}
      breakpointItemCount={LISTER_ACTIVATION_BREAKPOINT_ITEM_COUNT}
      ref={ref}
    />
  )
}

export default HomeListerActivationBanner
