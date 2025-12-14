import { api } from '@marketplace-web/core-api/core-api-client-util'

import { GetConversationsStatsResp } from '../types/unread-messages'

export const conversationStats = {
  get: () => api.get<GetConversationsStatsResp>('/conversations/stats'),
  queryKey: 'conversations-stats',
}
