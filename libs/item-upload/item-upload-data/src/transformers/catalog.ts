import { BadgeTheme } from '@vinted/web-ui/dist/types/lib/Badge/Badge'

import { Response } from '@marketplace-web/core-api/api-client-util'

import {
  CatalogSelectType,
  CatalogPhotoDto,
  GetItemUploadCatalogsResp,
  ItemUploadCatalogDto,
  CatalogBadgeDto,
} from '../types/catalog'

function isCatalogPhotoDto(value: Record<string, unknown>): value is CatalogPhotoDto {
  return 'url' in value
}

export const transformCatalogBadge = (
  badge: CatalogBadgeDto | null | undefined,
): CatalogBadgeDto | null => {
  if (!badge) return null

  const supportedThemes: Array<BadgeTheme> = [
    'primary',
    'muted',
    'success',
    'warning',
    'expose',
    'amplified',
  ]

  if (!supportedThemes.includes(badge.theme)) return null

  return badge
}

export const transformCatalogs = (
  catalogsDto: Array<ItemUploadCatalogDto>,
): Array<CatalogSelectType> => {
  const transformedCatalogs: Array<CatalogSelectType> = []

  function catalogTransform(catalog: ItemUploadCatalogDto, parentId: number) {
    const catalogIds: Array<number> = []

    if (catalog.catalogs) {
      catalog.catalogs.forEach(child => {
        catalogTransform(child, catalog.id)
        catalogIds.push(child.id)
      })
    }

    const transformedCatalog: CatalogSelectType = {
      id: catalog.id,
      code: catalog.code,
      parentId,
      catalogIds,
      url: catalog.url,
      title: catalog.title,
      restrictedToStatusId: catalog.restricted_to_status_id,
      multipleSizeGroupIds: catalog.multiple_size_group_ids,
      photo: isCatalogPhotoDto(catalog.photo) ? catalog.photo : null,
      badge: catalog.badge || null,
      path: catalog.path,
    }

    transformedCatalogs.push(transformedCatalog)
  }

  catalogsDto.forEach(catalog => catalogTransform(catalog, 0))

  return transformedCatalogs
}

export const transformCatalogsResponse = (
  response: Response<GetItemUploadCatalogsResp>,
): Array<CatalogSelectType> => transformCatalogs(response.catalogs)
