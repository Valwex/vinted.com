'use client'

import { useContext, useSyncExternalStore } from 'react'

import {
  transformBrazeFullScreenInAppMessageDto,
  transformBrazeModalInAppMessageDto,
  transformBrazeSlideUpInAppMessageDto,
} from '@marketplace-web/braze/braze-data'

import BrazeContext from '../containers/BrazeProvider/BrazeContext'
import { Store } from '../consumers/generic-store'

// TODO: move me to a more suitable location
function useStore<T>(store: Store<T | null>): T
function useStore<T, U>(store: Store<T | null>, transform: (entity: T) => U): U
function useStore<T, U>(store: Store<T | null>, transform?: (entity: T) => U) {
  const entity = useSyncExternalStore(
    store.subscribe,
    () => store.state,
    () => null,
  )

  if (transform && entity) return transform(entity)

  return entity
}

function useBrazeInAppMessage() {
  const context = useContext(BrazeContext)

  const modalInAppMessage = useStore(
    context.modalInAppMessageStore,
    transformBrazeModalInAppMessageDto,
  )

  const fullScreenInAppMessage = useStore(
    context.fullScreenInAppMessageStore,
    transformBrazeFullScreenInAppMessageDto,
  )

  const slideUpInAppMessage = useStore(
    context.slideUpInAppMessageStore,
    transformBrazeSlideUpInAppMessageDto,
  )

  return {
    modalInAppMessage: modalInAppMessage ?? fullScreenInAppMessage,
    notificationInAppMessage: slideUpInAppMessage,
  }
}

export default useBrazeInAppMessage
