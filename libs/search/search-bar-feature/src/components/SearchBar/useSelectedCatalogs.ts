import { useMemo } from 'react'

import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import {
  getCatalogInitializersParamsFromUrl,
  CatalogNavigationDto,
} from '@marketplace-web/catalog/catalog-data'

const findCatalogs = (
  catalogs: Array<CatalogNavigationDto>,
  ids: Array<number>,
  result: Array<CatalogNavigationDto> = [],
): Array<CatalogNavigationDto> | undefined => {
  if (ids.length === result.length) return result

  catalogs.forEach(catalog => {
    if (ids.includes(catalog.id)) {
      result.push(catalog)
    }

    findCatalogs(catalog.catalogs, ids, result)
  })

  return result
}

const useSelectedCatalogs = (
  catalogTree: Array<CatalogNavigationDto>,
): Array<CatalogNavigationDto> => {
  const queryParams = useBrowserNavigation().searchParams
  const { relativeUrl } = useBrowserNavigation()

  let { catalog } = getCatalogInitializersParamsFromUrl(relativeUrl, queryParams)
  catalog = queryParams.catalog || catalog

  const selectedIdsString = Array.isArray(catalog) ? catalog : [catalog]
  const selectedIds: Array<number> = selectedIdsString
    .filter(item => !!item)
    .map(item => Number(item))

  const selectedCatalogs = useMemo<Array<CatalogNavigationDto>>(() => {
    return findCatalogs(catalogTree, selectedIds) || []
  }, [catalogTree, selectedIds])

  return selectedCatalogs
}

export default useSelectedCatalogs
