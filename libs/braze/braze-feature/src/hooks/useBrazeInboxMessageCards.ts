'use client'

import { partition } from 'lodash'
import { useContext, useMemo, useSyncExternalStore } from 'react'

import BrazeContext from '../containers/BrazeProvider/BrazeContext'

function useBrazeInboxMessageCards() {
  const { inboxMessageCardStore } = useContext(BrazeContext)

  const allInboxMessageCards = useSyncExternalStore(
    inboxMessageCardStore.subscribe,
    () => inboxMessageCardStore.state,
    () => null,
  )

  const [inboxControlMessageCards, inboxMessageCards] = useMemo(
    () =>
      allInboxMessageCards
        ? partition(allInboxMessageCards, card => card.extras.variant === 'control')
        : [undefined, undefined],
    [allInboxMessageCards],
  )

  return { inboxMessageCards, inboxControlMessageCards }
}

export default useBrazeInboxMessageCards
