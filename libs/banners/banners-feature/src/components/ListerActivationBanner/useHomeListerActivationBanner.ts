'use client'

import { useCallback, useRef } from 'react'
import { shuffle } from 'lodash'

import { dismissBanner, ListerActivationBannerModel } from '@marketplace-web/banners/banners-data'

import useBanners from '../../hooks/useBanners'

const getRandomizedListerActivationBanner = (
  banners: Array<ListerActivationBannerModel>,
): ListerActivationBannerModel | null => {
  if (!banners.length) return null

  const targetBannerIndex = Math.floor(Math.random() * banners.length)
  const targetBanner = banners[targetBannerIndex]!

  return {
    ...targetBanner,
    imageUrls: shuffle(targetBanner.imageUrls),
  }
}

const useHomeListerActivationBanner = () => {
  const { banners } = useBanners()
  const shownBanners = useRef(new Map())
  const canGenerateNewBanners = useRef(true)

  const generateListerActivationBannerItem = useCallback(
    (index: number) => {
      const shownBanner = shownBanners.current.get(index)
      if (shownBanner) return shownBanner
      if (!canGenerateNewBanners.current) return null

      const banner = getRandomizedListerActivationBanner(banners.listerActivation)
      shownBanners.current.set(index, banner)

      return banner
    },
    [banners.listerActivation, canGenerateNewBanners],
  )

  const handleBannerDismiss = useCallback((index: number) => {
    shownBanners.current.delete(index)
    canGenerateNewBanners.current = false

    dismissBanner('lister_activation')
  }, [])

  return { generateListerActivationBannerItem, handleBannerDismiss }
}

export default useHomeListerActivationBanner
