'use client'

import { MouseEvent } from 'react'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import {
  GoogleTagManagerEvent,
  googleTagManagerTrack,
} from '@marketplace-web/google-track/google-track-feature'
import { clickListItemEvent, ClickListItemEventArgs } from '@marketplace-web/item-box/item-box-data'

import ProductItem from './ProductItem'

type Props = {
  tracking: ClickListItemEventArgs
} & React.ComponentProps<typeof ProductItem>

const TrackedProductItem = ({ onClick, tracking, ...props }: Props) => {
  const { track } = useTracking()

  const handleClick = (event: MouseEvent) => {
    track(clickListItemEvent(tracking))

    if (tracking.contentType === 'item')
      googleTagManagerTrack(GoogleTagManagerEvent.SelectItem, {
        item_id: tracking.id,
      })

    onClick?.(event)
  }

  return <ProductItem {...props} onClick={handleClick} />
}

export default TrackedProductItem
