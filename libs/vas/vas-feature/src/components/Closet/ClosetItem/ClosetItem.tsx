'use client'

import { MouseEvent } from 'react'
import { useInView } from 'react-intersection-observer'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { ProductItem } from '@marketplace-web/item-box/item-box-feature'

import {
  ClosetPromotionItemDto,
  transformClosetPromotionItemDtoToProductItem,
  impressionEvent,
  ClosetPromotionItemDtoSvcVas,
  transformClosetPromotionItemDtoSvcVasToProductItem,
} from '@marketplace-web/vas/vas-data'
import { useAbTest } from '@marketplace-web/feature-flags/ab-tests-data'

type Props = {
  item: ClosetPromotionItemDto | ClosetPromotionItemDtoSvcVas
  onClick: (event: MouseEvent) => void
  onItemFavouriteToggle?: React.ComponentProps<typeof ProductItem>['onFavouriteToggle']
  imageDisplayMode?: 'single' | 'collage'
  index: number
  homepageSessionId?: string
  isViewingSelf: boolean
  isPreview: boolean
  isBusinessUser: boolean
  userId: number
}

const ClosetItem = ({
  item,
  userId,
  onClick,
  onItemFavouriteToggle,
  imageDisplayMode = 'single',
  index,
  homepageSessionId,
  isViewingSelf,
  isPreview,
  isBusinessUser,
}: Props) => {
  const vasApiGatewaySwapPromotedClosetsAbTest = useAbTest('vas_api_gateway_swap_promoted_closets')
  const isVasApiGatewaySwapPromotedClosetsAbTestOn =
    vasApiGatewaySwapPromotedClosetsAbTest?.variant === 'on'
  const { track } = useTracking()
  const { ref } = useInView({
    triggerOnce: true,
    onChange: inView => {
      if (!inView) return
      track(
        impressionEvent({
          id: item.id,
          position: index + 1,
          contentType: 'item',
          contentSource: isPreview ? 'promoted_closets_preview' : 'promoted_closets',
          itemOwnerId: userId,
          homepageSessionId,
        }),
      )
    },
  })

  return (
    <div ref={ref} className="u-fill-height" data-testid={`closet-item-${item.id}`}>
      <ProductItem
        item={
          isVasApiGatewaySwapPromotedClosetsAbTestOn
            ? transformClosetPromotionItemDtoSvcVasToProductItem(
                item as ClosetPromotionItemDtoSvcVas,
                userId,
                isBusinessUser,
              )
            : transformClosetPromotionItemDtoToProductItem(item as ClosetPromotionItemDto)
        }
        onClick={onClick}
        onFavouriteToggle={onItemFavouriteToggle}
        testId={`item-${item.id}`}
        imageDisplayMode={imageDisplayMode}
        viewingSelf={isViewingSelf}
      />
    </div>
  )
}

export default ClosetItem
