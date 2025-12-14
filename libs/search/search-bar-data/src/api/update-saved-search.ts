import { api } from '@marketplace-web/core-api/core-api-client-util'

import { moneyObjectHeader } from './money-object-header'
import { SavedSearchApiParams } from './types'

export type UpdateSavedSearchResp = {
  search: {
    id: number
    subscribed: boolean
  }
}

export type UpdateSavedSearchArgs = {
  id: number
  userId: number
  search: SavedSearchApiParams
  keepLastVisitTime?: boolean
}

export const updateSavedSearch = ({
  id,
  userId,
  search,
  keepLastVisitTime,
}: UpdateSavedSearchArgs) =>
  api.put<UpdateSavedSearchResp>(
    `/users/${userId}/searches/${id}`,
    {
      search,
      keep_last_visit_time: !!keepLastVisitTime,
    },
    { headers: moneyObjectHeader },
  )
