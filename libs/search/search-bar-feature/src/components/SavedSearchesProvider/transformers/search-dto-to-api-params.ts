import { omit } from 'lodash'

import { SavedSearchApiParams, SavedSearchDto } from '@marketplace-web/search/search-bar-data'
import { getSelectedDynamicFiltersDtoParams } from '@marketplace-web/catalog/catalog-data'

export const searchDtoToApiParams = (search: SavedSearchDto): SavedSearchApiParams => {
  const priceFrom = search.price_from?.amount
  const priceTo = search.price_to?.amount
  const currency = search.price_from?.currency_code || search.price_to?.currency_code

  const omittedDtoAttributes = [
    'title',
    'subtitle',
    'new_items_count',
    'last_visited_at',
    'unrestricted_new_items_count',
    'selected_filters',
  ]

  return {
    ...omit(search, omittedDtoAttributes),
    price_from: priceFrom,
    price_to: priceTo,
    currency,
    filters: search?.selected_filters.length
      ? getSelectedDynamicFiltersDtoParams(search.selected_filters)
      : undefined,
  }
}
