import { UiState } from '@marketplace-web/shared/ui-state-util'
import {
  CatalogBrandState,
  CatalogState,
  ConfigurationState,
  CURRENCY_FALLBACK,
  DataState,
  DtoState,
  DynamicFilterFacets,
  DynamicFiltersState,
  FacetedCategoriesState,
  FilterState,
  GeneralState,
  ItemsState,
  LOCALE_FALLBACK,
  SearchSessionState,
} from '@marketplace-web/catalog/catalog-data'

export const initialFilterState: FilterState = {
  catalogIds: [],
  priceFrom: null,
  priceTo: null,
  currency: null,
  sortBy: null,
  isPopularCatalog: false,
  isPersonalizationDisabled: false,
  catalogFrom: null,
  disableSearchSaving: false,
}

export const initialFilterFacets: DynamicFilterFacets = {
  filterFacetsCount: null,
  filterFacetsCountMax: null,
  filterFacetsCode: null,
  filterFacetsOptions: [],
}

export const initialDynamicFilterState: DynamicFiltersState = {
  dynamicFilters: [],
  selectedDynamicFilters: [],
  temporarySelectedDynamicFilters: [],
  temporaryCatalogIds: [],
  filterFacets: initialFilterFacets,
  temporaryPriceRange: {
    priceFrom: null,
    priceTo: null,
  },
  filterSearchQuery: {
    text: null,
    code: null,
  },
  ui: {
    uiState: UiState.Idle,
    errors: [],
  },
}

export const initialDtoState: DtoState = {
  catalogs: [],
  dynamicFilters: [],
  selectedDynamicFilters: [],
}

export const initialDataState: DataState = {
  catalogTree: [],
  catalogs: [],
  uiState: UiState.Pending,
}

export const initialConfigurationState: ConfigurationState = {
  config: {
    currency: CURRENCY_FALLBACK,
    locale: LOCALE_FALLBACK,
  },
  ui: {
    uiState: UiState.Idle,
    errors: [],
  },
}

export const initialCatalogBrandState: CatalogBrandState = {
  brand: undefined,
}

export const initialSearchSessionState: SearchSessionState = {
  correlationId: '',
  sessionId: '',
  globalSearchSessionId: null,
  globalCatalogBrowseSessionId: null,
}

export const initialGeneralState: GeneralState = {
  filtersChangeCount: 0,
  title: null,
}

export const initialItemsState: ItemsState = {
  items: [],
  pagination: undefined,
  searchTrackingParams: initialSearchSessionState,
  replicaWarning: undefined,
  uiState: UiState.Idle,
  error: undefined,
}

export const initialFacetedCategoriesState: FacetedCategoriesState = {
  categories: [],
  uiState: UiState.Idle,
  error: undefined,
}

export const initialState: CatalogState = {
  filters: initialFilterState,
  dynamicFilters: initialDynamicFilterState,
  dtos: initialDtoState,
  data: initialDataState,
  catalogBrand: initialCatalogBrandState,
  general: initialGeneralState,
  items: initialItemsState,
  facetedCategories: initialFacetedCategoriesState,
}
