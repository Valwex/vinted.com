'use client'

import { useCallback } from 'react'

import { useIntl } from 'react-intl'

import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { usePageId } from '@marketplace-web/environment/request-context-data'
import { useSession } from '@marketplace-web/shared/session-data'

import { googleTagManagerTrack as track } from '../../utils'

import { GoogleTagManagerEvent, LoginStatus } from '../../constants'
import { GoogleAnalyticsTrackProps } from './types'
import { filterEmptyStringAttributes, getFormName, getPageType } from './utils'

function useGoogleTagManagerTrack() {
  const { host, relativeUrl, searchParams } = useBrowserNavigation()
  const { locale: language } = useIntl()
  const { user, anonId } = useSession()

  const pageId = usePageId()

  const isGoogleAnalyticsTrackEnabled = useFeatureSwitch('web_ga4_analytics')
  const isGtmEcFieldEnabled = useFeatureSwitch('web_gtm_ec_field')

  const siteSearchString =
    typeof searchParams.search_text === 'string' ? searchParams.search_text : ''
  const userId = String(user?.id || '')
  const loginStatus = userId ? LoginStatus.Logged : LoginStatus.NotLogged

  const pageType = getPageType(relativeUrl, siteSearchString, pageId)

  const formName = getFormName(pageType)

  const googleTagManagerTrack = useCallback(
    (event: GoogleTagManagerEvent, trackingData: NonNullable<typeof window.dataLayer>[number]) =>
      track(event, trackingData, isGtmEcFieldEnabled),
    [isGtmEcFieldEnabled],
  )

  const googleAnalyticsTrack = useCallback(
    ({ event = GoogleTagManagerEvent.pageLoad, customTagObject }: GoogleAnalyticsTrackProps) => {
      const eventObject = filterEmptyStringAttributes({
        anonymousId: anonId,
        language,
        siteSearchString,
        loginStatus,
        userId,
        pageType,
        formName,
        ...customTagObject,
        domain: host,
      })

      if (isGoogleAnalyticsTrackEnabled) {
        track(event, eventObject)
      }
    },
    [
      anonId,
      formName,
      host,
      isGoogleAnalyticsTrackEnabled,
      language,
      loginStatus,
      pageType,
      siteSearchString,
      userId,
    ],
  )

  return { googleTagManagerTrack, googleAnalyticsTrack }
}

export default useGoogleTagManagerTrack
