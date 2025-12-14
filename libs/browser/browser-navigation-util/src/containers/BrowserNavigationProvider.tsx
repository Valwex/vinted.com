'use client'

import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ReactNode, useCallback, useMemo, useState } from 'react'

import { toNextJsParams } from '../utils/url'
import BrowserNavigationContext from './BrowserNavigationContext'

type Props = {
  children: ReactNode
  url: string
}

/** Note that url related fields are not available server side.
 * Next.js doesn't provide a proper way of getting the current URL server-side
 * and, as of now, we don't have use cases that cannot be solved without relying on URL from the provider (see https://nextjs.org/docs/app/api-reference/file-conventions/page#props)
 * For more context, see https://github.com/vercel/next.js/issues/43704
 */
const BrowserNavigationProvider = ({ children, url }: Props) => {
  // Value of this state isn't needed a goal is only to trigger rerender
  // eslint-disable-next-line react/hook-use-state
  const [, setRefresh] = useState(false)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const params = useParams()
  const { push: routerPush } = useRouter()

  const push = useCallback((href: string) => globalThis.history?.pushState({}, '', href), [])
  const replace = useCallback((href: string) => globalThis.history?.replaceState({}, '', href), [])
  const back = useCallback(() => window.history.back(), [])
  const refreshUrl = useCallback(() => setRefresh(prevState => !prevState), [])

  const value = useMemo(() => {
    const urlObject = new URL(url)
    if (pathname) urlObject.pathname = pathname
    if (searchParams) urlObject.search = searchParams.toString()

    return {
      url: urlObject.toString(),
      serverUrl: url,
      routerPush,
      push,
      replace,
      refreshUrl,
      back,
      urlParams: { ...params, ...toNextJsParams(urlObject.searchParams) },
    }
  }, [url, pathname, routerPush, params, searchParams, push, replace, refreshUrl, back])

  return (
    <BrowserNavigationContext.Provider value={value}>{children}</BrowserNavigationContext.Provider>
  )
}

export default BrowserNavigationProvider
