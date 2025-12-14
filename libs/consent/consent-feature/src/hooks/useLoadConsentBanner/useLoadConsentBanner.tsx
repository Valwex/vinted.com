'use client'

import { useLayoutEffect } from 'react'

const RETRY_INTERVAL_MS = 300

const useLoadConsentBanner = () => {
  useLayoutEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    const clearExistingTimeout = () => {
      if (!timeoutId) return

      clearTimeout(timeoutId)
      timeoutId = null
    }

    const applyBannerClass = () => {
      const onetrustBanner = document.getElementById('onetrust-banner-sdk')

      if (!onetrustBanner) {
        timeoutId = setTimeout(applyBannerClass, RETRY_INTERVAL_MS)

        return
      }

      onetrustBanner.classList.add('onetrust-banner-sdk--loaded')

      clearExistingTimeout()
    }

    applyBannerClass()

    return clearExistingTimeout
  }, [])
}

export default useLoadConsentBanner
