import { flattenDeep, omit } from 'lodash'

import { DynamicExposeType, OptionType } from '../constants/dynamic-filter'
import { FilterState, SelectedFilter } from '../types/catalog-provider'
import { FilterModel } from '../types/models/filter'
import {
  DynamicFilterOptionModel,
  ExperimentModel,
  SelectedDynamicFilterModel,
} from '../types/models/dynamic-filter'
import { FilterGroupItemModel, FilterGroupModel } from '../types/models/filter-group'
import { AbTestDto, SelectedDynamicFilterDto } from '../types/dtos/dynamic-filter'
import { filterEmptyValues } from './object'

const initialFilterState: FilterState = {
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

export type CatalogExtraUrlParams = Record<
  string,
  string | number | null | undefined | Array<string | number>
>

type BuildCatalogUrlParamsArgs = {
  extraParams?: CatalogExtraUrlParams
  filters: Partial<FilterModel>
  selectedDynamicFilters?: Array<SelectedDynamicFilterModel>
}

export const addSelectedFilter = (
  newFilter: { type: string; ids: Array<number> },
  selectedDynamicFilters: Array<SelectedDynamicFilterModel>,
): Array<SelectedDynamicFilterModel> => {
  const existingFilterIndex = selectedDynamicFilters.findIndex(
    filter => filter.type === newFilter.type,
  )

  if (existingFilterIndex !== -1) {
    const updatedFilters = [...selectedDynamicFilters]
    updatedFilters[existingFilterIndex] = { type: newFilter.type, ids: newFilter.ids }

    return updatedFilters
  }

  return [...selectedDynamicFilters, { type: newFilter.type, ids: newFilter.ids }]
}

export const removeSelectedFilter = (
  removeFilter: { type: string; id: number },
  selectedDynamicFilters: Array<SelectedDynamicFilterModel>,
): Array<SelectedDynamicFilterModel> => {
  return selectedDynamicFilters
    .map(filter => {
      if (filter.type === removeFilter.type) {
        const updatedIds = filter.ids.filter(id => id !== removeFilter.id)

        return updatedIds.length > 0 ? { ...filter, ids: updatedIds } : null
      }

      return filter
    })
    .filter((filter): filter is SelectedDynamicFilterModel => filter !== null)
}

export const removeSelectedFilters = (
  removeFilters: { type: string; ids?: Array<number> },
  selectedDynamicFilters: Array<SelectedDynamicFilterModel>,
): Array<SelectedDynamicFilterModel> => {
  return selectedDynamicFilters
    .map(filter => {
      if (filter.type === removeFilters.type) {
        if (removeFilters.ids && removeFilters.ids.length > 0) {
          const updatedIds = filter.ids.filter(id => !removeFilters.ids!.includes(id))

          return updatedIds.length > 0 ? { ...filter, ids: updatedIds } : null
        }

        return null
      }

      return filter
    })
    .filter((filter): filter is SelectedDynamicFilterModel => filter !== null)
}

export const removeSelectedStaticFilter = (
  removeFilter: SelectedFilter,
  selectedFilters: Array<SelectedFilter>,
): Partial<FilterModel> => {
  const { name, value } = removeFilter

  const isArrayFilter = Array.isArray(initialFilterState[name])

  if (isArrayFilter) {
    const updatedArray = selectedFilters
      .filter(filter => filter.name === name && filter.value !== value)
      .map(filter => filter.value)

    return {
      [name]: updatedArray,
    }
  }

  return {
    [name]: initialFilterState[name],
  }
}

export const buildFilterUrlParams = (filters: Partial<FilterModel>) => ({
  search_text: filters.query || null,
  catalog: filters.catalogIds,
  price_from: filters.priceFrom === '' ? null : filters.priceFrom,
  price_to: filters.priceTo === '' ? null : filters.priceTo,
  currency: filters.currency,
  order: filters.sortBy,
  disabled_personalization: filters.isPersonalizationDisabled ? true : null,
  popular: filters.isPopularCatalog ? true : null,
  catalog_from: filters.query ? null : filters.catalogFrom,
})

export const getSelectedDynamicFiltersParams = (
  selectedDynamicFilters?: Array<SelectedDynamicFilterModel>,
): Record<string, Array<number | undefined>> => {
  if (!selectedDynamicFilters) return {}

  const dynamicParams: Record<string, Array<number | undefined>> = {}

  selectedDynamicFilters.forEach(({ type, ids }) => {
    if (ids && ids.length > 0) {
      dynamicParams[`${type}_ids`] = ids
    }
  })

  return dynamicParams
}

export const getSelectedDynamicFiltersDtoParams = (
  selectedDynamicFilters: Array<SelectedDynamicFilterDto>,
): Record<string, Array<number | undefined>> => {
  const dynamicParams: Record<string, Array<number | undefined>> = {}

  selectedDynamicFilters.forEach(({ code, ids }) => {
    dynamicParams[`${code}_ids`] = ids
  })

  return dynamicParams
}

export const buildSubcatalogUrlParams = (args: Omit<BuildCatalogUrlParamsArgs, 'pagination'>) => {
  const { filters, extraParams } = args

  const fullParams = {
    ...extraParams,
    ...buildFilterUrlParams(filters),
  }

  // Omiting params that might not be available on target catalog, these come from catalog_helper.rb
  const subcatalogParams = omit(fullParams, ['catalog', 'size_id', 'material_ids', 'id', 'page'])

  return filterEmptyValues(subcatalogParams)
}

const dynamicFilterOptions = (
  options: Array<DynamicFilterOptionModel>,
): RecursiveArray<DynamicFilterOptionModel> =>
  options.map(option => {
    return [option, ...dynamicFilterOptions(option.options)]
  })

export const flattenDynamicFilterOptions = (
  options: Array<DynamicFilterOptionModel>,
): Array<DynamicFilterOptionModel> =>
  flattenDeep(dynamicFilterOptions(options)).filter(filter => filter.type === OptionType.Default)

export const modifySelectedNavigationalFilters = (
  groups: Array<FilterGroupModel<DynamicFilterOptionModel>>,
  selectedIds: Array<number>,
): Array<FilterGroupModel<DynamicFilterOptionModel>> => {
  const selectedGroups: Array<FilterGroupModel<DynamicFilterOptionModel>> = []
  const remainingGroups: Array<FilterGroupModel<DynamicFilterOptionModel>> = []

  groups.forEach(group => {
    const { id, description, items } = group
    const selectedItems: Array<FilterGroupItemModel<DynamicFilterOptionModel>> = []
    const remainingItems: Array<FilterGroupItemModel<DynamicFilterOptionModel>> = []

    items.forEach(item => {
      if (selectedIds.includes(item.id)) {
        selectedItems.push(item)
      } else {
        remainingItems.push(item)
      }
    })

    if (selectedItems.length > 0) {
      const selectedGroup: FilterGroupModel<DynamicFilterOptionModel> = {
        // Due to duplications of groups, we need to create new unique group ids for react keys
        id: id * -1,
        description,
        items: selectedItems,
      }
      selectedGroups.push(selectedGroup)

      if (remainingItems.length > 0) {
        remainingGroups.push({ id, description, items: remainingItems })
      }
    } else {
      remainingGroups.push(group)
    }
  })

  return [...selectedGroups, ...remainingGroups]
}

export const findFilterOptionById = (
  options: Array<DynamicFilterOptionModel>,
  targetId: number,
): DynamicFilterOptionModel | undefined => {
  let found: DynamicFilterOptionModel | undefined

  options.some(item => {
    if (item.id === targetId && item.type === OptionType.Default) {
      found = item

      return true
    }

    found = findFilterOptionById(item.options, targetId)

    return found !== undefined
  })

  return found
}

export const trackExperimentsByType = (
  experiments: Array<ExperimentModel>,
  exposeType: DynamicExposeType,
  tracking: (abTest?: AbTestDto) => void,
) => {
  experiments
    .filter(experiment => experiment?.exposure_type === exposeType)
    .forEach(({ id, name, variant }) => {
      tracking({
        id,
        name,
        variant,
      })
    })
}

export const normalizeSearchParams = (
  searchParams: Record<string, string | Array<string> | undefined>,
): Record<string, string | Array<string> | undefined> => {
  return Object.fromEntries(
    Object.entries(searchParams)
      .map(([key, value]) => {
        if (key.endsWith('[]')) {
          const newKey = key.slice(0, -2)
          let newValue: string | Array<string> | undefined

          if (value == null) {
            newValue = undefined
          } else if (Array.isArray(value)) {
            newValue = value
          } else {
            newValue = [value]
          }
          if (!newKey) return null

          return [newKey, newValue]
        }

        return [key, value]
      })
      .filter((entry): entry is [string, string | Array<string> | undefined] => entry !== null),
  )
}
