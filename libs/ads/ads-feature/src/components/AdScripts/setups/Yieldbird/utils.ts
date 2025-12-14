import { Hostname } from '@marketplace-web/vinted-context/construct-headers-util'
import { isInternalHostname, normalizeHost } from '@marketplace-web/browser/url-util'

import { MapHostnameToYieldbirdKey } from '../../../../constants'

export function getYieldbirdDomainKey(hostname: string) {
  const normalizedHostname = normalizeHost(hostname)

  if (!isInternalHostname(normalizedHostname)) return MapHostnameToYieldbirdKey[Hostname.Pl]

  return MapHostnameToYieldbirdKey[normalizedHostname]
}

export function initYieldbird() {
  window.googletag = window.googletag || { cmd: [] }

  window.ybConfiguration = window.ybConfiguration || {}
  window.ybConfiguration = {
    ...window.ybConfiguration,
    integrationMethod: 'open_tag',
    smartRefreshDisabled: false,
  }

  window.Yieldbird = window.Yieldbird || { cmd: [] }
}
