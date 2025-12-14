import type { Breakpoints } from '../types'

export const USER_AGENT_DEVICE = {
  mobile: 'mobile',
  tablet: 'tablet',
  desktop: 'desktop',
} as const

export const DEVICE_MAP = {
  [USER_AGENT_DEVICE.mobile]: ['phones', 'portables'],
  [USER_AGENT_DEVICE.tablet]: ['tablets', 'tabletsUp'],
  [USER_AGENT_DEVICE.desktop]: ['tabletsUp', 'desktops', 'wide'],
} as const

export const BREAKPOINT_VALUES_MAP = {
  phones: [0, 720],
  portables: [0, 959],
  tablets: [721, 959],
  tabletsUp: [721, Infinity],
  desktops: [960, Infinity],
  wide: [1200, Infinity],
} as const

export const DEFAULT_SSR_BREAKPOINTS: Breakpoints = {
  active: ['tabletsUp', 'desktops'],
  phones: false,
  portables: false,
  tablets: false,
  tabletsUp: true,
  desktops: true,
  wide: false,
}

export const DEFAULT_SSR_MOBILES_BREAKPOINTS: Breakpoints = {
  active: ['phones', 'portables'],
  phones: true,
  portables: true,
  tablets: false,
  tabletsUp: false,
  desktops: false,
  wide: false,
}
