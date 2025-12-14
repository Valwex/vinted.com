'use client'

import { useCallback, useContext, useMemo } from 'react'

import { toParams } from '@marketplace-web/browser/url-util'

import { navigateToPage } from '../utils/location'

import BrowserNavigationContext from '../containers/BrowserNavigationContext'

const useBrowserNavigation = () => {
  const context = useContext(BrowserNavigationContext)

  if (!context) throw new Error('useBrowserNavigation must be used within BrowserNavigationContext')

  const { url, serverUrl, urlParams, routerPush, back, push, replace, refreshUrl } = context

  const safeBack = useCallback(
    (fallbackUrl: string) => {
      if (document.referrer.indexOf(new URL(url).origin) === -1) {
        navigateToPage(fallbackUrl)
      } else {
        back()
      }
    },
    [back, url],
  )

  const initialSearchParams = useMemo(() => toParams(new URL(serverUrl).search), [serverUrl])

  const currentUrl = useMemo(() => new URL(url), [url])
  const searchParams = useMemo(() => toParams(currentUrl.search), [currentUrl.search])

  return useMemo(
    () => ({
      href: currentUrl.href,
      baseUrl: currentUrl.origin,
      host: currentUrl.host,
      urlQuery: currentUrl.search,
      relativeUrl: currentUrl.pathname,
      urlHash: currentUrl.hash,
      searchParams,
      initialSearchParams,
      urlParams,
      safeBack,
      goToPreviousPage: back,
      pushHistoryState: push,
      routerPush,
      replaceHistoryState: replace,
      refreshUrl,
    }),
    [
      back,
      currentUrl,
      initialSearchParams,
      push,
      refreshUrl,
      replace,
      routerPush,
      safeBack,
      urlParams,
      searchParams,
    ],
  )
}

export default useBrowserNavigation
