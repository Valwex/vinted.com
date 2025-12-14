import { api } from '@marketplace-web/core-api/core-api-client-util'

import { SavedSearchDto } from '../types/dtos/saved-search'
import { moneyObjectHeader } from './money-object-header'

export type GetSortedSavedSearchesResp = {
  searches: Array<SavedSearchDto>
}

export const getSortedSavedSearches = (userId: number) =>
  api.get<GetSortedSavedSearchesResp>(`/users/${userId}/searches/sorted`, {
    headers: moneyObjectHeader,
  })
