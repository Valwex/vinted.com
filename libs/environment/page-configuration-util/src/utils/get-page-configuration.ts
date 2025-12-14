import { PAGES } from '../constants/page-configuration'
import { PageConfiguration } from '../types/page-configuration'

const DEFAULT_CONFIGURATION = {
  screen: 'unknown',
  pageId: 'unknown',
  requireVpn: false,
  redirectAuthorised: false,
  requireAuthorization: false,
} satisfies PageConfiguration

function normalisePathname(pathname: string, buildId?: string): string {
  const nextDataPathname =
    buildId && new RegExp(`^/_next/data/${buildId}(/.+?).json$`).exec(pathname)?.[1]

  return nextDataPathname ?? pathname
}

export function getPageConfiguration(pathname: string, buildId?: string): PageConfiguration {
  const normalisedPathname = normalisePathname(pathname, buildId)

  return { ...DEFAULT_CONFIGURATION, ...PAGES.find(({ regex }) => regex.test(normalisedPathname)) }
}
