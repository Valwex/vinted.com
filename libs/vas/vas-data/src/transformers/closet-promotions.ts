import { isNil, omitBy } from 'lodash'

import { ProductItemModel, transformItemBoxDto } from '@marketplace-web/item-box/product-item-data'

import {
  ClosetModel,
  ClosetUserModel,
  ClosetDto,
  ClosetPromotionUserDto,
  GetClosetPromotionArgs,
  ClosetPromotionItemDto,
  ClosetPromotionItemDtoSvcVas,
  ClosetPromotionUserDtoSvcVas,
  ClosetDtoSvcVas,
  ClosetModelSvcVas,
} from '../types/closet-promotions'
import { ItemThumbnailSize } from '../constants/close-promotions'
import { transformCurrencyAmountDto, transformCurrencyDto } from './currency'
import { findThumbnail } from '../utils/photo'

export const ITEM_URL = (id: number): string => `/items/${id}`

const calculateRating = (reputation: number): number => {
  return Math.round(reputation * 5 * 100) / 100
}

const getItemPhotosThumbnails = (
  photos: Array<{ thumbnails: Array<{ type: ItemThumbnailSize | string; url: string }> }>,
  size = ItemThumbnailSize.Large,
) => {
  if (photos.length === 0) return undefined

  return photos
    .map(photo => photo.thumbnails.find(thumb => thumb.type === size)?.url)
    .filter((photoUrl): photoUrl is string => !!photoUrl)
}

const getItemThumbnail = (
  photos: Array<{
    is_main: boolean
    thumbnails: Array<{ type: ItemThumbnailSize | string; url: string }>
  }>,
  size = ItemThumbnailSize.Large,
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

export const getClosetPromotionsArgsToParams = (args: GetClosetPromotionArgs) => {
  const params = {
    per_page: args.perPage,
    screen_name: args.screenName,
    exclude_member_ids:
      args.excludedUserIds && args.excludedUserIds.length > 0
        ? args.excludedUserIds.join(',')
        : undefined,
    search_session_id: args.searchSessionId,
    include_self_preview: args.isPreview || undefined,
    ...args.catalogFilterParams?.filters,
    ...args.catalogFilterParams?.dynamicFilters,
  }

  return omitBy(params, isNil)
}

export const transformClosetUser = (
  user: ClosetPromotionUserDto,
  isBusinessUser: boolean,
): ClosetUserModel => {
  return {
    id: user.id,
    login: user.login,
    photoUrl: findThumbnail(user.photo),
    itemCount: user.item_count,
    isFollowing: user.is_favourite,
    feedbackReputation: calculateRating(user.feedback_reputation),
    feedbackCount: user.feedback_count,
    isBusinessUser,
  }
}

export const transformCloset = (closet: ClosetDto): ClosetModel => {
  const { items, user } = closet

  return {
    user: transformClosetUser(user, items[0]?.business_user || false),
    items,
    showBanner: false,
  }
}

export const transformClosets = (data: Array<ClosetDto>): Array<ClosetModel> =>
  data.map(transformCloset)

const tranaformClosetPromotionItemsThumbnails = (
  item: ClosetPromotionItemDto,
): Array<string> | undefined => {
  if (item.photos && item.photos.length > 0) {
    return getItemPhotosThumbnails(item.photos)
  }

  if (!item.photo) return undefined

  return getItemPhotosThumbnails([item.photo])
}

const tranaformClosetPromotionItemThumbnail = (item: ClosetPromotionItemDto): string | null => {
  if (item.photos && item.photos.length > 0) {
    return getItemThumbnail(item.photos)
  }

  if (!item.photo) return null

  return getItemThumbnail([item.photo])
}

const transformClosetPromotionItemDominantColor = (item: ClosetPromotionItemDto): string | null => {
  if (item.photos && item.photos.length > 0) {
    return getDominantColor(item.photos)
  }

  if (!item.photo) return null

  return getDominantColor([item.photo])
}

export const transformClosetPromotionItemDtoToProductItem = (
  item: ClosetPromotionItemDto,
): ProductItemModel => ({
  id: item.id,
  title: item.title,
  user: { id: item.user_id, isBusiness: item.business_user },
  url: item.url,
  favouriteCount: item.favourite_count,
  price: transformCurrencyAmountDto(item.price),
  serviceFee: item.service_fee ? transformCurrencyAmountDto(item.service_fee) : null,
  totalItemPrice: item.total_item_price
    ? transformCurrencyAmountDto(item.total_item_price)
    : undefined,
  isFavourite: item.is_favourite,
  thumbnailUrl: tranaformClosetPromotionItemThumbnail(item),
  thumbnailUrls: tranaformClosetPromotionItemsThumbnails(item),
  dominantColor: transformClosetPromotionItemDominantColor(item),
  itemBox: item.item_box && transformItemBoxDto(item.item_box),
})

export const transformClosetUserSvcVas = (user: ClosetPromotionUserDtoSvcVas): ClosetUserModel => {
  return {
    id: user.id,
    login: user.login,
    photoUrl: user.photo_url || null,
    itemCount: user.item_count,
    isFollowing: user.is_following,
    feedbackReputation: calculateRating(user.feedback_reputation),
    feedbackCount: user.feedback_count,
    isBusinessUser: user.is_business_user,
  }
}

export const transformClosetPromotionItemDtoSvcVasToProductItem = (
  item: ClosetPromotionItemDtoSvcVas,
  userId: number,
  isBusinessUser: boolean,
): ProductItemModel => ({
  id: item.id,
  title: item.title,
  user: { id: userId, isBusiness: isBusinessUser },
  url: ITEM_URL(item.id),
  favouriteCount: item.favourite_count,
  price: transformCurrencyDto(item.price),
  serviceFee: item.service_fee ? transformCurrencyDto(item.service_fee) : null,
  totalItemPrice: item.total_item_price ? transformCurrencyDto(item.total_item_price) : undefined,
  isFavourite: item.is_favourite,
  thumbnailUrl: getItemThumbnail(item.photos),
  thumbnailUrls: getItemPhotosThumbnails(item.photos),
  dominantColor: getDominantColor(item.photos),
  itemBox: item.item_box && transformItemBoxDto(item.item_box),
})

export const transformClosetSvcVas = (closet: ClosetDtoSvcVas): ClosetModelSvcVas => {
  const { items, user } = closet

  return {
    user: transformClosetUserSvcVas(user),
    items,
    showBanner: false,
  }
}

export const transformClosetsSvcVas = (data: Array<ClosetDtoSvcVas>): Array<ClosetModelSvcVas> =>
  data.map(transformClosetSvcVas)
