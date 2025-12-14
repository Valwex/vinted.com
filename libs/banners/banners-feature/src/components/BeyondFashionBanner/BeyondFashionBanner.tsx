'use client'

import { useMemo } from 'react'

import {
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
} from '@marketplace-web/browser/browser-storage-util'
import { BeyondFashionBannerModel } from '@marketplace-web/banners/banners-data'

import BeyondFashion from './BeyondFashion'

type Props = {
  banner: BeyondFashionBannerModel
}

const getStorageKey = (name: string) => {
  return `last_home_visit_time_${name}`
}

const BeyondFashionBanner = ({ banner }: Props) => {
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

  if (!shouldShowBanner) return null

  return <BeyondFashion banner={banner} />
}

export default BeyondFashionBanner
