'use client'

import * as client from 'openid-client'

import { Button } from '@vinted/web-ui'
import { MouseEvent } from 'react'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { toUrlQuery } from '@marketplace-web/browser/url-util'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import {
  useBrowserNavigation,
  navigateToPage,
} from '@marketplace-web/browser/browser-navigation-util'
import { useEnvs } from '@marketplace-web/environment/environment-util'

import { clickEvent } from '@marketplace-web/registration/registration-data'
import { useRefUrl } from '@marketplace-web/ref-url/ref-url-feature'
import { useAuthModal } from '@marketplace-web/auth-flow/auth-modal-context-feature'

import { OAUTH2_CLIENT_ID, OAUTH2_CALLBACK_URL } from '../../constants'
import { SIGNUP_URL } from '../../constants/routes'

const HeaderLoginButton = () => {
  const refUrl = useRefUrl()
  const translate = useTranslate()
  const { track } = useTracking()
  const { openAuthModal } = useAuthModal()
  const isOauth2Enabled = useFeatureSwitch('svc_iam_oauth_web')
  const svcIamOauthUrl = useEnvs('SVC_IAM_OAUTH_URL')
  const { relativeUrl, baseUrl } = useBrowserNavigation()

  const isAuthPageOpen =
    relativeUrl.startsWith('/member/login') ||
    relativeUrl.startsWith('/member/register') ||
    relativeUrl.startsWith('/member/signup')

  const getOauth2LoginUrl = async () => {
    const config: client.Configuration = await client.discovery(
      new URL(svcIamOauthUrl || ''),
      OAUTH2_CLIENT_ID,
    )
    const state = client.randomState()

    const params = {
      redirect_uri: `${baseUrl}${OAUTH2_CALLBACK_URL}`,
      scope: 'offline_access user offline',
      state,
    }

    return client.buildAuthorizationUrl(config, params).toString()
  }

  async function handleClick(event: MouseEvent) {
    track(clickEvent({ target: 'login' }))

    if (isOauth2Enabled) {
      event.preventDefault()

      const url = await getOauth2LoginUrl()

      navigateToPage(url)

      return
    }

    if (isAuthPageOpen) return

    event.preventDefault()
    openAuthModal()
  }

  return (
    <Button
      text={translate('header.actions.login')}
      size="small"
      url={`${SIGNUP_URL}?${toUrlQuery({ ref_url: refUrl })}`}
      onClick={handleClick}
      testId="header--login-button"
    />
  )
}

export default HeaderLoginButton
