import { omitBy, isNil } from 'lodash'

import { ApiResponse } from '@marketplace-web/core-api/api-client-util'
import { api } from '@marketplace-web/core-api/core-api-client-util'

import { FaqEntryType } from '../types/faq-entry-type'
import { ColorsResp } from '../types/colors'
import { CreateItemDraftArgs, SubmitDraftResp } from '../types/create-item-draft'
import { FaqEntryResp } from '../types/faq-entry'
import { GetItemEditArgs, ItemEditResp } from '../types/item-edit'
import { GetItemPriceSuggestionsArgs, PriceSuggestionsResp } from '../types/price-suggestions'
import { GetSimilarSoldItemsArgs, GetSimilarSoldItemsResp } from '../types/similar-sold-items'
import { GetVideoGameRatingsResp } from '../types/video-game-rating'
import { ItemUploadConfigurationResp } from '../types/configuration'
import { MULTIPLE_SIZE_GROUPS_HEADER, BRAND_MINIMIZED_HEADER } from '../constants'
import { UpdateItemDraftArgs } from '../types/update-item-draft'
import { CreateItemArgs, SubmitItemResp } from '../types/create-item'
import { UpdateItemArgs } from '../types/update-item'
import { CompleteItemArgs } from '../types/complete-item'
import {
  GetCategorySuggestionsFromPhotosArgs,
  GetCategorySuggestionsFromPhotosResp,
  GetItemSuggestionsArgs,
  ItemSuggestionsResponse,
} from '../types/item-suggestions'
import { GetSizeGroupsResp } from '../types/size-group'
import { BrandsResp, GetBrandsArgs } from '../types/brands'

import { GetItemUploadCatalogsResp } from '../types/catalog'
import {
  GetUploadFormModelsArgs,
  GetUploadFormModelsResp,
  GetUploadFormSearchModelsArgs,
} from '../types/models'
import { ItemUploadConditionsArgs, ItemUploadConditionsResp } from '../types/item-upload-conditions'
import { GetTrackerAttributesResp } from '../types/tracker-attributes'
import { GetItemAuthenticityModalArgs, ItemAuthenticityModalResp } from '../types/authenticity'
import {
  GetOfflineVerificationEligibiltyCriteriaResp,
  OfflineVerificationEligibilityCheckResp,
} from '../types/offline-verification'
import { ISBNRecordsResp } from '../types/isbn-records'
import { LayeredDynamicAttribute } from '../types'
import {
  FetchLayeredDynamicAttributesResp,
  SearchLayeredDynamicAtributeOptionsResp,
} from '../types/layered-dynamic-attributes'

export const getItemUploadConfiguration = () =>
  api.get<ItemUploadConfigurationResp>('/items/configuration')

export const getItemPriceSuggestions = ({
  brandId,
  statusId,
  catalogId,
  modelMetadata,
  temporaryPhotoId,
}: GetItemPriceSuggestionsArgs) =>
  api.get<PriceSuggestionsResp>('/item_price_suggestions', {
    params: {
      brand_id: brandId,
      status_id: statusId,
      catalog_id: catalogId,
      model_metadata: modelMetadata,
      temporary_photo_id: temporaryPhotoId,
    },
  })

export const getSimilarSoldItems = ({
  brandId,
  statusId,
  catalogId,
  modelMetadata,
  uploadSessionId,
  temporaryPhotoId,
}: GetSimilarSoldItemsArgs) =>
  api.get<GetSimilarSoldItemsResp>('/item_upload/items/similar_sold_items', {
    params: {
      brand_id: brandId,
      status_id: statusId,
      catalog_id: catalogId,
      model_metadata: modelMetadata,
      temporary_photo_id: temporaryPhotoId,
      upload_session_id: uploadSessionId,
    },
  })

export const getColors = () => api.get<ColorsResp>('/item_upload/colors')

export const getItemEdit = ({ id }: GetItemEditArgs) =>
  api.get<ItemEditResp>(`/item_upload/items/${id}`, { headers: MULTIPLE_SIZE_GROUPS_HEADER })

export const createItem = ({
  item,
  feedbackId,
  isItemBumped,
  parcel,
  uploadSessionId,
}: CreateItemArgs) =>
  api.post<SubmitItemResp>(
    '/item_upload/items',
    {
      item,
      feedback_id: feedbackId,
      push_up: isItemBumped,
      parcel,
      upload_session_id: uploadSessionId,
    },
    {
      headers: {
        'X-Upload-Form': 'true',
        ...MULTIPLE_SIZE_GROUPS_HEADER,
      },
    },
  )

export const updateItem = ({
  item,
  feedbackId,
  isItemBumped,
  parcel,
  uploadSessionId,
}: UpdateItemArgs) =>
  api.put<SubmitItemResp>(
    `/item_upload/items/${item.id}`,
    {
      item,
      feedback_id: feedbackId,
      push_up: isItemBumped,
      parcel,
      upload_session_id: uploadSessionId,
    },
    {
      headers: MULTIPLE_SIZE_GROUPS_HEADER,
    },
  )

export const completeItem = ({
  draft,
  feedbackId,
  isItemBumped,
  parcel,
  uploadSessionId,
}: CompleteItemArgs) =>
  api.post<SubmitItemResp>(
    `/item_upload/drafts/${draft.id}/completion`,
    {
      draft,
      feedback_id: feedbackId,
      push_up: isItemBumped,
      parcel,
      upload_session_id: uploadSessionId,
    },
    {
      headers: MULTIPLE_SIZE_GROUPS_HEADER,
    },
  )

export const deleteItem = (id: number) => api.post(`/items/${id}/delete`)

export const createItemDraft = ({
  draft,
  feedbackId,
  parcel,
  uploadSessionId,
}: CreateItemDraftArgs) =>
  api.post<SubmitDraftResp>(
    '/item_upload/drafts',
    { draft, feedback_id: feedbackId, parcel, upload_session_id: uploadSessionId },
    {
      headers: MULTIPLE_SIZE_GROUPS_HEADER,
    },
  )

export const updateItemDraft = ({
  draft,
  feedbackId,
  parcel,
  uploadSessionId,
}: UpdateItemDraftArgs) =>
  api.put<SubmitDraftResp>(
    `/item_upload/drafts/${draft.id}`,
    { draft, feedback_id: feedbackId, parcel, upload_session_id: uploadSessionId },
    {
      headers: MULTIPLE_SIZE_GROUPS_HEADER,
    },
  )

export const deleteItemDraft = (id: number) => api.delete(`/item_upload/drafts/${id}`)

export const getVideoGameRatings = () => api.get<GetVideoGameRatingsResp>('/video_game_ratings')

export const getItemSuggestions = ({
  title,
  description,
  categoryId,
  suggestedCategoryId,
  photoIds,
  uploadSessionId,
  isBrandsDtoMinimized,
}: GetItemSuggestionsArgs) =>
  api.get<ItemSuggestionsResponse>('/item_upload/suggestions/attributes', {
    params: {
      title,
      description,
      category_id: categoryId,
      suggested_category_id: suggestedCategoryId,
      photo_ids: photoIds.join(','),
      upload_session_id: uploadSessionId,
    },
    headers: isBrandsDtoMinimized
      ? { ...MULTIPLE_SIZE_GROUPS_HEADER, ...BRAND_MINIMIZED_HEADER }
      : MULTIPLE_SIZE_GROUPS_HEADER,
  })

export const getCategorySuggestionsFromPhotos = ({
  photoIds,
  uploadSessionId,
}: GetCategorySuggestionsFromPhotosArgs) =>
  api.get<GetCategorySuggestionsFromPhotosResp>('/item_upload/suggestions/categories', {
    params: {
      photo_ids: photoIds.join(','),
      upload_session_id: uploadSessionId,
    },
  })

export const getSizeGroupsByCatalog = (catalogId: number) =>
  api.get<GetSizeGroupsResp>('/size_groups', {
    params: { catalog_ids: catalogId },
    headers: MULTIPLE_SIZE_GROUPS_HEADER,
  })

export const getBrands = ({ keyword, categoryId, isDtoMinimized }: GetBrandsArgs) =>
  api.get<BrandsResp>('/item_upload/brands', {
    params: omitBy({ keyword, category_id: categoryId }, isNil),
    headers: isDtoMinimized ? BRAND_MINIMIZED_HEADER : {},
  })

export const getISBNDetails = (isbn: string) =>
  api.get<ISBNRecordsResp>('/item_upload/isbn_records', {
    params: {
      isbn,
    },
  })

export const getItemUploadCatalogs = () =>
  api.get<GetItemUploadCatalogsResp>('/item_upload/catalogs')

export const searchCategory = (keyword: string | null | undefined) =>
  api.get<{ catalog_ids: Array<number> }>('item_upload/catalogs/search', { params: { keyword } })

// Header is only needed for root layer aka Category and during migration
// Other layers will not require header and will use separate API without them
export const fetchLayeredAttributesWithHeader = (attributes: Array<LayeredDynamicAttribute>) =>
  api.post<FetchLayeredDynamicAttributesResp>(
    '/item_upload/attributes',
    {
      attributes,
    },
    {
      headers: { 'Accept-Features': 'ALL' },
    },
  )

export const fetchLayeredAttributes = (attributes: Array<LayeredDynamicAttribute>) =>
  api.post<FetchLayeredDynamicAttributesResp>('/item_upload/attributes', {
    attributes,
  })

export const searchLayeredDynamicAttributeOptions = (
  code: string,
  value: string | null | undefined,
) =>
  api.post<SearchLayeredDynamicAtributeOptionsResp>('/item_upload/attributes/search', {
    code,
    value,
  })

export const getUploadFormModels = ({ catalogId, brandId }: GetUploadFormModelsArgs) =>
  api.get<GetUploadFormModelsResp>('item_upload/models', {
    params: {
      catalog_id: catalogId,
      brand_id: brandId,
    },
  })

export const getUploadFormSearchModels = ({
  catalogId,
  brandId,
  searchText,
}: GetUploadFormSearchModelsArgs) =>
  api.get<GetUploadFormModelsResp>('item_upload/models_search', {
    params: {
      catalog_id: catalogId,
      brand_id: brandId,
      search_text: searchText,
    },
  })

export const getItemUploadConditions = ({ catalogId }: ItemUploadConditionsArgs) =>
  api.get<ItemUploadConditionsResp>('/item_upload/conditions', {
    params: { catalog_id: catalogId },
  })

export const getIsPreviousLister = () =>
  api.get<GetTrackerAttributesResp>('/tracker_attributes', {
    params: {
      type: 'previous_lister',
    },
  })

export const getIsSecondDayLister = () =>
  api.get<GetTrackerAttributesResp>('/tracker_attributes', {
    params: {
      type: 'second_day_lister',
    },
  })

export const getItemAuthenticityModal = ({
  catalogId,
  itemId,
  force = false,
  modalDataOnly = false,
}: GetItemAuthenticityModalArgs) =>
  api.get<ItemAuthenticityModalResp>('/items/authenticity_modals', {
    params: {
      catalog_id: catalogId,
      force,
      item_id: itemId,
      modal_data_only: modalDataOnly,
    },
  })

export const modifyItemVisibility = (itemId: number, isHidden: boolean) =>
  api.put<ApiResponse>(`/items/${itemId}/is_hidden`, {
    is_hidden: isHidden,
  })

export const offlineVerificationEligibilityCheck = (
  itemAttributes: Array<{
    field_name: string
    value: string | number | Array<number> | Record<string, number>
  }>,
) =>
  api.post<OfflineVerificationEligibilityCheckResp>('/offline_verification/eligibility', {
    item_attributes: itemAttributes,
  })

export const getOfflineVerificationEligibilityCriteria = (catalogId: string) =>
  api.get<GetOfflineVerificationEligibiltyCriteriaResp>(
    `/offline_verification/criteria/${catalogId}`,
    {
      headers: {
        'X-Swap-Status-With-Condition': 'true',
      },
    },
  )

export const getFaqEntryById = (id: string) => api.get<FaqEntryResp, unknown>(`/faq_entries/${id}`)

export const getFaqEntryByType = (code: FaqEntryType) =>
  api.get<FaqEntryResp>(`/faq_entries/lookup?code=${code}`)
