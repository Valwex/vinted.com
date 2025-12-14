'use client'

import { Cell } from '@vinted/web-ui'
import classnames from 'classnames'

import { HorizontalScrollArea } from '@marketplace-web/common-components/horizontal-scroll-area-ui'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSession } from '@marketplace-web/shared/session-data'
import {
  clickEvent,
  clickListItemEvent,
  favouriteItemEvent,
  clickClosetPromotionEvent,
  ClosetPromotionItemDto,
  ClosetUserModel,
  ContentSource,
  ClosetPromotionItemDtoSvcVas,
} from '@marketplace-web/vas/vas-data'

import ClosetUserInfo from './ClosetUserInfo'
import ClosetItem from './ClosetItem'
import ClosetCTA from './ClosetCTA'
import { getPromotedClosetContentSource } from '../../utils/contentSource'
import { ClosetPromotionEngagementEventTarget } from '../../constants/closet-promotion'

type Props = {
  user: ClosetUserModel
  items: Array<ClosetPromotionItemDto | ClosetPromotionItemDtoSvcVas>
  wide?: boolean
  position: number
  contentSource?: ContentSource
  homepageSessionId?: string
  isPreview: boolean
  onClick?: () => void
}

const MIN_PHOTO_COLLAGE_COUNT = 3

const Closet = ({
  user,
  items,
  wide = false,
  position,
  contentSource,
  homepageSessionId,
  isPreview,
  onClick,
}: Props) => {
  const { track } = useTracking()
  const translateA11y = useTranslate('a11y')
  const { user: currentUser } = useSession()

  const isViewingSelf = currentUser?.id === user.id

  const isCollageEnabled = !!items[0]?.photos && items[0].photos.length >= MIN_PHOTO_COLLAGE_COUNT

  function trackEngagementEvent(target: string, shouldTrackEngagement = true) {
    if (shouldTrackEngagement) {
      track(
        clickClosetPromotionEvent({
          ownerId: user.id,
          contentSource: getPromotedClosetContentSource(contentSource),
          target,
        }),
      )
    }
  }

  const handleItemClick = (itemId: number, index: number) => {
    track(
      clickListItemEvent({
        id: itemId,
        position: index + 1,
        contentType: 'item',
        contentSource: isPreview ? 'promoted_closets_preview' : 'promoted_closets',
        homepageSessionId,
      }),
    )
    trackEngagementEvent(ClosetPromotionEngagementEventTarget.Item)

    if (onClick) onClick()
  }

  function handleCtaClick() {
    const event = clickEvent({
      target: 'see_whole_closet_cta',
      targetDetails: `${user.id}`,
    })

    track(event)
    trackEngagementEvent(ClosetPromotionEngagementEventTarget.AllItems)
  }

  function handleUserInfoClick() {
    trackEngagementEvent(ClosetPromotionEngagementEventTarget.UserProfile)
  }

  function handleViewProfileClick() {
    trackEngagementEvent(ClosetPromotionEngagementEventTarget.ViewProfile)
  }

  function handleItemFavouriteToggle({
    itemId,
    isFollowEvent,
  }: {
    itemId: number
    isFollowEvent: boolean
  }) {
    track(
      favouriteItemEvent({
        itemId,
        isFollowEvent,
        homepageSessionId,
        contentSource: getPromotedClosetContentSource(contentSource),
        itemOwnerId: user.id,
      }),
    )
    track(clickEvent({ target: 'favorite' }))

    trackEngagementEvent(ClosetPromotionEngagementEventTarget.ItemFavourite, isFollowEvent)
  }

  const closetClass = classnames('closet', 'closet--with-horizontal-scroll', {
    'closet--wide': wide,
  })
  const closetItemClass = classnames('closet__item', { 'closet__item--collage': isCollageEnabled })

  return (
    <div className="closet-container">
      <Cell styling="tight">
        <div className="closet-container__item-horizontal-scroll">
          <div className={closetClass}>
            <ClosetUserInfo
              user={user}
              position={position}
              onClick={handleUserInfoClick}
              onViewProfileClick={handleViewProfileClick}
              isBusinessUser={user.isBusinessUser}
              isPreview={isPreview}
            />

            <HorizontalScrollArea
              controlsScrollType={HorizontalScrollArea.ControlScrollType.Partial}
              arrowLeftText={translateA11y('actions.move_left')}
              arrowRightText={translateA11y('actions.move_right')}
            >
              {items.map((item, index) => (
                <HorizontalScrollArea.Item
                  className={closetItemClass}
                  key={`closet-item-${item.id}`}
                >
                  <ClosetItem
                    item={item}
                    userId={user.id}
                    onClick={() => handleItemClick(item.id, index)}
                    onItemFavouriteToggle={handleItemFavouriteToggle}
                    imageDisplayMode={isCollageEnabled && index === 0 ? 'collage' : 'single'}
                    index={index}
                    homepageSessionId={homepageSessionId}
                    isViewingSelf={isViewingSelf}
                    isPreview={isPreview}
                    isBusinessUser={user.isBusinessUser}
                  />
                </HorizontalScrollArea.Item>
              ))}

              <HorizontalScrollArea.Item className={closetItemClass}>
                <ClosetCTA
                  itemCount={user.itemCount}
                  userId={user.id}
                  onClick={handleCtaClick}
                  position={items.length + 1}
                />
              </HorizontalScrollArea.Item>
            </HorizontalScrollArea>
          </div>
        </div>
      </Cell>
    </div>
  )
}

export default Closet
