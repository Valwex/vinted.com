'use client'

import { useCallback, useEffect, useState } from 'react'

import { cookiesDataByName, createCookieManager } from '@marketplace-web/environment/cookies-util'

import { ConsentGroup } from '../../constants'
import { checkConsentGroup } from '../../utils'

const cookieManager = createCookieManager()

type Props = {
  children: React.ReactNode
  hasConsented: boolean
  consentGroup: ConsentGroup
}

const ClientConsentUpdate = ({ children, hasConsented: hasConsentedProp, consentGroup }: Props) => {
  const [hasConsented, setHasConsented] = useState(hasConsentedProp)

  const handleBannerLoaded = useCallback(() => {
    setHasConsented(
      checkConsentGroup(consentGroup, cookieManager.get(cookiesDataByName.OptanonConsent)),
    )
  }, [consentGroup])

  useEffect(() => {
    window.addEventListener('bannerLoaded', handleBannerLoaded)

    return () => {
      window.removeEventListener('bannerLoaded', handleBannerLoaded)
    }
  }, [handleBannerLoaded])

  if (!hasConsented) {
    return null
  }

  return children
}

export default ClientConsentUpdate
