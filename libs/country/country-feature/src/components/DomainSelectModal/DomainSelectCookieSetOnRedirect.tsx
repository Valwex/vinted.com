'use client'

import { useEffect } from 'react'

import { cookiesDataByName, useCookie } from '@marketplace-web/environment/cookies-util'

const DomainSelectCookieSetOnRedirect = () => {
  const cookies = useCookie()

  useEffect(() => {
    cookies.set(cookiesDataByName.domain_selected, 'true')
  }, [cookies])

  return null
}

export default DomainSelectCookieSetOnRedirect
