import { CookieHandler, cookiesDataByName } from '@marketplace-web/environment/cookies-util'
import { serverSide } from '@marketplace-web/environment/environment-util'

import {
  BREAKPOINT_VALUES_MAP,
  DEFAULT_SSR_BREAKPOINTS,
  DEFAULT_SSR_MOBILES_BREAKPOINTS,
  DEVICE_MAP,
  USER_AGENT_DEVICE,
} from '../constants'
import { BreakpointList, BreakpointMap, Breakpoints } from '../types'
import { getBrowserHeight, getBrowserWidth } from './dimensions'

type Device = keyof typeof USER_AGENT_DEVICE

export type SsrBreakpointsConfigs = {
  viewportSize: number | undefined
  device: Device | undefined
  isBot: boolean
  isWebview: boolean
}

const defaultBreakpointSizeOrder: Array<'wide' | 'desktops' | 'tablets' | 'phones'> = [
  'wide',
  'desktops',
  'tablets',
  'phones',
]

export const getBreakpointsFromDevice = (device: Device): Breakpoints => {
  const active = DEVICE_MAP[device]

  return {
    active,
    ...Object.fromEntries(active.map(devices => [devices, true])),
  }
}

export const getBreakpointsFromWidth = (width: number): Breakpoints => {
  const active: Array<keyof BreakpointMap> = []

  const breakpoints = Object.entries(BREAKPOINT_VALUES_MAP).reduce(
    (accumulator, [device, breakpoint]) => {
      const match = width >= breakpoint[0] && width <= breakpoint[1]

      if (match) active.push(device as keyof BreakpointMap)

      accumulator[device] = match

      return accumulator
    },
    {},
  )

  return {
    active,
    ...breakpoints,
  }
}

export const getServerSideBreakpoints = ({
  viewportSize,
  device,
  isWebview,
}: SsrBreakpointsConfigs) => {
  if (viewportSize) return getBreakpointsFromWidth(viewportSize)
  if (device) return getBreakpointsFromDevice(device)
  if (isWebview) return DEFAULT_SSR_MOBILES_BREAKPOINTS

  return DEFAULT_SSR_BREAKPOINTS
}

export const getFirstListedBreakpoint = <
  T extends BreakpointList = typeof defaultBreakpointSizeOrder,
>(
  activeBreakpoints: BreakpointList,
  targetOrder: T = defaultBreakpointSizeOrder as T,
): T[0] | null =>
  targetOrder.filter(breakpoint => activeBreakpoints.includes(breakpoint))[0] || null

export const setViewportCookie = (cookies: CookieHandler) => {
  if (serverSide) return

  cookies.set(cookiesDataByName.viewport_size, getBrowserWidth().toString())
}

export const getClientSideBreakpoints = () => getBreakpointsFromWidth(getBrowserWidth())

export const shouldUseSsrBreakpoints = (isBot: boolean) => {
  if (serverSide) return true
  if (isBot) return true

  return !getBrowserWidth() || !getBrowserHeight()
}

export const getInitialBreakpoints = (ssrConfigs?: SsrBreakpointsConfigs) => {
  if (ssrConfigs && shouldUseSsrBreakpoints(ssrConfigs.isBot)) {
    return getServerSideBreakpoints(ssrConfigs)
  }

  return getClientSideBreakpoints()
}
