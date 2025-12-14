'use client'

import { isEqual } from 'lodash'
import { ReactNode, Suspense, useRef } from 'react'

import { HomeAdvertisement } from '@marketplace-web/ads/ads-feature'
import { ClosetModel, VasEntryPointModel } from '@marketplace-web/vas/vas-data'
import { ErrorBoundary } from '@marketplace-web/error-display/error-display-util'

import HomeClosetPromotion from '../components/ClosetPromotion/HomeClosetPromotion'
import ClosetSkeleton from '../components/ClosetSkeleton'

type Ad = 'ad' | 'fallback-ad'
type Closet = ClosetModel | Promise<ClosetModel | null>
type Entity = 'empty' | 'ad' | 'fallback-ad' | Closet

const isPending = (item: Entity): item is Promise<ClosetModel | null> => item instanceof Promise
const isAd = (item: Entity): item is Ad => item === 'ad' || item === 'fallback-ad'
const isEmpty = (item: Entity): item is 'empty' => item === 'empty'
const isCloset = (item: Entity): item is Closet => !isAd(item) && !isEmpty(item)

type Props = {
  vasEntryPoints?: Array<VasEntryPointModel>
  closets: Array<ClosetModel>
  arePromotedClosetsEnabled: boolean
  areAdsEnabled: boolean
  homepageSessionId: string
  fetchMoreClosets?: () => Promise<Array<ClosetModel> | undefined>
}

type RenderProps = {
  position: number
  id: string | number
  suffix?: ReactNode
  renderFallback?: () => ReactNode
}

const useHomeClosetOrAd = ({
  vasEntryPoints,
  closets,
  areAdsEnabled,
  arePromotedClosetsEnabled,
  homepageSessionId,
  fetchMoreClosets,
}: Props) => {
  const renderedSequence = useRef<Array<Entity>>([])
  let pendingClosetIndex = 0
  let currentIndex = 0

  const getFetchedCloset = async () => {
    const closetIndex = pendingClosetIndex
    const result = await fetchMoreClosets?.()

    return result?.[closetIndex] ?? null
  }

  const getNewCloset = () => {
    if (!arePromotedClosetsEnabled) return null
    const remainingClosets = closets.filter(closet => {
      const wasClosetRendered = renderedSequence.current.some(value => isEqual(closet, value))

      return !wasClosetRendered
    })

    return remainingClosets[0] || getFetchedCloset() || null
  }

  const getNewClosetOrAd = (index: number): Entity => {
    const shouldRenderCloset = index % 2 === 0

    if (shouldRenderCloset) return getNewCloset() ?? 'fallback-ad'

    return 'ad'
  }

  const renderFallbackAd = (props: RenderProps) => {
    if (!areAdsEnabled) return null

    return <HomeAdvertisement {...props} />
  }

  const renderCloset = (closet: Closet, index: number, props: RenderProps) => {
    const commonProps = { ...props, vasEntryPoints, homepageSessionId }

    if (isPending(closet)) {
      pendingClosetIndex += 1
      // We assume the promise is always pending, so we need to mark it as resolved
      closet.then(result => {
        const fallback = props.renderFallback ? 'fallback-ad' : 'empty'
        renderedSequence.current[index] = result ?? fallback
      })

      return (
        <Suspense fallback={<ClosetSkeleton suffix={props.suffix} />}>
          <HomeClosetPromotion {...commonProps} closet={closet} />
        </Suspense>
      )
    }

    return (
      <ErrorBoundary>
        <HomeClosetPromotion {...commonProps} closet={closet} />
      </ErrorBoundary>
    )
  }

  const renderFallbackCloset = (props: RenderProps, index: number) => {
    const renderedFallback = renderedSequence.current[index]
    if (renderedFallback && isCloset(renderedFallback))
      return renderCloset(renderedFallback, index, props)

    const fallback = getNewCloset()
    if (!fallback) {
      renderedSequence.current[index] = 'empty'

      return null
    }
    renderedSequence.current[index] = fallback

    return renderCloset(fallback, index, props)
  }

  const renderClosetOrAdComponent = (props: RenderProps) => {
    const index = currentIndex
    const entity = renderedSequence.current[index] ?? getNewClosetOrAd(index)
    renderedSequence.current[index] ??= entity

    currentIndex += 1

    if (isEmpty(entity)) return null
    if (entity === 'ad') {
      if (!areAdsEnabled) return renderFallbackCloset(props, index)

      return (
        <ErrorBoundary>
          <HomeAdvertisement {...props} renderFallback={() => renderFallbackCloset(props, index)} />
        </ErrorBoundary>
      )
    }
    if (entity === 'fallback-ad') return renderFallbackAd(props)

    return renderCloset(entity, index, { ...props, renderFallback: () => renderFallbackAd(props) })
  }

  return {
    renderClosetOrAdComponent,
  }
}

export default useHomeClosetOrAd
