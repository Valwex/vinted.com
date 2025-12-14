'use client'

import { VasEntryPoint, VasEntryPointModel } from '@marketplace-web/vas/vas-data'
import { useLatestCallback } from '@marketplace-web/shared/ui-state-util'

import useFetchVasEntryPoints from './useFetchVasEntryPoints'
import useHomeClosetOrAd from './useHomeClosetOrAd'
import useFetchClosetPromotions from './useFetchClosetPromotions'
import { ClosetPreviewLocation, getIsClosetPreviewSeen } from '../utils/closetPreviewCap'

type Props = {
  arePromotedClosetsEnabled: boolean
  areAdsEnabled: boolean
  homepageSessionId: string
  catalogId?: string
}

const useHomeInserts = (props: Props) => {
  const isClosetPreviewSeen = getIsClosetPreviewSeen(ClosetPreviewLocation.Feed)

  const {
    data: vasEntryPoints,
    error: vasEntryPointsError,
    fetchClosetPromotionEntryPoint,
  } = useFetchVasEntryPoints(
    [VasEntryPoint.PromotedClosets],
    !props.arePromotedClosetsEnabled || !isClosetPreviewSeen,
  )

  const { closets, fetchClosetPromo } = useFetchClosetPromotions()

  const fetchMoreClosets = useLatestCallback(async () => {
    if (!props.arePromotedClosetsEnabled) return undefined

    let closetPromotionEntryPoint: VasEntryPointModel | undefined

    if (!vasEntryPoints && !vasEntryPointsError && !isClosetPreviewSeen) {
      closetPromotionEntryPoint = await fetchClosetPromotionEntryPoint()
    }

    const closetResponse = await fetchClosetPromo({
      isPreview: !!closetPromotionEntryPoint,
      catalogId: props.catalogId,
    })
    closetResponse?.setClosets?.()

    return closetResponse?.newClosets
  })

  const returnValue = useHomeClosetOrAd({
    ...props,
    fetchMoreClosets,
    vasEntryPoints,
    closets,
  })

  return returnValue
}

export default useHomeInserts
