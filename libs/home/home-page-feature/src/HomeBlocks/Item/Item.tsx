'use client'

import { useRef } from 'react'

import { TrackedProductItem } from '@marketplace-web/item-box/item-box-feature'
import {
  clickEvent,
  favouriteItemEvent,
  impressionEvent,
  HomepageItemModel,
} from '@marketplace-web/home/home-page-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { GenericPromoBoxModel } from '@marketplace-web/braze/braze-data'

import { logHomeMessage } from '../../utils/client-observability'
import useVisible from '../../hooks/useVisible'
import ItemArrangement from '../../common/ItemArrangement'

type Props = {
  item: HomepageItemModel
  position: number
  homepageSessionId: string
  brazePromoBoxes: Array<GenericPromoBoxModel>
}

const Item = (props: Props) => {
  const isSeen = useRef(false)
  const { track } = useTracking()

  const { item, position, homepageSessionId } = props

  const onVisible = () => {
    if (isSeen.current) return

    if (!item.id) {
      logHomeMessage(
        `Missing item id (${item.id}) from ${item.contentSource}`,
        `Item URL: ${item.url}, user id: ${item.user.id}`,
      )
    }

    track(
      impressionEvent({
        id: item.id,
        position,
        contentType: 'item',
        contentSource: item.contentSource,
        itemOwnerId: item.user.id,
        homepageSessionId,
        metadata: item.metadata,
      }),
    )

    isSeen.current = true
  }

  const ref = useVisible(onVisible)

  const handleFavouriteToggle = ({
    itemId,
    isFollowEvent,
    itemContentSource,
  }: {
    itemId: number
    isFollowEvent: boolean
    itemContentSource?: Parameters<typeof favouriteItemEvent>[0]['contentSource']
  }) => {
    track(clickEvent({ target: 'favorite' }))
    track(
      favouriteItemEvent({
        itemId,
        isFollowEvent,
        homepageSessionId,
        contentSource: itemContentSource,
      }),
    )
  }

  return (
    <ItemArrangement ref={ref} {...props}>
      <TrackedProductItem
        tracking={{
          id: item.id,
          contentType: 'item',
          contentSource: item.contentSource,
          position,
          homepageSessionId,
          metadata: item.metadata,
        }}
        testId="feed-item"
        item={item}
        showStatus
        showStatusAsBadge
        onFavouriteToggle={handleFavouriteToggle}
      />
    </ItemArrangement>
  )
}

export default Item
