'use client'

import { useEffect, useState } from 'react'

import { serverSide, useEnvs } from '@marketplace-web/environment/environment-util'

import { loadScript } from '../../utils/script'

const FACEBOOK_SDK_LINK = 'https://connect.facebook.net/en_US/sdk.js'
// Should always be updated at least to the latest still supported version
// https://developers.facebook.com/docs/graph-api/changelog/
const FACEBOOK_GRAPH_API_VERSION = 'v20.0'

const useInitFacebook = () => {
  const appId = useEnvs('FACEBOOK_CLIENT_ID')
  const [isInitialized, setIsInitialized] = useState(!serverSide && 'FB' in window)

  useEffect(() => {
    if (!appId) return
    if (isInitialized) return

    async function initialize() {
      await loadScript({
        id: 'facebook-sdk',
        isAsync: true,
        isDefer: true,
        crossOrigin: 'anonymous',
        src: FACEBOOK_SDK_LINK,
      })

      window.fbAsyncInit = () => {
        FB.init({
          appId,
          cookie: true,
          xfbml: true,
          version: FACEBOOK_GRAPH_API_VERSION,
        })

        setIsInitialized(true)
      }
    }

    initialize()
  }, [appId, isInitialized])

  return {
    isInitialized,
    isEnabled: !!appId,
  }
}

export default useInitFacebook
