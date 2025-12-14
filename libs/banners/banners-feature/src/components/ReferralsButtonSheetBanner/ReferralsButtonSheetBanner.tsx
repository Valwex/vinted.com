'use client'

import { useEffect, useMemo } from 'react'

import { useTrackAbTestCallback, useAbTest } from '@marketplace-web/feature-flags/ab-tests-data'

import { ReferralsBottomSheetBannerModel } from '@marketplace-web/banners/banners-data'

import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@marketplace-web/browser/browser-storage-util'

import ReferralsButtonSheet from './ReferralsButtonSheet'

const getStorageKey = (name: string) => {
  return `last_home_visit_time_${name}`
}

type Props = {
  banner: ReferralsBottomSheetBannerModel
}

const ReferralsButtonSheetBanner = ({ banner }: Props) => {
  const hasAllRequiredFields = Boolean(
    banner.imageUrl &&
      banner.darkImageUrl &&
      banner.title &&
      banner.body &&
      banner.actions?.primary?.title,
  )
  const referralBannerAbTest = useAbTest(banner.abTest.name)
  const trackAbTest = useTrackAbTestCallback()

  const shouldShowBanner = useMemo(() => {
    const storageKey = getStorageKey(banner.name)
    const lastHomeVisitTime = getLocalStorageItem(storageKey)

    if (!lastHomeVisitTime) {
      setLocalStorageItem(storageKey, new Date().toISOString())

      return false
    }

    const lastTime = new Date(lastHomeVisitTime)
    const currentTime = new Date()
    const diffTimeInMilliseconds = currentTime.getTime() - lastTime.getTime()
    const diffTimeInMinutes = diffTimeInMilliseconds / (1000 * 60)

    if (diffTimeInMinutes < banner.delayInMinutes) return false

    removeLocalStorageItem(storageKey)

    return true
  }, [banner.name, banner.delayInMinutes])

  useEffect(() => {
    if (!referralBannerAbTest || !shouldShowBanner) return

    trackAbTest(referralBannerAbTest, true)
  }, [shouldShowBanner, trackAbTest, referralBannerAbTest])

  if (!shouldShowBanner) return null
  if (!hasAllRequiredFields) return null

  return <ReferralsButtonSheet banner={banner} />
}

export default ReferralsButtonSheetBanner
