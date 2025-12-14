import { removeParamsFromQuery } from '@marketplace-web/browser/url-util'

import {
  BRAND_ROUTE_REGEX,
  CATALOG_BRAND_ROUTE,
  CATALOG_BRAND_ROUTE_REGEX,
  CATALOG_MAIN_ROUTE,
  CATALOG_PER_PAGE,
  CATALOG_ROUTE_REGEX,
  NONE_CATALOG_ROUTE,
  PROHIBITED_SEO_PARAMS,
} from '../constants/catalog'
import { Pagination } from '../types/catalog-provider'
import { FilterModel } from '../types/models/filter'
import { BrandModel } from '../types/models/brand'
import { SelectedDynamicFilterModel } from '../types/models/dynamic-filter'
import { CatalogItem } from '../types/models/catalog-item'
import { CatalogNavigationModel } from '../types/models/catalog'
import { GetCatalogItemsArgs } from '../types/dtos/api-arg'
import { SortByOption } from '../constants/filter'

import {
  buildFilterUrlParams,
  CatalogExtraUrlParams,
  getSelectedDynamicFiltersParams,
} from './catalog-filter'
import { CATALOG_URL } from '../constants/routes'
import { filterEmptyValues } from './object'

type BuildCatalogUrlParamsArgs = {
  extraParams?: CatalogExtraUrlParams
  filters: Partial<FilterModel>
  selectedDynamicFilters?: Array<SelectedDynamicFilterModel>
}

export const buildCatalogUrlParams = ({
  filters,
  selectedDynamicFilters,
  extraParams,
}: BuildCatalogUrlParamsArgs) => {
  const filterParams = buildFilterUrlParams(filters)
  const dynamicParams = getSelectedDynamicFiltersParams(selectedDynamicFilters)

  const extraDynamicParamKeys = Object.keys(extraParams || {}).filter(key => key.endsWith('_ids'))
  const dynamicParamKeys = Object.keys(dynamicParams)
  const paramsToRemove = {}

  extraDynamicParamKeys.forEach(key => {
    if (!dynamicParamKeys.includes(key)) {
      paramsToRemove[key] = null
    }
  })

  const params = {
    ...extraParams,
    ...filterParams,
    ...dynamicParams,
    ...paramsToRemove,
  }

  return filterEmptyValues(params)
}

export const buildCatalogPaginationParams = (pagination: Pagination) => {
  const page = Number(pagination.page) > 1 ? pagination.page : null
  const perPage = pagination.perPage === CATALOG_PER_PAGE ? null : pagination.perPage

  return {
    per_page: perPage,
    time: pagination.time,
    page,
  }
}

export const getCatalogInitializersParamsFromUrl = (
  relativeUrl: string,
  params: Record<string, string | Array<string> | undefined>,
): Record<string, string | Array<string> | undefined> => {
  if (relativeUrl === CATALOG_URL) {
    // catalog?color_ids[]=1&catalog[]=2050
    return params
  }

  if (relativeUrl.match(CATALOG_BRAND_ROUTE_REGEX)) {
    // catalog/5-men/brand/12-zara
    const matches = relativeUrl.match(CATALOG_BRAND_ROUTE_REGEX)
    const catalogId = matches?.[1]
    const brandId = matches?.[2]

    return {
      ...params,
      catalog: catalogId ? [catalogId] : undefined,
      brand_ids: brandId ? [brandId] : undefined,
    }
  }

  if (relativeUrl.match(CATALOG_ROUTE_REGEX)) {
    // catalog/5-men
    const matches = relativeUrl.match(CATALOG_ROUTE_REGEX)
    const catalogId = matches?.[1]

    return {
      ...params,
      catalog: catalogId ? [catalogId] : undefined,
    }
  }

  if (relativeUrl.match(BRAND_ROUTE_REGEX)) {
    // brand/175586-garancia
    const matches = relativeUrl.match(BRAND_ROUTE_REGEX)
    const brandId = matches?.[1]

    return {
      ...params,
      brand_ids: brandId ? [brandId] : undefined,
    }
  }

  return params
}

export const getIsInCatalog = (relativeUrl: string): boolean => {
  if (relativeUrl === NONE_CATALOG_ROUTE) return false

  return relativeUrl.startsWith(CATALOG_MAIN_ROUTE) || relativeUrl.startsWith(CATALOG_BRAND_ROUTE)
}

export const catalogsNavigationsInAscOrder = (
  catalog: CatalogNavigationModel,
  other: CatalogNavigationModel,
) => catalog.order - other.order

export const catalogModelToCatalogListItem = (catalog: CatalogNavigationModel): CatalogItem => {
  const { id, title, catalogIds, parentId, code, depth, photo, badge } = catalog

  return {
    id,
    title,
    value: id,
    data: {
      id,
      catalogIds,
      parentId,
      code,
      depth,
      photo,
      badge,
    },
  }
}

export const catalogModelsToCatalogListItems = (
  catalogs: Array<CatalogNavigationModel>,
): Array<CatalogItem> => catalogs.map(catalogModelToCatalogListItem)

export const getNewPriceRange = (
  priceFrom: string | null | undefined,
  priceTo: string | null | undefined,
) => {
  if (priceFrom && priceTo && parseFloat(priceFrom) > parseFloat(priceTo)) {
    return { priceFrom: priceTo, priceTo: null }
  }

  return { priceTo, priceFrom }
}

const toNumberArray = (param: string | Array<string> | undefined | null): Array<number> => {
  let ids: Array<string> = []
  if (Array.isArray(param)) {
    ids = param
  } else if (param) {
    ids = [param]
  }

  return ids.map(id => parseInt(id, 10)).filter(id => !Number.isNaN(id))
}

export const parseCatalogItemsArgsFromUrl = (
  searchParams: Record<string, any>,
  relativeUrl: string,
): GetCatalogItemsArgs => {
  let catalogIds: Array<number> = []
  let brandId: string | undefined

  if (relativeUrl.match(CATALOG_BRAND_ROUTE_REGEX)) {
    const matches = relativeUrl.match(CATALOG_BRAND_ROUTE_REGEX)
    if (matches) {
      const [, catalogIdRaw, brandIdRaw] = matches
      if (catalogIdRaw) {
        const parsedCatalogId = parseInt(catalogIdRaw, 10)
        if (!Number.isNaN(parsedCatalogId)) {
          catalogIds = [parsedCatalogId]
        }
      }
      if (brandIdRaw) {
        brandId = brandIdRaw
      }
    }
  } else if (relativeUrl.match(CATALOG_ROUTE_REGEX)) {
    const matches = relativeUrl.match(CATALOG_ROUTE_REGEX)
    if (matches) {
      const [, catalogIdRaw] = matches
      if (catalogIdRaw) {
        const parsedCatalogId = parseInt(catalogIdRaw, 10)
        if (!Number.isNaN(parsedCatalogId)) {
          catalogIds = [parsedCatalogId]
        }
      }
    }
  } else if (relativeUrl.match(BRAND_ROUTE_REGEX)) {
    const matches = relativeUrl.match(BRAND_ROUTE_REGEX)
    if (matches) {
      const [, brandIdRaw] = matches
      if (brandIdRaw) {
        brandId = brandIdRaw
      }
    }
  } else {
    catalogIds = toNumberArray(searchParams.catalog)
  }

  let selectedDynamicFilters: Array<SelectedDynamicFilterModel> = []
  if (
    !(
      relativeUrl.match(CATALOG_ROUTE_REGEX) ||
      relativeUrl.match(BRAND_ROUTE_REGEX) ||
      relativeUrl.match(CATALOG_BRAND_ROUTE_REGEX)
    )
  ) {
    selectedDynamicFilters = Object.keys(searchParams)
      .filter(key => key.endsWith('_ids'))
      .map(key => {
        const type = key.slice(0, -4)
        const ids = toNumberArray(searchParams[key])

        return ids.length > 0 ? { type, ids } : null
      })
      .filter((filter): filter is SelectedDynamicFilterModel => filter !== null)
  }

  if (brandId) {
    const parsedBrandId = parseInt(brandId, 10)
    if (!Number.isNaN(parsedBrandId)) {
      selectedDynamicFilters = [{ type: 'brand', ids: [parsedBrandId] }]
    }
  }

  // validate sortBy value
  const validSortByValues = Object.values(SortByOption)
  const sortBy = validSortByValues.includes(searchParams.order)
    ? (searchParams.order as SortByOption)
    : undefined

  return {
    query: searchParams.search_text,
    catalogIds: catalogIds.length > 0 ? catalogIds : [],
    priceFrom: searchParams.price_from,
    priceTo: searchParams.price_to,
    currency: searchParams.currency,
    sortBy,
    isPopularCatalog: searchParams.popular,
    isPersonalizationDisabled: searchParams.disabled_personalization,
    catalogFrom: searchParams.catalog_from || null,
    disableSearchSaving: searchParams.disable_search_saving,
    page: parseInt(searchParams.page || '1', 10),
    perPage: CATALOG_PER_PAGE,
    time: searchParams.time,
    selectedDynamicFilters,
    searchByImageUuid: searchParams.search_by_image_uuid,
  }
}

export const removeCatalogSeoParams = (url: string, isBot: boolean) => {
  if (!isBot) return url
  if (!url.includes('/catalog') && !url.includes('/brand/')) return url

  const [path, search] = url.split('?')
  if (!search) return path || ''

  return removeParamsFromQuery(path || '', search, PROHIBITED_SEO_PARAMS)
}

export const getPageTitle = (
  seo?: { title: string; description?: string } | null,
  catalog?: CatalogNavigationModel | null,
  brand?: BrandModel | null,
): string | undefined => {
  if (seo?.title) return seo.title

  if (catalog?.title && brand?.title) return `${catalog.title} ${brand.title}`

  return catalog?.title || brand?.title
}
