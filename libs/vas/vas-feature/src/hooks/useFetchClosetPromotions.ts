'use client'

import { useState, useCallback, useRef } from 'react'
import { isEmpty } from 'lodash'

import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import {
  getClosetPromotions,
  transformClosets,
  ClosetModel,
  getClosetPromotionsSvcVas,
  transformClosetsSvcVas,
  ClosetDtoSvcVas,
  ClosetDto,
} from '@marketplace-web/vas/vas-data'
import {
  getFirstListedBreakpoint,
  useBreakpoint,
} from '@marketplace-web/breakpoints/breakpoints-feature'
import { useSession } from '@marketplace-web/shared/session-data'
import { useAbTest, useTrackAbTestCallback } from '@marketplace-web/feature-flags/ab-tests-data'

type Options = { fresh?: boolean; isPreview?: boolean; catalogId?: string }

const useFetchClosetPromotions = () => {
  const breakpoints = useBreakpoint()
  const isClosetPromotionKillswitchEnabled = useFeatureSwitch('killswitch_closet_promotion_web')
  const currentUserId = useSession()?.user?.id
  const vasApiGatewaySwapPromotedClosetsAbTest = useAbTest('vas_api_gateway_swap_promoted_closets')
  const isVasApiGatewaySwapPromotedClosetsAbTestOn =
    vasApiGatewaySwapPromotedClosetsAbTest?.variant === 'on'
  const trackExpose = useTrackAbTestCallback()

  const [closets, setClosets] = useState<Array<ClosetModel>>([])
  const hasMore = useRef(true)

  const resetClosets = () => {
    setClosets([])
    hasMore.current = true
  }

  const fetchClosetPromo = useCallback(
    async (options?: Options) => {
      if (options?.fresh) resetClosets()

      const shouldFetch = !isClosetPromotionKillswitchEnabled && hasMore.current
      if (!shouldFetch) return null

      const userIds = options?.fresh ? [] : closets.map(closet => closet.user.id)
      const breakpoint = getFirstListedBreakpoint(breakpoints.active) || 'phones'
      const breakpointToClosetPromoCount = {
        wide: 4,
        desktops: 4,
        tablets: 5,
        phones: 5,
      }
      const closetPromoCount = breakpointToClosetPromoCount[breakpoint]

      const filterParams = options?.catalogId
        ? {
            filters: {
              catalog_ids: options.catalogId,
            },
            dynamicFilters: {},
          }
        : undefined

      const response = isVasApiGatewaySwapPromotedClosetsAbTestOn
        ? await getClosetPromotionsSvcVas({
            perPage: closetPromoCount,
            excludedUserIds: userIds,
            screenName: 'homepage',
            isPreview: options?.isPreview,
            catalogFilterParams: filterParams,
          })
        : await getClosetPromotions({
            perPage: closetPromoCount,
            excludedUserIds: userIds,
            screenName: 'homepage',
            isPreview: options?.isPreview,
            catalogFilterParams: filterParams,
          })

      trackExpose(vasApiGatewaySwapPromotedClosetsAbTest)

      if ('errors' in response || 'error' in response) return null

      const transformedClosets = isVasApiGatewaySwapPromotedClosetsAbTestOn
        ? transformClosetsSvcVas(response.promoted_closets as Array<ClosetDtoSvcVas>)
        : transformClosets(response.promoted_closets as Array<ClosetDto>)
      hasMore.current = response.page_info.has_more

      if (isEmpty(transformedClosets)) return null

      const isFirstFetch = options?.fresh || (!closets.length && transformedClosets.length > 0)

      if (isFirstFetch && transformedClosets[0]) {
        transformedClosets[0].showBanner = true

        const isViewingOwnCloset = currentUserId === transformedClosets[0].user.id

        if (options?.isPreview && isViewingOwnCloset) transformedClosets[0].isPreview = true
      }

      return {
        newClosets: transformedClosets,
        setClosets: () => setClosets(prevArray => [...prevArray, ...transformedClosets]),
      }
    },
    [
      isClosetPromotionKillswitchEnabled,
      closets,
      breakpoints.active,
      currentUserId,
      vasApiGatewaySwapPromotedClosetsAbTest,
      isVasApiGatewaySwapPromotedClosetsAbTestOn,
      trackExpose,
    ],
  )

  const fetchPromiseRef = useRef<ReturnType<typeof fetchClosetPromo>>(null)

  const deduplicatedFetch: typeof fetchClosetPromo = useCallback(
    async options => {
      if (fetchPromiseRef.current) return fetchPromiseRef.current

      const fetchPromise = fetchClosetPromo(options)
      fetchPromiseRef.current = fetchPromise
      const result = await fetchPromise
      fetchPromiseRef.current = null

      return result
    },
    [fetchClosetPromo],
  )

  return { closets, fetchClosetPromo: deduplicatedFetch }
}

export default useFetchClosetPromotions
