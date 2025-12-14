import { toParams } from '@marketplace-web/browser/url-util'
import { getCatalogInitializersParamsFromUrl } from '@marketplace-web/catalog/catalog-data'
import { SavedSearchApiParams } from '@marketplace-web/search/search-bar-data'

export const urlToApiParams = (url: URL): SavedSearchApiParams => {
  const urlParams = getCatalogInitializersParamsFromUrl(
    url.pathname + url.search,
    toParams(url.search),
  )

  const params: SavedSearchApiParams = {
    catalog_id: urlParams.catalog?.[0],

    search_text: urlParams.search_text && String(urlParams.search_text),
    price_from: urlParams.price_from && Number(urlParams.price_from),
    price_to: urlParams.price_to && Number(urlParams.price_to),

    filters: {},
  }

  if (params.catalog_id) {
    params.catalog_id = Number(params.catalog_id)
  }

  Object.entries(urlParams).forEach(([key, value]) => {
    if (key.endsWith('_ids') && Array.isArray(value)) {
      params.filters![key] = value.map(item => Number(item))
    }
  })

  return params
}
