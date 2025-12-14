'use client'

import { Suspense, useCallback } from 'react'

import { AdsPlacementModel, AdKind } from '@marketplace-web/ads/ads-data'

import RtbAdvertisement from '../RtbAdvertisement'
import AdInfo from '../AdInfo'
import VanAdvertisement from '../VanAdvertisement'
import useAdEventTracking from '../../../hooks/useAdEventTracking'

type Props = {
  id: string
  placementConfig: AdsPlacementModel
  isManuallyRefreshed: boolean
  isManuallyRendered: boolean
  onAdRender: (isAdVisible: boolean) => void
  isAdRendered: boolean
  handleVanAdPriority: () => void
  iabCategories?: Array<string> | null
}

const AdContent = ({
  id,
  placementConfig,
  isManuallyRefreshed,
  isManuallyRendered,
  onAdRender,
  isAdRendered,
  handleVanAdPriority,
  iabCategories,
}: Props) => {
  const { viewableImpressionRef, impressionRef } = useAdEventTracking({
    isAdRendered,
    placementConfig,
  })

  const onAdError = useCallback(() => {
    handleVanAdPriority()
  }, [handleVanAdPriority])

  const renderAdByKind = useCallback(() => {
    if (placementConfig.kind === AdKind.Van) {
      return (
        <VanAdvertisement
          id={id}
          config={placementConfig}
          onAdRender={onAdRender}
          onAdError={onAdError}
        />
      )
    }

    if (placementConfig.kind === AdKind.Rtb) {
      return (
        <RtbAdvertisement
          id={id}
          config={placementConfig}
          isManuallyRendered={isManuallyRendered}
          isManuallyRefreshed={isManuallyRefreshed}
          onAdRender={onAdRender}
          iabCategories={iabCategories}
        />
      )
    }

    return null
  }, [
    placementConfig,
    id,
    onAdRender,
    isManuallyRendered,
    isManuallyRefreshed,
    onAdError,
    iabCategories,
  ])

  return (
    <Suspense>
      <div className="slot-content" suppressHydrationWarning>
        {isAdRendered && placementConfig.kind === AdKind.Rtb && <AdInfo placementId={id} />}
        <div ref={viewableImpressionRef}>
          <div ref={impressionRef}>{renderAdByKind()}</div>
        </div>
      </div>
    </Suspense>
  )
}

export default AdContent
