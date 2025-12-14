import { compact } from 'lodash'

import { SavedSearchDto } from '@marketplace-web/search/search-bar-data'
import { getSelectedDynamicFiltersDtoParams } from '@marketplace-web/catalog/catalog-data'

import { filterEmptyValues } from '../../../utils/object'

export const searchDtoToUrlParams = (search: SavedSearchDto) => {
  const { search_text } = search

  const disposal = ['is_for_sell']
    .filter(option => search[option])
    .map(option => `search_${option}`)

  const params = {
    search_text,
    catalog: compact([search.catalog_id]),
    disposal: compact(disposal),
    price_from: search.price_from?.amount,
    price_to: search.price_to?.amount,
    currency: search.price_from?.currency_code || search.price_to?.currency_code,
    ...getSelectedDynamicFiltersDtoParams(search.selected_filters),
  }

  return filterEmptyValues(params)
}
