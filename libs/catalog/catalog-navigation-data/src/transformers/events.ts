import { CatalogAttribute } from '@marketplace-web/catalog/catalog-data'

// Source: https://github.com/vinted/dwh-schema-registry/blob/5387d2ce7b44ee93711a15dfb97c60a4d984f22c/avro/events/common/shared/user.avdl#L25
type UserTarget =
  | 'login'
  | 'upload_item'
  | 'cookie_settings'
  | 'sustainability_page_link'
  | 'help_center'

type SelectCatalogEventArgs = {
  catalogIds: Array<number>
  attributeId?: CatalogAttribute
  screen?: string
}

type SelectCatalogEventExtra = {
  catalog_id: string
  attribute_id: number | null
  screen?: string
}

export const selectCatalogEvent = (args: SelectCatalogEventArgs) => {
  const { catalogIds, attributeId, screen } = args

  const extra: SelectCatalogEventExtra = {
    catalog_id: catalogIds.join(','),
    attribute_id: attributeId ?? null,
  }

  if (screen) extra.screen = screen

  return {
    event: 'user.select_catalog',
    extra,
  }
}

type ClickEventArgs = {
  target: UserTarget
  screen?: string | null
  targetDetails?: string | null
  path?: string | null
  env?: string | null
}

type ClickEventExtra = {
  target: UserTarget
  screen?: string
  target_details?: string
  path?: string | null
  env?: string | null
}

export const clickEvent = (args: ClickEventArgs) => {
  const { target, screen, targetDetails, env, path } = args
  const extra: ClickEventExtra = { target }

  if (screen) extra.screen = screen

  if (targetDetails) extra.target_details = targetDetails

  if (env) extra.env = env

  if (path) extra.path = path

  return {
    event: 'user.click',
    extra,
  }
}
