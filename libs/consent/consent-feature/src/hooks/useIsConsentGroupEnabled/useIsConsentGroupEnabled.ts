'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { CookieConsentVersion } from '@marketplace-web/consent/consent-data'

import { ConsentGroup } from '../../constants'
import useConsent from '../useConsent'
import { checkConsentGroup } from '../../utils'

const useIsConsentGroupEnabled = (group: ConsentGroup) => {
  const { cookieConsentVersion, optanonConsentCookie } = useConsent()

  const [isConsentGroupEnabled, setIsConsentGroupEnabled] = useState(
    checkConsentGroup(group, optanonConsentCookie()),
  )

  const handleBannerLoaded = useCallback(() => {
    setIsConsentGroupEnabled(checkConsentGroup(group, optanonConsentCookie()))
  }, [group, optanonConsentCookie])

  useEffect(() => {
    window.addEventListener('bannerLoaded', handleBannerLoaded)

    return () => {
      window.removeEventListener('bannerLoaded', handleBannerLoaded)
    }
  }, [handleBannerLoaded])

  return useMemo(() => {
    if (cookieConsentVersion === CookieConsentVersion.None) return true

    return isConsentGroupEnabled
  }, [isConsentGroupEnabled, cookieConsentVersion])
}

export default useIsConsentGroupEnabled
