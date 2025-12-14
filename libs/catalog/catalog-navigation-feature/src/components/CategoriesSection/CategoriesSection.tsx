'use client'

import { Divider, Cell, Text, Label, Image, Badge } from '@vinted/web-ui'

import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { CatalogNavigationDto, CatalogAttribute } from '@marketplace-web/catalog/catalog-data'

import { selectCatalogEvent } from '@marketplace-web/catalog/catalog-navigation-data'

type Props = {
  categories: Array<CatalogNavigationDto>
}

const CategoriesSection = ({ categories }: Props) => {
  const translate = useTranslate('header.side_bar')
  const { track } = useTracking()

  const handleTitleClick =
    ({ id }: CatalogNavigationDto) =>
    () => {
      const trakingEvent = selectCatalogEvent({
        catalogIds: [id],
        attributeId: CatalogAttribute.Navigation,
      })

      track(trakingEvent)
    }

  // TODO: we will run an ABtest in future to determine if we should unify the experience for these categories
  const getUrl = (code: string, url: string, customUrl?: string | null): string => {
    let selectedUrl = url

    // TODO: hese hardcoded values will be removed in future
    if (customUrl && (code === 'DESIGNER_ROOT' || code === 'ELECTRONICS')) {
      selectedUrl = customUrl
    }

    return selectedUrl
  }

  const renderCategoriesItem = (item: CatalogNavigationDto) => (
    <Cell
      key={item.id}
      type="navigating"
      prefix={<Image src={item.photo?.url} scaling="cover" size="regular" />}
      suffix={
        item.badge && <Badge theme={item.badge.theme || 'primary'} content={item.badge.title} />
      }
      body={
        <Text as="span" truncate>
          {item.title}
        </Text>
      }
      url={getUrl(item.code, item.url, item.custom_url)}
      urlProps={{ title: item.title }}
      onClick={handleTitleClick(item)}
      testId={`sidebar-category-item-${item.id}`}
      aria={{ 'aria-label': item.title }}
    />
  )

  return (
    <div>
      <Label text={translate('categories')} />
      <SeparatedList separator={<Divider />}>{categories.map(renderCategoriesItem)}</SeparatedList>
    </div>
  )
}

export default CategoriesSection
