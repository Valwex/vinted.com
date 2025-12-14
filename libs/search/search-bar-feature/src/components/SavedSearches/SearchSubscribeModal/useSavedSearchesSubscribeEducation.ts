import { useState } from 'react'

import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@marketplace-web/browser/browser-storage-util'
import { useLatestCallback } from '@marketplace-web/shared/ui-state-util'

const SUBSCRIBED_VALUE = 'true'
const SAVED_SEARCHES_SUBSCRIBED_KEY = 'saved_searches_subscribed'

const saveFirstTimeSubscribe = () => {
  setLocalStorageItem(SAVED_SEARCHES_SUBSCRIBED_KEY, SUBSCRIBED_VALUE)
}

const isSavedSearchUser = (): boolean =>
  getLocalStorageItem(SAVED_SEARCHES_SUBSCRIBED_KEY) === SUBSCRIBED_VALUE

const useSavedSearchesSubscribeEducation = () => {
  const [isSubscribedModalOpen, setIsSubscribedModalOpen] = useState(false)

  const showSearchSubscriptionEducation = useLatestCallback(() => {
    if (isSavedSearchUser()) return
    saveFirstTimeSubscribe()

    setIsSubscribedModalOpen(true)
  })

  const closeSearchSubscriptionEducation = useLatestCallback(() => setIsSubscribedModalOpen(false))

  return {
    isSubscribedModalOpen,
    showSearchSubscriptionEducation,
    closeSearchSubscriptionEducation,
  }
}

export default useSavedSearchesSubscribeEducation
