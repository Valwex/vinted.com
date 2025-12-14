'use client'

import { useState, useEffect } from 'react'
import { v4 as uuid, validate as uuidvalidate } from 'uuid'

import { useCookie, cookiesDataByName } from '@marketplace-web/environment/cookies-util'

const useHelpCenterSessionTracking = () => {
  const cookies = useCookie()

  const [helpCenterSessionId, setHelpCenterSessionId] = useState(
    cookies.get(cookiesDataByName.help_center_session_id) || null,
  )

  useEffect(() => {
    if (helpCenterSessionId && uuidvalidate(helpCenterSessionId)) return

    const newSessionId = uuid()

    cookies.set(cookiesDataByName.help_center_session_id, newSessionId)
    setHelpCenterSessionId(newSessionId)
  }, [cookies, helpCenterSessionId])

  return { helpCenterSessionId }
}

export default useHelpCenterSessionTracking
