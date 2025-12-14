'use client'

import { InView } from 'react-intersection-observer'
import { useRef, type ReactNode } from 'react'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { impressionEvent, AdShape } from '@marketplace-web/ads/ads-data'

import Advertisement from './Advertisement'

type Props = {
  id: string | number
  position: number
  renderFallback?: () => ReactNode
  suffix?: ReactNode
}

const HomeAdvertisement = (props: Props) => {
  const { track } = useTracking()
  const isSeen = useRef(false)

  const handleVisible = (inView: boolean) => {
    if (isSeen.current) return
    if (!inView) return

    isSeen.current = true
    track(
      impressionEvent({
        id: props.id,
        position: props.position,
        contentType: 'ad',
        contentSource: 'feed_ad',
      }),
    )
  }

  return (
    <InView onChange={handleVisible}>
      <Advertisement
        isIncremental
        shape={AdShape.Inbetween}
        renderFallback={props.renderFallback}
        suffix={props.suffix}
      />
    </InView>
  )
}

export default HomeAdvertisement
