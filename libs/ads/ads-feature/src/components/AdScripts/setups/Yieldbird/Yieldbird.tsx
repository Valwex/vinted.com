'use client'

import { useEffect } from 'react'
import Script from 'next/script'

import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'

import { getYieldbirdDomainKey, initYieldbird } from './utils'

const Yieldbird = () => {
  const yieldbirdDomainKey = getYieldbirdDomainKey(useBrowserNavigation().host)

  useEffect(() => {
    initYieldbird()
  }, [])

  if (!yieldbirdDomainKey) return null

  return (
    <Script
      id="yieldbird-script"
      data-testid="yieldbird-script"
      src={`//cdn.qwtag.com/${yieldbirdDomainKey}/qw.js`}
      strategy="lazyOnload"
    />
  )
}

export default Yieldbird
