import { api } from '@marketplace-web/core-api/core-api-client-util'

import { SavedSearchDto } from '../types/dtos/saved-search'
import { moneyObjectHeader } from './money-object-header'

export type GetSavedSearchArgs = {
  userId: number
  id: number
}

export type GetSavedSearchResp = {
  search: SavedSearchDto
}

export const getSavedSearch = ({ userId, id }: GetSavedSearchArgs) =>
  api.get<GetSavedSearchResp>(`/users/${userId}/searches/${id}`, {
    headers: moneyObjectHeader,
  })
