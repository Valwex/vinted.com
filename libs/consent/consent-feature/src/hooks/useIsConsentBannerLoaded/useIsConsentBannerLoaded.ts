'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

const useIsConsentBannerLoaded = () => {
  const [isBannerLoaded, setIsBannerLoaded] = useState(
    typeof window !== 'undefined' && !!window.OneTrust,
  )

  const handleBannerLoaded = useCallback(() => {
    setIsBannerLoaded(true)
  }, [])

  useEffect(() => {
    window.addEventListener('bannerLoaded', handleBannerLoaded)

    return () => {
      window.removeEventListener('bannerLoaded', handleBannerLoaded)
    }
  }, [handleBannerLoaded])

  return useMemo(() => isBannerLoaded, [isBannerLoaded])
}

export default useIsConsentBannerLoaded
