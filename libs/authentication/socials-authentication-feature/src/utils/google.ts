import { isInternalUrl } from '@marketplace-web/browser/url-util'

import { ROOT_URL } from '../constants/routes'
import { loadScript } from './script'

export const GOOGLE_SDK_LINK = 'https://apis.google.com/js/api:client.js'
export const GOOGLE_SDK_SCRIPT_ID = 'google-sdk'

const decodeBase64Object = <T>(base64String: string): T | undefined => {
  try {
    const decodedString = atob(base64String)

    return JSON.parse(decodedString)
  } catch {
    return undefined
  }
}

export const getGoogleRedirectUrl = (
  state: string,
  { clearVintedInAppParam, baseUrl }: { clearVintedInAppParam: boolean; baseUrl: string } = {
    clearVintedInAppParam: false,
    baseUrl: '',
  },
) => {
  const decodedState = decodeBase64Object<{ redirect_uri: string; random_string: string }>(state)
  const decodedUrl = decodedState?.redirect_uri || state
  const safeDecodedUrl = isInternalUrl(decodedUrl) ? decodedUrl : null

  if (safeDecodedUrl && clearVintedInAppParam) {
    const url = new URL(safeDecodedUrl, baseUrl)
    url.searchParams.delete('vinted_in_app')

    return url.toString()
  }

  return safeDecodedUrl || ROOT_URL
}

export const loadGoogleSdk = () => {
  return loadScript({
    id: GOOGLE_SDK_SCRIPT_ID,
    isAsync: true,
    src: GOOGLE_SDK_LINK,
  })
}
