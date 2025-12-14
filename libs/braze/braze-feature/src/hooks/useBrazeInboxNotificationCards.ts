'use client'

import { partition } from 'lodash'
import { useContext, useMemo, useSyncExternalStore } from 'react'

import BrazeContext from '../containers/BrazeProvider/BrazeContext'

function useBrazeInboxNotificationCards() {
  const { inboxNotificationCardStore } = useContext(BrazeContext)

  const allNotificationCards = useSyncExternalStore(
    inboxNotificationCardStore.subscribe,
    () => inboxNotificationCardStore.state,
    () => null,
  )

  const [brazeControlNotificationCards, brazeNotificationCards] = useMemo(
    () =>
      allNotificationCards
        ? partition(allNotificationCards, card => card.extras.variant === 'control')
        : [undefined, undefined],
    [allNotificationCards],
  )

  return {
    brazeNotificationCards,
    brazeControlNotificationCards,
  }
}

export default useBrazeInboxNotificationCards
