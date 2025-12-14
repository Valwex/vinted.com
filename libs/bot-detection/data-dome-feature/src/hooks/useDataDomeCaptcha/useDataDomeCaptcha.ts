'use client'

import { useEffect } from 'react'

import { DD_RESPONSE_UNLOAD_EVENT } from '@marketplace-web/bot-detection/data-dome-util'

const useDataDomeCaptcha = (callback: () => void) => {
  useEffect(() => {
    window.addEventListener(DD_RESPONSE_UNLOAD_EVENT, callback)

    return () => {
      window.removeEventListener(DD_RESPONSE_UNLOAD_EVENT, callback)
    }
  }, [callback])
}

export default useDataDomeCaptcha
