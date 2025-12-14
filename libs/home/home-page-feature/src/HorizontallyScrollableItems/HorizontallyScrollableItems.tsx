'use client'

import { ReactNode, useRef } from 'react'
import { InView } from 'react-intersection-observer'

import { GenericPromoBoxModel } from '@marketplace-web/braze/braze-data'
import {
  ControlPromoBoxTracker,
  PromoBox,
  useBrazePromoBoxTracking,
} from '@marketplace-web/braze/braze-feature'
import { HorizontalScrollArea } from '@marketplace-web/common-components/horizontal-scroll-area-ui'
import {
  HomepageItemModel,
  clickEvent,
  favouriteItemEvent,
  impressionEvent,
} from '@marketplace-web/home/home-page-data'
import { TrackedProductItem } from '@marketplace-web/item-box/item-box-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { ErrorBoundary } from '@marketplace-web/error-display/error-display-util'
import { ComponentError } from '@marketplace-web/error-display/error-display-feature'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

import { logHomeMessage } from '../utils/client-observability'

import CtaItem from './CtaItem'

type Props = {
  items: Array<HomepageItemModel>
  promoBox: GenericPromoBoxModel | null
  homepageSessionId: string
  header?: ReactNode
  cta?: ReactNode
  itemTestId?: string
  handleErrorLogging?: (err: Error | null) => void
  preventLog?: boolean
  testId?: string
  itemsFullWidthAlignment?: boolean
}

const HorizontallyScrollableItems = ({
  items,
  cta,
  promoBox,
  homepageSessionId,
  header,
  itemTestId,
  handleErrorLogging,
  preventLog,
  testId,
  itemsFullWidthAlignment = false,
}: Props) => {
  const { track } = useTracking()
  const translateA11y = useTranslate('a11y')
  const { handlePromoBoxClick, handlePromoBoxVisibility } = useBrazePromoBoxTracking(promoBox)

  const seenItemIds = useRef<Array<number>>([])

  const showPromoBox = promoBox && !promoBox.isControl

  if (!items.length) return null

  function handleFavouriteToggle({
    itemId,
    isFollowEvent,
    itemContentSource,
  }: {
    itemId: number
    isFollowEvent: boolean
    itemContentSource?: Parameters<typeof favouriteItemEvent>[0]['contentSource']
  }) {
    track(clickEvent({ target: 'favorite' }))
    track(
      favouriteItemEvent({
        itemId,
        isFollowEvent,
        contentSource: itemContentSource,
        homepageSessionId,
      }),
    )
  }

  const handleItemVisibility = (item: HomepageItemModel, position: number) => (inView: boolean) => {
    const { id, user } = item

    if (!inView) return

    if (seenItemIds.current.includes(id)) return

    seenItemIds.current.push(id)

    if (!item.id) {
      logHomeMessage(
        `Missing item id (${item.id}) from ${item.contentSource}`,
        `Item URL: ${item.url}, user id: ${item.user.id}`,
      )
    }

    track(
      impressionEvent({
        id,
        position,
        contentType: 'item',
        contentSource: item.contentSource,
        itemOwnerId: user.id,
        homepageSessionId,
        metadata: item.metadata,
      }),
    )
  }

  function renderPromoBox() {
    if (!showPromoBox) return null

    return (
      <div className="horizontally-scrollable-items__item-content">
        <PromoBox
          image={promoBox.imageUrl}
          color={promoBox.backgroundColor}
          url={promoBox.url}
          alt={promoBox.imageAlt}
          impressionUrl={promoBox.impressionUrl}
          onEnter={handlePromoBoxVisibility}
          onClick={handlePromoBoxClick}
          testId={`${String(itemTestId)}-braze`}
        />
      </div>
    )
  }

  function renderItem(item: HomepageItemModel, index: number) {
    const promoBoxOffset = showPromoBox ? 1 : 0
    const position = index + 1 + promoBoxOffset

    return (
      <HorizontalScrollArea.Item
        className="horizontally-scrollable-items__item"
        key={item.id}
        testId={testId}
      >
        <InView
          data-testid={`horizontally-scrollable-item-${item.id}`}
          className="horizontally-scrollable-items__item-content"
          onChange={handleItemVisibility(item, position)}
        >
          <ControlPromoBoxTracker
            promoBox={promoBox}
            index={index}
            className="u-flex-grow u-fill-width"
          >
            <ErrorBoundary
              FallbackComponent={ComponentError}
              preventLog={preventLog}
              onError={handleErrorLogging}
            >
              <TrackedProductItem
                item={item}
                tracking={{
                  id: item.id,
                  contentType: 'item',
                  contentSource: item.contentSource,
                  position,
                  homepageSessionId,
                  metadata: item.metadata,
                }}
                onFavouriteToggle={handleFavouriteToggle}
                showStatus
                testId={itemTestId && `${itemTestId}-${item.id}`}
              />
            </ErrorBoundary>
          </ControlPromoBoxTracker>
        </InView>
      </HorizontalScrollArea.Item>
    )
  }

  return (
    <>
      {header}

      <HorizontalScrollArea
        controlsScrollType={HorizontalScrollArea.ControlScrollType.Partial}
        itemsFullWidthAlignment={itemsFullWidthAlignment}
        arrowLeftText={translateA11y('actions.move_left')}
        arrowRightText={translateA11y('actions.move_right')}
      >
        {showPromoBox && (
          <HorizontalScrollArea.Item className="horizontally-scrollable-items__item">
            {renderPromoBox()}
          </HorizontalScrollArea.Item>
        )}

        {items.map(renderItem)}

        {cta}
      </HorizontalScrollArea>
    </>
  )
}

HorizontallyScrollableItems.CtaItem = CtaItem

export default HorizontallyScrollableItems
