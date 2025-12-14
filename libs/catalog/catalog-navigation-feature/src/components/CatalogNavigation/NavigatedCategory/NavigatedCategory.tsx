'use client'

import { ChevronRight16, Dots24 } from '@vinted/monochrome-icons'
import { Cell, Image, Divider, Icon, Badge, Text, Spacer } from '@vinted/web-ui'
import { MouseEvent, useEffect, useMemo, useState } from 'react'

import { useTrackAbTestCallback } from '@marketplace-web/feature-flags/ab-tests-data'
import {
  CatalogNavigationDto,
  ExperimentDto,
  CatalogAttribute,
} from '@marketplace-web/catalog/catalog-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { selectCatalogEvent } from '@marketplace-web/catalog/catalog-navigation-data'

type Props = {
  category: CatalogNavigationDto
}

const ALL_L1_ID = -1
const ALL_L2_ID = -2
const CLOSED_ID = 0

const NavigatedCategory = ({ category }: Props) => {
  const { track } = useTracking()
  const translate = useTranslate('header.main_navigation.catalogs')
  const trackAbTest = useTrackAbTestCallback()
  const [selectedL1Id, setSelectedL1Id] = useState(CLOSED_ID)
  const [selectedL2Id, setSelectedL2Id] = useState(CLOSED_ID)

  const allText = translate('see_all')

  // recursively collect experiments from nested catalogs
  const experiments = useMemo(() => {
    const result: Array<ExperimentDto> = []
    const seenIds = new Set<number>()

    const traverse = (catalog: CatalogNavigationDto) => {
      if (catalog.experiment && !seenIds.has(catalog.experiment.id)) {
        result.push(catalog.experiment)
        seenIds.add(catalog.experiment.id)
      }

      catalog.catalogs?.forEach(traverse)
    }

    traverse(category)

    return result
  }, [category])

  // track all experiments when category changes
  useEffect(() => {
    experiments.forEach(experiment => {
      trackAbTest(experiment)
    })
  }, [experiments, trackAbTest])

  // reset state after tab navigation
  useEffect(() => {
    setSelectedL1Id(CLOSED_ID)
    setSelectedL2Id(CLOSED_ID)
  }, [category])

  // default to first non-hidden L1 category
  const selectedL1 = useMemo(() => {
    if (selectedL1Id === ALL_L1_ID) return undefined
    if (selectedL1Id === CLOSED_ID) {
      return category.catalogs.find(item => !item.is_hidden) || undefined
    }

    const selected = category.catalogs.find(item => item.id === selectedL1Id)

    return selected && !selected.is_hidden ? selected : undefined
  }, [category.catalogs, selectedL1Id])

  const renderText = (selected: boolean, text: string, testId: string) => (
    <Text
      as="span"
      bold={selected}
      theme={selected ? 'amplified' : 'inherit'}
      text={text}
      testId={testId}
    />
  )

  const trackSelectCatalog = (catalog: CatalogNavigationDto) => {
    track(
      selectCatalogEvent({
        catalogIds: [catalog.id],
        attributeId: CatalogAttribute.Navigation,
      }),
    )
  }

  const handleClickL2 = (catalog: CatalogNavigationDto) => {
    trackSelectCatalog(catalog)
  }

  const handleClickL1 = (event: MouseEvent, catalog: CatalogNavigationDto) => {
    const pointerEvent = event.nativeEvent as PointerEvent
    if (
      // pointerType: "" means keyboard (a11y)
      (pointerEvent.pointerType === '' || pointerEvent.pointerType === 'touch') &&
      catalog.catalogs.length > 0
    ) {
      event.preventDefault()
    } else {
      trackSelectCatalog(catalog)
    }

    setSelectedL1Id(catalog.id)
  }

  const handleClickAllL1 = () => {
    trackSelectCatalog(category)
  }

  const handleMouseEnterLevel1 = (id: number) => () => {
    setSelectedL1Id(id)
  }

  const handleMouseEnterLevel2 = (id: number) => () => {
    setSelectedL2Id(id)
  }

  // TODO: we will run an ABtest in future to determine if we should unify the experience for these categories
  const getL1Url = (code: string, url: string, customUrl?: string | null): string => {
    let selectedUrl = url

    // TODO: these hardcoded values will be removed in future
    if (customUrl && (code === 'DESIGNER_ROOT' || code === 'ELECTRONICS')) {
      selectedUrl = customUrl
    }

    return selectedUrl
  }

  // render L2 category as either a group or a regular navigable item
  const renderL2Category = (child: CatalogNavigationDto) => {
    if (child.is_hidden) return null

    if (child.type === 'group') {
      const visibleSubCategories = child.catalogs.filter(subChild => !subChild.is_hidden)
      if (visibleSubCategories.length === 0) return null

      return (
        <div key={child.id}>
          <Cell styling="narrow" body={<Text as="span" type="subtitle" text={child.title} />} />
          {visibleSubCategories.map(subChild => (
            <div key={subChild.id} onMouseEnter={handleMouseEnterLevel2(subChild.id)}>
              <Cell
                url={subChild.custom_url || subChild.url}
                onClick={() => handleClickL2(subChild)}
                body={renderText(
                  selectedL2Id === subChild.id,
                  subChild.title,
                  `third-category-${subChild.id}`,
                )}
                styling="narrow"
                type="navigating"
              />
            </div>
          ))}
        </div>
      )
    }

    return (
      <div key={child.id} onMouseEnter={handleMouseEnterLevel2(child.id)}>
        <Cell
          url={child.custom_url || child.url}
          onClick={() => handleClickL2(child)}
          body={renderText(selectedL2Id === child.id, child.title, `third-category-${child.id}`)}
          styling="narrow"
          type="navigating"
        />
      </div>
    )
  }

  // check if selected L1 has any L2 categories with type: 'group'
  const hasGroupType = useMemo(() => {
    return selectedL1?.catalogs.some(child => child.type === 'group' && !child.is_hidden) || false
  }, [selectedL1])

  // filter out hidden L1 categories
  const visibleL1Categories = category.catalogs.filter(child => !child.is_hidden)

  return (
    <div className="catalog-dropdown__navigated-container">
      <div className="catalog-dropdown__level1-container">
        {!category.disable_all_option && (
          <div onMouseEnter={handleMouseEnterLevel1(ALL_L1_ID)}>
            <Cell
              testId="category-l1-all"
              url={getL1Url(category.code, category.url, category.custom_url)}
              onClick={handleClickAllL1}
              type="navigating"
              prefix={<Icon name={Dots24} color="primary-default" />}
              body={renderText(selectedL1Id === ALL_L1_ID, allText, 'second-category-all')}
              styling="narrow"
            />
          </div>
        )}

        {visibleL1Categories.map(child => (
          <div key={child.id} onMouseEnter={handleMouseEnterLevel1(child.id)}>
            <Cell
              url={child.custom_url || child.url}
              onClick={ev => handleClickL1(ev, child)}
              type="navigating"
              prefix={<Image src={child.photo?.url} scaling="cover" size="regular" />}
              suffix={(() => {
                if (child.badge) {
                  return (
                    <Badge theme={child.badge.theme || 'primary'} content={child.badge.title} />
                  )
                }

                if (child.id === selectedL1?.id && child.catalogs.length > 0) {
                  return (
                    <div className="u-fill-height u-fill-width u-flexbox u-align-items-center u-justify-content-center">
                      <Icon name={ChevronRight16} testId={`chevron-${child.title}`} />
                    </div>
                  )
                }

                // prevent breaking line into 2 lines when hovering and chevron appears
                return <Spacer size="large" />
              })()}
              body={renderText(
                child.id === selectedL1?.id,
                child.title,
                `second-category-${child.id}`,
              )}
              styling="narrow"
              aria={{ 'aria-label': child.title }}
              urlProps={{ title: child.title }}
            />
          </div>
        ))}
      </div>
      <Divider orientation="vertical" />
      <div className="u-flex-1 u-fill-height u-sticky u-top">
        <div
          className="catalog-dropdown__level2-container"
          onMouseLeave={handleMouseEnterLevel2(CLOSED_ID)}
        >
          {selectedL1 && selectedL1.catalogs.length > 0 && (
            <>
              {!hasGroupType && !selectedL1.disable_all_option && (
                <div onMouseEnter={handleMouseEnterLevel2(ALL_L2_ID)}>
                  <Cell
                    onClick={() => handleClickL2(selectedL1)}
                    url={selectedL1.custom_url || selectedL1.url}
                    body={renderText(selectedL2Id === ALL_L2_ID, allText, 'third-category-all')}
                    styling="narrow"
                    type="navigating"
                  />
                </div>
              )}

              {selectedL1.catalogs
                .filter(child => !child.is_hidden)
                .map(child => renderL2Category(child))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default NavigatedCategory
