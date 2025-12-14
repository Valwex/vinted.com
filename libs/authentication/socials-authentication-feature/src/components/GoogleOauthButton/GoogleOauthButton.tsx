'use client'

import { Button } from '@vinted/web-ui'
import { decodeJwt } from 'jose'
import { useEffect, useState } from 'react'

import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import { useEnvs } from '@marketplace-web/environment/environment-util'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import {
  normalizedQueryParam,
  removeParamsFromQuery,
  urlWithParams,
} from '@marketplace-web/browser/url-util'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { getGoogleIdToken } from '@marketplace-web/authentication/socials-authentication-data'
import { useSafeDataDomeCallback } from '@marketplace-web/bot-detection/data-dome-feature'

import { GOOGLE_OAUTH_URL, LOGIN_SELECT_TYPE, REGISTER_SELECT_TYPE } from '../../constants/routes'
import { OnGoogleLoginSuccess } from '../../types/google'
import { getGoogleRedirectUrl } from '../../utils/google'

const GoogleIcon = () => (
  <div className="u-flexbox u-padding-small">
    <svg fill="none" viewBox="0 0 24 24" width="20" height="20">
      <path
        fill="#4285F4"
        d="M23.754 12.23c0-.852-.06-1.625-.204-2.417H12.24v4.646h6.46c-.277 1.5-1.13 2.774-2.402 3.626v3.014h3.878c2.27-2.09 3.578-5.163 3.578-8.825v-.043Z"
      />
      <path
        fill="#34A853"
        d="M12.24 24.004c3.242 0 5.955-1.08 7.948-2.905l-3.878-3.014c-1.08.72-2.449 1.14-4.07 1.14-3.121 0-5.775-2.113-6.723-4.946h-4.01v3.11c1.98 3.926 6.039 6.615 10.733 6.615Z"
      />
      <path
        fill="#FBBC04"
        d="M5.517 14.279a7.21 7.21 0 0 1-.372-2.281c0-.792.132-1.56.372-2.281v-3.11h-4.01a11.964 11.964 0 0 0-1.273 5.39c0 1.934.468 3.77 1.273 5.392l4.01-3.11Z"
      />
      <path
        fill="#E94235"
        d="M12.24 4.77c1.765 0 3.35.6 4.586 1.801l3.446-3.445C18.195 1.193 15.47.004 12.24.004 7.546-.008 3.488 2.68 1.507 6.607l4.01 3.11c.948-2.834 3.59-4.947 6.723-4.947Z"
      />
    </svg>
  </div>
)

type Props = {
  onSuccess: (props: OnGoogleLoginSuccess) => void
  onFailure: () => void
  redirectUri: string
  onClick: () => void
}

const getAction = (relativeUrl: string) => {
  switch (relativeUrl) {
    case LOGIN_SELECT_TYPE:
      return 'login'
    case REGISTER_SELECT_TYPE:
      return 'registration'
    default:
      return undefined
  }
}

const GoogleOauthButton = ({ onSuccess, onFailure, redirectUri, onClick }: Props) => {
  const { searchParams, replaceHistoryState, relativeUrl, urlQuery, baseUrl } =
    useBrowserNavigation()
  const translate = useTranslate('auth.select_type')
  const isDevelopment = useEnvs('NODE_ENV') === 'development' || undefined

  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const isNonNativeFlowEnabled = useFeatureSwitch('non_native_flow_pages')
  const isDataDomeInitializationDelayEnabled = useFeatureSwitch(
    'datadome_initialization_delay_on_google',
  )

  const oauthUrl = urlWithParams(GOOGLE_OAUTH_URL, {
    redirect_uri: redirectUri,
    next_local_redirect: isDevelopment,
    take_action: getAction(relativeUrl),
    return_url: isNonNativeFlowEnabled ? urlWithParams(relativeUrl, searchParams) : null,
  })
  const code = normalizedQueryParam(searchParams.code)
  const state = normalizedQueryParam(searchParams.state)
  const redirectUrl = getGoogleRedirectUrl(state, {
    clearVintedInAppParam: isNonNativeFlowEnabled,
    baseUrl,
  })

  const { callbackWhenDataDomeReady } = useSafeDataDomeCallback()

  useEffect(() => {
    if (!code || !state || isLoggingIn) return

    const fetchGoogleToken = async () => {
      const response = await getGoogleIdToken({
        code,
        state,
        isLocalRedirectEnabled: isDevelopment,
        action: getAction(relativeUrl),
      })

      if ('errors' in response) {
        replaceHistoryState(removeParamsFromQuery(relativeUrl, urlQuery, ['code', 'state']))
        setIsLoggingIn(false)

        onFailure()

        return
      }

      const { id_token: token } = response

      const { email, name } = decodeJwt<{ name: string; email: string }>(token)

      onSuccess({ token, fields: { name, email }, redirectUrl })
    }

    setIsLoggingIn(true)
    if (isDataDomeInitializationDelayEnabled) {
      callbackWhenDataDomeReady(fetchGoogleToken)
    } else {
      fetchGoogleToken()
    }
  }, [
    code,
    isLoggingIn,
    redirectUrl,
    state,
    isDataDomeInitializationDelayEnabled,
    onSuccess,
    onFailure,
    isDevelopment,
    replaceHistoryState,
    relativeUrl,
    urlQuery,
    callbackWhenDataDomeReady,
  ])

  const handleClick = () => {
    setIsLoggingIn(true)

    onClick()
  }

  return (
    <Button
      theme="amplified"
      onClick={handleClick}
      url={oauthUrl}
      isLoading={isLoggingIn}
      // TODO: Replace with GoogleLogo24 from @vinted/multichrome-icons when it's updated
      icon={<GoogleIcon />}
      testId="google-oauth-button"
    >
      {translate('actions.google')}
    </Button>
  )
}

export default GoogleOauthButton
