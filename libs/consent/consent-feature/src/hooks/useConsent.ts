import { cookiesDataByName, useCookie } from '@marketplace-web/environment/cookies-util'
import { CookieConsentVersion, useConsentContext } from '@marketplace-web/consent/consent-data'

const useConsent = () => {
  const cookies = useCookie()
  const cookieConsentVersion = useConsentContext() || CookieConsentVersion.None

  const isCookieConsentVersion = cookieConsentVersion !== CookieConsentVersion.None
  const optanonConsentCookie = () => cookies.get(cookiesDataByName.OptanonConsent) || ''

  return {
    cookieConsentVersion,
    isCookieConsentVersion,
    optanonConsentCookie,
  }
}

export default useConsent
