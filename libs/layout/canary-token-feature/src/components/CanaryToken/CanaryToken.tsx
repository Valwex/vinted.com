'use client'

import { useEffect, useState } from 'react'
import { useIsClient, useIsMounted } from 'usehooks-ts'

import { isInternalHostname, normalizeHost } from '@marketplace-web/browser/url-util'

const CanaryToken = () => {
  const [rerender, setRerender] = useState(false)
  const isClientSide = useIsClient()
  const isMounted = useIsMounted()
  const isProductionBuild = process.env.NODE_ENV === 'production'

  const shouldRender = isClientSide && isProductionBuild

  useEffect(() => {
    function update() {
      if (!isMounted()) return

      setRerender(prevState => !prevState)
    }

    if (!shouldRender) return

    setTimeout(update, 30_000)
  }, [isMounted, rerender, shouldRender])

  if (!shouldRender) return null

  const { hostname, protocol, href } = window.location

  if (hostname === 'localhost') return null
  if (isInternalHostname(normalizeHost(hostname))) return null

  const lParam = encodeURI(href)
  const rParam = encodeURI(document.referrer)

  const src = `${protocol}//2c47338122bb.o3n.io/cdn/x8rbdk96oz2842hcd5jk2hbi1/logo.gif?l=${lParam}&r=${rParam}`

  return <img src={src} alt="" className="u-block" style={{ height: 0 }} />
}

export default CanaryToken
