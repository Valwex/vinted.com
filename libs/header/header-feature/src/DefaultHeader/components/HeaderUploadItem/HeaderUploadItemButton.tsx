'use client'

import { Button } from '@vinted/web-ui'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'

import { clickEvent } from '@marketplace-web/header/header-data'

const HeaderUploadItemButton = (props: React.ComponentProps<typeof Button>) => {
  const { track } = useTracking()

  function handleClick() {
    track(clickEvent({ target: 'upload_item' }))
  }

  return <Button {...props} styling="filled" size="small" rel="nofollow" onClick={handleClick} />
}

export default HeaderUploadItemButton
