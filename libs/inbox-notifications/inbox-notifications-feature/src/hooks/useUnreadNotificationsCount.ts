import { useCallback, useEffect, useState } from 'react'

import {
  getUnreadInboxNotifications,
  transformUnreadNotificationsResponse,
} from '@marketplace-web/inbox-notifications/inbox-notifications-data'
import { clientSideMetrics } from '@marketplace-web/observability/client-metrics-util'

const handleFetchFailure = (response: any) => {
  const label = response?.status?.toString() || 'empty_response'
  clientSideMetrics.counter('notifications_count_fetch_failure', { label }).increment()
}

const useUnreadNotificationsCount = () => {
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0)

  const fetchUnreadNotificationsCount = useCallback(async () => {
    await getUnreadInboxNotifications().then(
      (response: Awaited<ReturnType<typeof getUnreadInboxNotifications>>) => {
        if (!response || 'errors' in response) {
          handleFetchFailure(response)

          return
        }
        setUnreadNotificationsCount(transformUnreadNotificationsResponse(response))
      },
    )
  }, [])

  useEffect(() => {
    fetchUnreadNotificationsCount()
  }, [fetchUnreadNotificationsCount])

  return {
    unreadNotificationsCount,
    fetchUnreadNotificationsCount,
  }
}

export default useUnreadNotificationsCount
