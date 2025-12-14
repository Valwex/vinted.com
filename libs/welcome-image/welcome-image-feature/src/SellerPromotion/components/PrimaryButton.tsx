'use client'

import { Button } from '@vinted/web-ui'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { urlWithParams } from '@marketplace-web/browser/url-util'
import { clickEvent } from '@marketplace-web/welcome-image/welcome-image-data'

import { ITEM_UPLOAD_URL, SIGNUP_URL } from '../../constants/routes'

type Props = {
  text: string
  isLoggedIn: boolean
}

const PrimaryButton = ({ text, isLoggedIn }: Props) => {
  const { track } = useTracking()
  const primaryActionUrl = isLoggedIn
    ? ITEM_UPLOAD_URL
    : urlWithParams(SIGNUP_URL, {
        ref_url: ITEM_UPLOAD_URL,
      })

  function trackTitleClick() {
    const trackData = {
      target: 'upload_item',
      targetDetails: 'Landing page banner Sell now',
    } as const

    track(clickEvent(trackData))
  }

  return <Button text={text} url={primaryActionUrl} styling="filled" onClick={trackTitleClick} />
}

export default PrimaryButton
