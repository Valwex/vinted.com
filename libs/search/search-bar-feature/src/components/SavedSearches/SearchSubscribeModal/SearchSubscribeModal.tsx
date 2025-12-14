'use client'

import { Dialog } from '@vinted/web-ui'
import { useEffect } from 'react'

import { viewScreenEvent } from '@marketplace-web/search/search-bar-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'

type Props = {
  isOpen: boolean
  onClose: (() => void) | null | undefined
}

let didTrackGlobal = false

const SearchSubscribeModal = ({ isOpen, onClose }: Props) => {
  const translate = useTranslate('saved_searches.first_time_subscribe_modal')
  const { track } = useTracking()

  useEffect(() => {
    if (didTrackGlobal || !isOpen) return
    didTrackGlobal = true

    track(
      viewScreenEvent({
        screen: 'search_saved_first_time_alert',
      }),
    )
  }, [isOpen, track])

  return (
    <Dialog
      show={isOpen}
      testId="search-subscribe-modal"
      title={translate('title')}
      body={translate('text')}
      actions={[
        {
          text: translate('action'),
          style: Dialog.ActionStyling.Filled,
          callback: onClose,
          testId: 'search-subscribe-modal-close-button',
        },
      ]}
    />
  )
}

export default SearchSubscribeModal
