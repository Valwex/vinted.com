'use client'

import { Google24 } from '@vinted/multichrome-icons'
import { Button } from '@vinted/web-ui'
import { useCallback, useEffect, useState } from 'react'

import { useGoogleAuth2 } from '@marketplace-web/authentication/socials-authentication-feature'
import {
  useBrowserNavigation,
  navigateToPage,
} from '@marketplace-web/browser/browser-navigation-util'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { normalizedQueryParam, urlWithParams } from '@marketplace-web/browser/url-util'
import {
  getGoogleIdToken,
  linkGoogle,
} from '@marketplace-web/authentication/socials-authentication-data'

import { GOOGLE_OAUTH_URL } from '../../../constants/routes'

type Props = {
  onSuccess: () => void
  onError: (error: string) => void
}

const GoogleVerification = ({ onSuccess, onError }: Props) => {
  const { searchParams } = useBrowserNavigation()
  const translate = useTranslate('verification_prompt.google_verification')
  const [isLoading, setIsLoading] = useState(false)
  const code = normalizedQueryParam(searchParams.code)
  const googleAuth2 = useGoogleAuth2()
  const isGoogleStateValidationEnabled = useFeatureSwitch('google_oauth_state_validation')
  const state = isGoogleStateValidationEnabled ? normalizedQueryParam(searchParams.state) : 'link'
  const isGoogleOauthButtonEnabled = useFeatureSwitch('oauth_google_login')
  const oauthUrl = urlWithParams(GOOGLE_OAUTH_URL, {
    state: isGoogleStateValidationEnabled ? undefined : 'verification',
    take_action: isGoogleStateValidationEnabled ? 'verification' : undefined,
  })

  const handleGoogleResponse = useCallback(
    async (idToken: string) => {
      const response = await linkGoogle(idToken)

      setIsLoading(false)

      if ('errors' in response) {
        onError(response.errors[0]!.value)

        return
      }

      onSuccess()
    },
    [onError, onSuccess],
  )

  useEffect(() => {
    if (!code) return

    const fetchGoogleToken = async () => {
      const response = await getGoogleIdToken({ code, state, action: 'verification' })

      if ('errors' in response) {
        onError(response.errors[0]!.value)

        return
      }

      handleGoogleResponse(response.id_token)
    }

    setIsLoading(true)
    fetchGoogleToken()
  }, [code, state, handleGoogleResponse, onError])

  const signInGoogle = async () => {
    if (!googleAuth2) return

    setIsLoading(true)

    try {
      const response = await googleAuth2.signIn()

      handleGoogleResponse(response.getAuthResponse().id_token)
    } catch {
      setIsLoading(false)
      onError(translate('error'))
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (isLoading) {
      event.preventDefault()

      return
    }

    if (isGoogleOauthButtonEnabled) {
      setIsLoading(true)
      navigateToPage(oauthUrl)

      return
    }

    signInGoogle()
  }

  return (
    <Button
      theme="amplified"
      iconName={Google24}
      onClick={handleClick}
      isLoading={isLoading}
      disabled={!googleAuth2 && !isGoogleOauthButtonEnabled}
    >
      {translate('button')}
    </Button>
  )
}

export default GoogleVerification
