import { useQuery } from '@tanstack/react-query'

import { conversationStats } from '../api'

export default function useUnreadMessages() {
  const { data: unreadMessageCount } = useQuery({
    queryKey: [conversationStats.queryKey],
    queryFn: conversationStats.get,
    select: response => {
      if (!response) return 0
      if ('errors' in response) return 0

      return response.unread_msg_count
    },
  })

  return unreadMessageCount ?? 0
}
