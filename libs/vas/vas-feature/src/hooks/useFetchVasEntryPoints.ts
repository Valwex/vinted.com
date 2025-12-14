'use client'

import { useCallback, useEffect, useRef } from 'react'

import { useFetch } from '@marketplace-web/core-api/api-client-util'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useSession } from '@marketplace-web/shared/session-data'
import {
  getVasEntryPoints,
  transformVasEntryPointsResponse,
  VasEntryPoint,
} from '@marketplace-web/vas/vas-data'

const useFetchVasEntryPoints = (entryPointNames: Array<VasEntryPoint>, isDisabled?: boolean) => {
  const { user: currentUser } = useSession()
  const isClosetPromotionKillswitchEnabled = useFeatureSwitch('killswitch_closet_promotion_web')

  const {
    fetch: fetchVasEntryPoints,
    transformedData: data,
    isLoading,
    error,
  } = useFetch(getVasEntryPoints, transformVasEntryPointsResponse)

  const filteredEntryPointNamesRef = useRef<Array<VasEntryPoint>>(
    isClosetPromotionKillswitchEnabled
      ? entryPointNames.filter(entryPoint => entryPoint !== VasEntryPoint.PromotedClosets)
      : entryPointNames,
  )

  const fetchClosetPromotionEntryPoint = useCallback(async () => {
    if (isClosetPromotionKillswitchEnabled) return undefined
    if (!currentUser) return undefined

    const { transformedData: vasEntryPoints } = await fetchVasEntryPoints({
      bannerNames: [VasEntryPoint.PromotedClosets],
    })

    const closetPromoBanner = vasEntryPoints?.find(
      entryPoint => entryPoint.name === VasEntryPoint.PromotedClosets,
    )

    return closetPromoBanner
  }, [isClosetPromotionKillswitchEnabled, currentUser, fetchVasEntryPoints])

  useEffect(() => {
    if (!currentUser) return
    if (!filteredEntryPointNamesRef.current.length) return
    if (isDisabled) return

    fetchVasEntryPoints({ bannerNames: filteredEntryPointNamesRef.current })
  }, [fetchVasEntryPoints, isDisabled, filteredEntryPointNamesRef, currentUser])

  return {
    data,
    isLoading,
    error,
    fetchClosetPromotionEntryPoint,
  }
}

export default useFetchVasEntryPoints
