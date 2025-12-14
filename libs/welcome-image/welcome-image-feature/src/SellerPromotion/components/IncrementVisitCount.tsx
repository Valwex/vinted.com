'use client'

import { useEffect } from 'react'

import { cookiesDataByName, createCookieManager } from '@marketplace-web/environment/cookies-util'

const cookieManager = createCookieManager()

const IncrementVisitCount = ({ visitsCount }: { visitsCount: number }) => {
  useEffect(() => {
    cookieManager.set(cookiesDataByName.seller_header_visits, String(visitsCount + 1))
  }, [visitsCount])

  return null
}

export default IncrementVisitCount
