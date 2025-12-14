'use client'

import { InView } from 'react-intersection-observer'
import { ReactNode, use, useRef } from 'react'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import {
  impressionEvent,
  ClosetModel,
  VasEntryPointModel,
  VasEntryPoint,
} from '@marketplace-web/vas/vas-data'

import ClosetPromotion from './ClosetPromotion'
import DynamicSpacer from '../DynamicSpacer'
import { ClosetPreviewLocation, setClosetPreviewAsSeen } from '../../utils/closetPreviewCap'

type Props = {
  position: number
  vasEntryPoints?: Array<VasEntryPointModel>
  homepageSessionId: string
  suffix?: ReactNode
  closet: ClosetModel | Promise<ClosetModel | null>
  renderFallback?: () => ReactNode
}

const HomeClosetPromotion = (props: Props) => {
  const { track } = useTracking()
  const isSeen = useRef(false)

  const closet = props.closet instanceof Promise ? use(props.closet) : props.closet
  if (!closet) return props.renderFallback?.()

  const closetPromoBanner = closet.showBanner
    ? props.vasEntryPoints?.find(entryPoint => entryPoint.name === VasEntryPoint.PromotedClosets)
    : undefined

  const handleVisible = (inView: boolean) => {
    if (isSeen.current) return
    if (!inView) return

    isSeen.current = true

    track(
      impressionEvent({
        id: closet.user.id,
        position: props.position,
        contentType: 'promoted_closet',
        contentSource: closet.isPreview ? 'promoted_closets_preview' : 'promoted_closets',
        homepageSessionId: props.homepageSessionId,
      }),
    )

    if (closet.isPreview) {
      setClosetPreviewAsSeen(ClosetPreviewLocation.Feed)
    }
  }

  return (
    <>
      <DynamicSpacer phones="Regular" tabletsUp="Large" />
      <InView onChange={handleVisible} data-testid={`closet-promotion-${closet.user.id}`}>
        <ClosetPromotion
          wide
          banner={closetPromoBanner}
          isPreview={!!closet.isPreview}
          homepageSessionId={props.homepageSessionId}
          position={props.position}
          closet={closet}
        />
      </InView>
      {props.suffix}
    </>
  )
}

export default HomeClosetPromotion
