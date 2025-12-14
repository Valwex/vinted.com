import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'

const INTERNAL_LINK_REGEX = /^[/\\][^.:]*(\?.*)?$/
const HOSTNAME_REGEX = /^(?:https?:)?[/\\]{2,}([^/\\]+)/

const isValidRefLink = (link: unknown, host: string): link is string => {
  if (typeof link !== 'string') return false
  if (new RegExp(INTERNAL_LINK_REGEX).test(link)) return true

  const linkHost = link.match(HOSTNAME_REGEX)?.[1]

  if (!host || !linkHost) return false
  if (linkHost === host) return true

  return `old.${linkHost}` === host
}

const useRefUrl = (defaultUrl?: string) => {
  const { host, relativeUrl, urlQuery, searchParams } = useBrowserNavigation()
  const { ref_url: pathname } = searchParams

  if (isValidRefLink(pathname, host)) return pathname

  return defaultUrl ?? `${relativeUrl}${urlQuery}`
}

export default useRefUrl
