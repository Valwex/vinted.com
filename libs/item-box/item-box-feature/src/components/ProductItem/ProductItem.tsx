'use client'

import { Badge } from '@vinted/web-ui'
import { MouseEvent, useContext } from 'react'
import { useIntl } from 'react-intl'

import { ItemBoxPriceBreakdown } from '@marketplace-web/escrow-pricing/escrow-pricing-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSession } from '@marketplace-web/shared/session-data'
import { transformAbsoluteUrlToRelative } from '@marketplace-web/browser/url-util'
import { BrazeCustomEvent } from '@marketplace-web/braze/braze-data'
import { BrazeContext, brazeLogCustomEvent } from '@marketplace-web/braze/braze-feature'
import { useToggleFavourite } from '@marketplace-web/item-favourites/favourite-feature'
import { ProductItemModel, getProductItemStatus } from '@marketplace-web/item-box/product-item-data'
import {
  GoogleTagManagerEvent,
  googleTagManagerTrack,
} from '@marketplace-web/google-track/google-track-feature'
import { getItemStatusMessage } from '@marketplace-web/item-page/item-status-data'
import { formatCurrencyAmount } from '@marketplace-web/currency/currency-data'

import {
  ContentSource,
  clickEvent,
  favouriteItemEvent,
} from '@marketplace-web/item-box/item-box-data'

import ItemBox from '../ItemBox'

type Props = {
  item: ProductItemModel
  renderFooter?: JSX.Element | null
  showStatus?: boolean
  showStatusAsBadge?: boolean
  showFavourite?: boolean
  viewingSelf?: boolean
  testId?: string
  url?: string
  isUrlDisabled?: boolean
  showPriceBreakdown?: boolean
  isBumpTextHidden?: boolean
  imageDisplayMode?: 'single' | 'collage'
  imagesExperimentalOverlayDisabled?: boolean
  onClick?: (event: MouseEvent) => void
  onFavouriteToggle?: (payload: {
    itemId: number
    itemContentSource?: ContentSource
    isFollowEvent: boolean
  }) => void
  openItemInNewTab?: boolean
}

const ProductItem = ({
  item,
  onClick,
  renderFooter,
  testId,
  url,
  openItemInNewTab,
  showStatus = false,
  showStatusAsBadge = false,
  showFavourite = true,
  viewingSelf = false,
  isUrlDisabled = false,
  showPriceBreakdown = true,
  onFavouriteToggle,
  imageDisplayMode = 'single',
  imagesExperimentalOverlayDisabled,
  isBumpTextHidden = false,
}: Props) => {
  const translate = useTranslate()
  const { track } = useTracking()
  const { user: sessionUser } = useSession()
  const { locale } = useIntl()

  const isItemUrlOriginMapperEnabled = useFeatureSwitch('item_url_origin_mapper')

  const viewedByGod = sessionUser?.is_god ?? false

  const userExternalId = useContext(BrazeContext).userExternalId.value
  const viewedByModerator = sessionUser?.moderator ?? false

  const isFavouriteEnabled = showFavourite && !viewingSelf
  const isPrivilegedUser = viewingSelf || viewedByGod || viewedByModerator

  const { isFavourite, favouriteCount, toggleFavourite, hasFavouritedChanged } = useToggleFavourite(
    {
      entityId: item.id,
      isFavourite: item.isFavourite,
      count: item.favouriteCount,
    },
  )

  const getTranslatedStatusMessage = () => {
    const status = showStatus ? getProductItemStatus(item, isPrivilegedUser) : null

    const statusMessage = getItemStatusMessage(status)

    if (!statusMessage) return null

    return {
      content: translate(String(statusMessage.content)),
      theme: statusMessage.theme,
    }
  }

  const getBadge = (): React.ComponentProps<typeof Badge> | null => {
    if (showStatusAsBadge) {
      const status = getTranslatedStatusMessage()

      if (status) {
        return status
      }
    }

    if (!item.badge) return null

    const { theme, body } = item.badge

    return { theme, content: body }
  }

  const handleFavouriteToggleSuccess = (newIsFavourite: boolean) => {
    if (!newIsFavourite) return

    googleTagManagerTrack(GoogleTagManagerEvent.AddToFavourites, {
      item_id: item.id,
    })

    brazeLogCustomEvent({
      event: BrazeCustomEvent.AddedToFavourites,
      modelId: item.id,
      userExternalId,
    })
  }

  const handleFavouriteToggleClick = () => {
    if (onFavouriteToggle) {
      onFavouriteToggle({
        itemId: item.id,
        itemContentSource: item.contentSource,
        isFollowEvent: !isFavourite,
      })
    } else {
      track(clickEvent({ target: 'favorite' }))
      track(favouriteItemEvent({ itemId: item.id, isFollowEvent: !isFavourite }))
    }

    toggleFavourite({
      onSuccess: handleFavouriteToggleSuccess,
    })
  }

  const getStatusProps = (): React.ComponentProps<typeof ItemBox>['status'] | null => {
    if (showStatusAsBadge) return null

    return getTranslatedStatusMessage()
  }

  function getFavouriteProps() {
    if (!isFavouriteEnabled) return undefined

    const textWithCount = translate(
      isFavourite ? 'item.a11y.unfavourite' : 'item.a11y.favourite',
      { count: favouriteCount },
      { count: favouriteCount },
    )

    return {
      favourited: isFavourite,
      count: favouriteCount,
      ariaIcon: { 'aria-label': textWithCount },
      onClick: handleFavouriteToggleClick,
    }
  }

  const getBumpText = () => {
    if (!item.isPromoted) return null

    if (viewingSelf) return null

    return <span data-testid="bump-badge">{translate('item.status.bumped')}</span>
  }

  const { id, priceWithDiscount, price, thumbnailUrl, thumbnailUrls, dominantColor, itemBox } = item

  let itemUrl = url || item.url
  itemUrl = isItemUrlOriginMapperEnabled ? transformAbsoluteUrlToRelative(itemUrl) : itemUrl

  const currentPrice = formatCurrencyAmount(priceWithDiscount || price, locale)
  const oldPrice = priceWithDiscount ? formatCurrencyAmount(price, locale) : null

  const itemTestId = testId || `product-item-id-${id}`

  return (
    <ItemBox
      itemId={item.id}
      url={isUrlDisabled ? undefined : itemUrl}
      price={currentPrice}
      oldPrice={oldPrice}
      image={thumbnailUrl}
      imageColor={dominantColor}
      imagesExperimental={imageDisplayMode === 'single' ? undefined : thumbnailUrls}
      imageDisplayMode={imageDisplayMode}
      onClick={onClick}
      favourite={getFavouriteProps()}
      hasFavouritedChanged={hasFavouritedChanged}
      renderFooter={renderFooter}
      status={getStatusProps()}
      badge={getBadge()}
      bumpText={!isBumpTextHidden && getBumpText()}
      testId={itemTestId}
      renderPriceBreakdown={
        showPriceBreakdown && (
          <ItemBoxPriceBreakdown
            testId={itemTestId}
            serviceFee={item.serviceFee}
            id={item.id}
            price={item.price}
            totalItemPrice={item.totalItemPrice}
            user={item.user}
            priceWithDiscount={item.priceWithDiscount}
            itemTitle={item.title}
            itemPhotoSrc={item.thumbnailUrl}
          />
        )
      }
      imagesExperimentalOverlayDisabled={imagesExperimentalOverlayDisabled}
      itemBox={itemBox}
      openItemInNewTab={openItemInNewTab}
    />
  )
}

export default ProductItem
