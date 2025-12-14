import { api } from '@marketplace-web/core-api/core-api-client-util'

import { moneyObjectHeader } from './money-object-header'
import { SavedSearchApiParams } from './types'

export type CreateSavedSearchResp = {
  search: {
    id: number
    subscribed: boolean
  }
}

export type CreateSavedSearchArgs = {
  userId: number
  search: SavedSearchApiParams
}

export const createSavedSearch = ({ userId, search }: CreateSavedSearchArgs) =>
  api.post<CreateSavedSearchResp>(
    `/users/${userId}/searches`,
    {
      search,
    },
    { headers: moneyObjectHeader },
  )
