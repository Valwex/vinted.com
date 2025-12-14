import { api } from '@marketplace-web/core-api/core-api-client-util'

export type ToggleUserFavouriteArgs = {
  entityId: number | string
}

export const toggleUserFavourite = ({ entityId }: ToggleUserFavouriteArgs) =>
  api.post('/user_favourites/toggle', {
    type: 'item',
    user_favourites: [entityId],
  })
