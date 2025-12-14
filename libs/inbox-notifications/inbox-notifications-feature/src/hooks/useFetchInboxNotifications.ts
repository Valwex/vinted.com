'use client'

import { useCallback, useMemo, useRef, useState } from 'react'

import {
  GenericInboxNotificationModel,
  getInboxNotifications,
  sortNotifications,
  sortPaginatedNotifications,
  transformUserNotificationDto,
} from '@marketplace-web/inbox-notifications/inbox-notifications-data'
import { useBrazeInboxNotificationCards } from '@marketplace-web/braze/braze-feature'
import { transformBrazeInboxCardNotificationDto } from '@marketplace-web/braze/braze-data'
import { UiState } from '@marketplace-web/shared/ui-state-util'
import { clientSideMetrics } from '@marketplace-web/observability/client-metrics-util'

type Args = {
  perPage?: number
  isPaginated?: boolean
}

const NOTIFICATIONS_PER_PAGE_DROPDOWN = 5

// TODO: currently, we resolve success state after backend notifications are fetched
// meaning Braze notifications could come later on and cause flickering
const useFetchInboxNotifications = ({
  perPage = NOTIFICATIONS_PER_PAGE_DROPDOWN,
  isPaginated,
}: Args = {}) => {
  const [uiState, setUiState] = useState(UiState.Idle)
  const [isFirstPageFetched, setIsFirstPageFetched] = useState(false)
  const [userNotifications, setUserNotifications] = useState<Array<GenericInboxNotificationModel>>(
    [],
  )
  const [isEndReached, setIsEndReached] = useState(false)

  const currentPage = useRef(0)

  const { brazeNotificationCards, brazeControlNotificationCards } = useBrazeInboxNotificationCards()

  const brazeNotifications = useMemo(
    () =>
      brazeNotificationCards
        ? brazeNotificationCards.map(card => transformBrazeInboxCardNotificationDto(card))
        : [],
    [brazeNotificationCards],
  )

  const brazeNotificationCount = brazeNotifications.filter(
    notification => !notification.isViewed,
  ).length

  const unsortedNotifications = [...userNotifications, ...brazeNotifications]
  const sortedNotifications = isPaginated
    ? sortPaginatedNotifications(unsortedNotifications, isEndReached)
    : sortNotifications(unsortedNotifications)

  const handleFetchFailure = (response: any) => {
    setUiState(UiState.Failure)
    setIsEndReached(true)

    const label = response?.status?.toString() || 'empty_response'
    clientSideMetrics.counter('notifications_fetch_failure', { label }).increment()
  }

  const fetchInboxNotifications = useCallback(async () => {
    setUiState(UiState.Pending)
    currentPage.current += 1

    const response = await getInboxNotifications({ perPage, page: currentPage.current })

    if (!response || 'errors' in response) {
      handleFetchFailure(response)

      return
    }

    if (!response.notifications.length) {
      setUiState(UiState.Success)
      setIsEndReached(true)
      setIsFirstPageFetched(true)

      return
    }
    const newNotifications = response.notifications.map(transformUserNotificationDto)

    setUserNotifications(prevNotifications => [...prevNotifications, ...newNotifications])
    setIsFirstPageFetched(true)
    setUiState(UiState.Success)
    setIsEndReached(response.pagination.total_pages <= currentPage.current)
  }, [perPage])

  return {
    notifications: isFirstPageFetched ? sortedNotifications : [],
    setNotifications: setUserNotifications,
    fetchInboxNotifications,
    controlNotificationCards: brazeControlNotificationCards,
    brazeNotificationCount,
    uiState,
    isEndReached,
  }
}

export default useFetchInboxNotifications
