import { Hostname } from '@marketplace-web/vinted-context/construct-headers-util'

import { filterEmptyValuesEdgeSafe, isValueInObject } from './object'

const PR_SANDBOX_HOSTNAME_REGEX =
  /^marketplace-web-pr-sandbox-\d{1,2}\.ingress\.sandbox\d\.k8s\.vinted\.com$/

export const toUrlQuery = (params: object): string => {
  const keys = Object.keys(params)

  return keys
    .map(key => {
      const value = params[key]

      if (Array.isArray(value)) {
        return value.map(item => `${key}[]=${encodeURIComponent(item)}`).join('&')
      }

      return `${key}=${encodeURIComponent(value)}`
    })
    .join('&')
}

export const toParams = (urlQuery: string): Record<string, string | Array<string> | undefined> => {
  const searchParams = new URLSearchParams(urlQuery)
  const params = {}

  searchParams.forEach((value, key) => {
    const potentialArrayKeyMarker = key.substring(key.length - 2, key.length)

    if (potentialArrayKeyMarker === '[]') {
      const arrayKey = key.substring(0, key.length - 2)

      if (!Array.isArray(params[arrayKey])) params[arrayKey] = []

      params[arrayKey].push(value)

      return
    }

    params[key] = value
  })

  return params
}

export const urlWithParams = (
  url: string,
  params: Record<
    string,
    string | number | boolean | null | undefined | Array<string | number | boolean>
  >,
): string => {
  const [, path = '/', urlParams = '', urlHash = ''] = url.match(/^([^?#]+)(\?[^#]*)?(#.*)?$/) || []

  const newParams = toUrlQuery({ ...toParams(urlParams), ...filterEmptyValuesEdgeSafe(params) })

  return `${path}${newParams ? `?${newParams}` : ''}${urlHash}`
}

const HTML_UNESCAPES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
}

const ESCAPED_HTML_REGEX = /&(?:amp|lt|gt|quot|#39);/g

// Taken from
// https://github.com/lodash/lodash/blob/ddfd9b11a0126db2302cb70ec9973b66baec0975/lodash.js#L15149-L15154
const unescape = (value: string) =>
  ESCAPED_HTML_REGEX.test(value)
    ? value.replace(ESCAPED_HTML_REGEX, key => HTML_UNESCAPES[key])
    : value

export const isPrSandboxHostname = (host: string) => PR_SANDBOX_HOSTNAME_REGEX.test(host)

export const normalizeHost = (host: string) => host.replace(/^www\./, '')

export const linkifyString = (text: string) => {
  const URL_OR_ANCHOR_TAG_REGEX = /(<a.*?>.*?<\/a>)|(https?:\/\/(www\.)?[a-zA-Z0-9-]+\.[^<\s]+)/gis

  const unescapedText = unescape(text)

  return unescapedText.replace(URL_OR_ANCHOR_TAG_REGEX, (match, anchor) => {
    if (anchor) return match

    return `<a href="${match}">${match}</a>`
  })
}
export const normalizedQueryParam = (param: string | Array<string> | undefined) => [param].join()

export const isCurrentUrl = (relativeUrl: string, pathname: string) => {
  return new RegExp(`^${pathname}(/|$)`).test(relativeUrl)
}

export const getLastPathnameParam = (relativeUrl: string, url?: string) => {
  const splitRelativeUrl = (url || relativeUrl).split('/')

  return splitRelativeUrl[splitRelativeUrl.length - 1]!
}

export const getPathnameParam = (relativeUrl: string, index: number) => {
  const splitRelativeUrl = relativeUrl.split('/')

  // splitRelativeUrl[0] is an empty string, hence returning index + 1
  // returning empty string for consistency sake when url has no params, e.g. vinted.com/
  return splitRelativeUrl[index + 1] || ''
}

export const removeParamsFromQuery = (
  relativeUrl: string,
  urlQuery: string,
  paramsToRemove: Array<string>,
) => {
  const urlParams = toParams(urlQuery)

  paramsToRemove.forEach(param => delete urlParams[param])

  if (!Object.keys(urlParams).length) return relativeUrl

  return `${relativeUrl}?${toUrlQuery(urlParams)}`
}

export const transformAbsoluteUrlToRelative = (url: string) =>
  url.replace(/^https?:\/\/[^/?#]+\/?/, '/')

export const isUrlRelative = (urlToTest: string) => {
  const origin = 'https://www.vinted.com'

  if (urlToTest.startsWith(origin)) return false

  return new URL(urlToTest, origin).origin === origin
}

export const isInternalHostname = (host: string): host is Hostname =>
  isValueInObject(host, Hostname)

const APP_LINK_PREFIX = 'vintedfr://'

export function isInternalUrl(url: string) {
  if (url.toLowerCase().startsWith(APP_LINK_PREFIX)) return true
  if (isUrlRelative(url)) return true

  try {
    const { hostname, protocol } = new URL(url.replace(/^\/\//, 'https://'))

    if (protocol !== 'http:' && protocol !== 'https:') return false

    return isInternalHostname(normalizeHost(hostname))
  } catch {
    return false
  }
}
