'use client'

import { Button } from '@vinted/web-ui'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSession } from '@marketplace-web/shared/session-data'
import { toUrlQuery } from '@marketplace-web/browser/url-util'

import { clickEvent } from '@marketplace-web/header/header-data'

import { ITEM_UPLOAD_URL, SIGNUP_URL } from '../../constants/routes'

const HeaderUploadItem = () => {
  const { user } = useSession()
  const userId = user?.id

  const translate = useTranslate()
  const { track } = useTracking()

  function handleAnchorClick() {
    track(clickEvent({ target: 'upload_item' }))
  }

  return (
    <Button
      text={translate('header.actions.upload_item')}
      styling="filled"
      size="small"
      url={userId ? ITEM_UPLOAD_URL : `${SIGNUP_URL}?${toUrlQuery({ ref_url: ITEM_UPLOAD_URL })}`}
      rel="nofollow"
      onClick={handleAnchorClick}
    />
  )
}

export default HeaderUploadItem
