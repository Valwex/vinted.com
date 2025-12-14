import { compact } from 'lodash'

import { transformItemBoxDto } from '@marketplace-web/item-box/product-item-data'

import { CurrencyAmountDto } from '../types/dtos/currency'
import { CurrencyAmountModel } from '../types/models/currency'
import { BlockEntityType } from '../constants'
import { HomepageConfigResp } from '../types/api/response/homepage-config-resp'
import {
  HomepageBlockEntityDto,
  HomepageItemBlockCtaDto,
  HomepageItemBlockDto,
  AcceptedOfferWidgetDto,
} from '../types/dtos/homepage-blocks'
import { HomepageItemDto } from '../types/dtos/homepage-item'
import {
  HomepageBlockEntityModel,
  HomepageItemBlockCtaModel,
  HomepageItemBlockModel,
  HomepageItemModel,
  HomepageTabModel,
  AcceptedOfferWidgetModel,
} from '../types/models/homepage-blocks'
import { transformBannersBlock, transformThumbnailsBlock } from './homepage-layouts'
import { HomepageTabResp } from '../types/homepage-blocks'
import { findThumbnail } from '../utils/photo'

enum ItemThumbnailSize {
  Medium = 'thumb150x210',
  Large = 'thumb310x430',
}

const getItemThumbnail = (
  photos: Array<{
    is_main: boolean
    thumbnails: Array<{ type: ItemThumbnailSize | string; url: string }>
  }>,
  size = ItemThumbnailSize.Medium,
) => {
  const photo = photos?.find(({ is_main }) => is_main)

  return findThumbnail(photo, size)
}

const getDominantColor = (photos: Array<{ is_main: boolean; dominant_color_opaque: string }>) => {
  if (!photos.length) return null

  const photo = photos.find(({ is_main }) => is_main === true)

  if (!photo) return null

  return photo.dominant_color_opaque
}

const transformHomepageItemBlockCta = (
  cta: HomepageItemBlockCtaDto | null,
): HomepageItemBlockCtaModel | null => {
  if (!cta) return null

  return {
    url: cta.url,
    title: cta.title,
    accessibilityLabel: cta.accessibility_label,
  }
}

const transformCurrencyAmountDto = (amount: CurrencyAmountDto): CurrencyAmountModel => ({
  amount: amount.amount,
  currencyCode: amount.currency_code,
})

const transformHomepageItemDto = (item: HomepageItemDto): HomepageItemModel => ({
  id: item.id,
  title: item.title,
  user: {
    id: item.user_id,
    isBusiness: item.business_user,
  },
  url: item.url,
  favouriteCount: item.favourite_count,
  price: transformCurrencyAmountDto(item.price),
  serviceFee: item.service_fee ? transformCurrencyAmountDto(item.service_fee) : undefined,
  totalItemPrice: item.total_item_price
    ? transformCurrencyAmountDto(item.total_item_price)
    : undefined,
  isPromoted: item.promoted,
  isFavourite: item.is_favourite,
  thumbnailUrl: item.photo && getItemThumbnail([item.photo], ItemThumbnailSize.Large),
  dominantColor: item.photo && getDominantColor([item.photo]),
  itemBox: item.item_box && transformItemBoxDto(item.item_box),
  contentSource: item.content_source,
  metadata: item.metadata,
  priceWithDiscount: item.discount ? transformCurrencyAmountDto(item.discount) : undefined,
})

export const transformHomepageItemDtos = (
  items: Array<HomepageItemDto>,
): Array<HomepageItemModel> => items.map(transformHomepageItemDto)

export const transformHomepageItemBlock = (
  itemBlock: HomepageItemBlockDto,
): HomepageItemBlockModel => ({
  id: itemBlock.id,
  name: itemBlock.name,
  title: itemBlock.title,
  subtitle: itemBlock.subtitle,
  items: transformHomepageItemDtos(itemBlock.items),
  headerCta: transformHomepageItemBlockCta(itemBlock.header_cta),
  itemCta: transformHomepageItemBlockCta(itemBlock.item_cta),
})

const transformAcceptedOfferWidget = (
  widget: AcceptedOfferWidgetDto,
): AcceptedOfferWidgetModel => ({
  name: widget.name,
  title: widget.title,
  subtitle: widget.subtitle,
  item: transformHomepageItemDto(widget.item),
  cta: {
    url: widget.cta.url,
    body: widget.cta.body,
  },
})

export const transformHomepageBlockEntity = (
  itemBlock: HomepageBlockEntityDto,
  logHomeError: (error: Error | null, feature?: string) => void,
): HomepageBlockEntityModel | undefined => {
  const { type } = itemBlock

  try {
    switch (type) {
      case BlockEntityType.ItemBoxBlock:
        return { type, entity: transformHomepageItemBlock(itemBlock.entity) }
      case BlockEntityType.ThumbnailsBlock:
        return { type, entity: transformThumbnailsBlock(itemBlock.entity) }
      case BlockEntityType.ExposureBlock:
        return { type, entity: itemBlock.entity }
      case BlockEntityType.BannersBlock:
        return { type, entity: transformBannersBlock(itemBlock.entity) }
      case BlockEntityType.Item:
        return { type, entity: transformHomepageItemDto(itemBlock.entity) }
      case BlockEntityType.AdOrCloset:
        return { type, entity: null }
      case BlockEntityType.Header:
        return itemBlock.entity.title ? { type, entity: itemBlock.entity } : undefined
      case BlockEntityType.ListerActivationBanner:
        return { type, entity: null }
      case BlockEntityType.ClickableListCards:
        return itemBlock
      case BlockEntityType.CtaWidget:
        return itemBlock
      case BlockEntityType.AcceptedOfferWidget:
        return { type, entity: transformAcceptedOfferWidget(itemBlock.entity) }
      default:
        return undefined
    }
  } catch (err) {
    logHomeError(err, type)

    return undefined
  }
}

export const transformHomepageBlockEntities = (
  blocks: Array<HomepageBlockEntityDto>,
  logHomeError: (error: Error | null, feature?: string) => void,
): Array<HomepageBlockEntityModel> =>
  compact(blocks.map(block => transformHomepageBlockEntity(block, logHomeError)))

export const transformHomepageTabDtos = (
  tabs: HomepageConfigResp['verticals'],
): Array<HomepageTabModel> =>
  tabs.map(tab => ({
    title: tab.title,
    name: tab.name,
    isPromoBoxEnabled: tab.is_promobox_enabled,
    isSellerPromotionEnabled: tab.is_seller_promotion_enabled,
    catalogId: tab.category_id,
    feed: {
      arePromotedClosetsEnabled: tab.feed.are_promoted_closets_enabled,
      areAdsEnabled: tab.feed.are_ads_enabled,
    },
  }))

export const transformHomepageBlockResponse = (
  response: HomepageTabResp,
  logHomeError: (error: Error | null, feature?: string) => void,
) => ({
  blocks: transformHomepageBlockEntities(response.blocks, logHomeError),
  showLoadMoreButton: response.load_more_button,
  nextPageToken: response.pagination.next_page_token,
})
