'use client'

import { useEffect } from 'react'
import { Card, Spacer } from '@vinted/web-ui'

import { ComponentLocation } from '@marketplace-web/auth-flow/auth-observability-feature'
import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import { removeParamsFromQuery } from '@marketplace-web/browser/url-util'
import { useAbTest, useTrackAbTestCallback } from '@marketplace-web/feature-flags/ab-tests-data'
import { logMessage } from '@marketplace-web/observability/logging-util'
import { useSession } from '@marketplace-web/shared/session-data'

import Auth from '../../components/Auth'

const SelectLoginType = () => {
  const { searchParams, relativeUrl, urlQuery, replaceHistoryState } = useBrowserNavigation()
  const { anonId } = useSession()

  const shouldTrackExposure = searchParams.track === '1'

  const authModalRemovalAbTest = useAbTest('web_auth_modal_removal')
  const trackAbTest = useTrackAbTestCallback()

  useEffect(() => {
    if (!shouldTrackExposure) return

    trackAbTest(authModalRemovalAbTest)
    logMessage('Secondary exposure event: web_auth_modal_removal', {
      extra: JSON.stringify({
        abTest: authModalRemovalAbTest,
        anonId,
      }),
    })

    replaceHistoryState(removeParamsFromQuery(relativeUrl, urlQuery, ['track']))
  }, [
    shouldTrackExposure,
    authModalRemovalAbTest,
    anonId,
    trackAbTest,
    replaceHistoryState,
    relativeUrl,
    urlQuery,
  ])

  return (
    <>
      <Spacer size="x2-large" />
      <div className="auth__container">
        <Card>
          <Spacer size="x2-large" />
          <Auth componentLocation={ComponentLocation.AuthenticationPage} />
        </Card>
      </div>
    </>
  )
}

export default SelectLoginType
