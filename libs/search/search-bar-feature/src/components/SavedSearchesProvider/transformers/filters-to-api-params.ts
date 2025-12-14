import { first } from 'lodash'

import { SavedSearchApiParams } from '@marketplace-web/search/search-bar-data'
import {
  getSelectedDynamicFiltersParams,
  SelectedDynamicFilterModel,
  FilterState,
} from '@marketplace-web/catalog/catalog-data'

import { filterEmptyValues } from '../../../utils/object'

export const filtersToApiParams = (
  filters: FilterState,
  selectedDynamicFilters: Array<SelectedDynamicFilterModel>,
  searchText: string,
): SavedSearchApiParams => {
  const params: SavedSearchApiParams = {
    search_text: searchText,
    catalog_id: first(filters.catalogIds),
    price_from: filters.priceFrom || undefined,
    price_to: filters.priceTo || undefined,
    currency: filters.currency || undefined,
    filters: getSelectedDynamicFiltersParams(selectedDynamicFilters),
  }

  return filterEmptyValues(params)
}
