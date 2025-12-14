import { CatalogNavigationDto } from '@marketplace-web/catalog/catalog-data'

const breadcrumbsToCategoryLevels = (data: Array<number>) => {
  return data.reduce(
    (acc, item, index) => {
      // eslint-disable-next-line no-param-reassign
      acc[`category_level_${index + 1}`] = item.toString()

      return acc
    },
    {} as Record<string, string>,
  )
}

const findCatalogPath = (
  targetId: string | number,
  catalogTree: CatalogNavigationDto,
): Array<number> | null => {
  const pathFinder = (id: number, catalogs: Array<CatalogNavigationDto>): Array<number> | null => {
    // eslint-disable-next-line no-restricted-syntax
    for (const catalog of catalogs) {
      if (catalog.id === id) {
        return [catalog.id]
      }
      if (catalog.catalogs && catalog.catalogs.length > 0) {
        const result = pathFinder(id, catalog.catalogs)
        if (result) {
          return [catalog.id, ...result]
        }
      }
    }

    return null
  }

  if (catalogTree.id === targetId) return [catalogTree.id]

  const path = pathFinder(Number(targetId), catalogTree.catalogs)

  return path ? [catalogTree.id, ...path] : null
}

export const getCategoriesFromCatalogTree = (
  catalogId: string | number,
  catalogTree: Array<CatalogNavigationDto>,
) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const catalog of catalogTree) {
    const breadcrumbs = findCatalogPath(catalogId, catalog)
    if (breadcrumbs) {
      return breadcrumbsToCategoryLevels(breadcrumbs)
    }
  }

  return {}
}
