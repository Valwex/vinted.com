import { ApiClient } from '@marketplace-web/core-api/api-client-util'

import { GetInboxNotificationsArgs } from '../types/args'
import { GetUnreadInboxNotificationsCountResp, GetInboxNotificationsResp } from '../types/response'

const api = new ApiClient({
  baseURL: '/web/api/notifications',
  headers: { platform: 'web' },
})

export const getInboxNotifications = ({ page, perPage }: GetInboxNotificationsArgs) => {
  return api.get<GetInboxNotificationsResp>('/notifications', {
    params: {
      page,
      per_page: perPage,
    },
  })
}

export const getUnreadInboxNotifications = () =>
  api.get<GetUnreadInboxNotificationsCountResp>('/notifications/unread_count')
