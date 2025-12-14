import { pickBy } from 'lodash'

import { PageId } from '@marketplace-web/environment/page-configuration-util'

import { FormName, PageType } from '../../constants'

export const filterEmptyStringAttributes = <T extends object>(object: T): Partial<T> =>
  pickBy(object, val => Boolean(String(val)))

export function isProductPage(pageId: PageId | null) {
  return pageId === 'item'
}

const pageTypeFormNameMap: Partial<Record<PageType, FormName>> = {
  [PageType.Checkout]: FormName.Checkout,
  [PageType.AddListing]: FormName.AddListing,
}

export function getFormName(pageType: PageType) {
  return pageTypeFormNameMap[pageType] || ''
}

export function getPageType(
  relativeUrl: string,
  searchString: string | null,
  pageId: PageId | null,
) {
  if (searchString) return PageType.SearchResult
  if (isProductPage(pageId)) return PageType.ProductDisplay

  if (relativeUrl.endsWith('/checkout')) return PageType.Checkout
  if (relativeUrl.endsWith('/member/items/favourite_list')) return PageType.Favourites
  if (relativeUrl.endsWith('/items/new')) return PageType.AddListing

  return PageType.Others
}
