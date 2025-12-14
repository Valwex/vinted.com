'use client'

import { isEqual, throttle } from 'lodash'
import { ReactNode, useEffect, useState } from 'react'
import { useEventListener } from 'usehooks-ts'

import { useCookie } from '@marketplace-web/environment/cookies-util'

import { Breakpoints } from '../../types'
import {
  getClientSideBreakpoints,
  getInitialBreakpoints,
  setViewportCookie,
  SsrBreakpointsConfigs,
} from '../../utils/breakpoints'
import { Provider } from './BreakpointContext'

const RESIZE_DELAY = 50

type Props = {
  children: ReactNode
  ssrConfigs?: SsrBreakpointsConfigs
}

const BreakpointProvider = ({ children, ssrConfigs }: Props) => {
  const [breakpoints, setBreakpoints] = useState<Breakpoints>(() =>
    getInitialBreakpoints(ssrConfigs),
  )

  const cookies = useCookie()

  useEffect(() => {
    setViewportCookie(cookies)
  }, [breakpoints, cookies])

  useEventListener(
    'resize',
    throttle(() => {
      const newBreakpoints = getClientSideBreakpoints()

      setBreakpoints(prevBreakpoints =>
        isEqual(newBreakpoints, prevBreakpoints) ? prevBreakpoints : newBreakpoints,
      )
    }, RESIZE_DELAY),
  )

  return <Provider value={{ breakpoints }}>{children}</Provider>
}

export default BreakpointProvider
