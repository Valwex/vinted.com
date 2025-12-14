'use client'

import { useRefUrl } from '@marketplace-web/ref-url/ref-url-feature'

import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useAuthModal } from '@marketplace-web/auth-flow/auth-modal-context-feature'

import { BUSINESS_ACCOUNT_REGISTER_URL } from '../../constants/routes'

const useSuccessUrl = (defaultUrl?: string) => {
  const { isBusinessAuth } = useAuthModal()
  const isNonNativeFlowEnabled = useFeatureSwitch('non_native_flow_pages')

  const refUrl = useRefUrl(defaultUrl)

  if (isBusinessAuth) return BUSINESS_ACCOUNT_REGISTER_URL

  if (isNonNativeFlowEnabled) {
    try {
      // this is a hack to avoid redirect loop when user is redirected back to the /oauth/authorize endpoint
      const redirectUrl = new URL(refUrl, window.location.origin)
      redirectUrl.searchParams.delete('vinted_in_app')

      return redirectUrl.toString()
    } catch {
      return refUrl
    }
  }

  return refUrl
}

export default useSuccessUrl
