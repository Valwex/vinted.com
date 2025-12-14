'use client'

import { ReactNode, useCallback, useEffect, useReducer, useState } from 'react'

import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import { useSession } from '@marketplace-web/shared/session-data'

import { InitializeBrazeReturnType } from '../../unsafe-initialize'
import { requestContentCardsRefreshThrottled } from '../../utils/async-utils'
import { flushCustomEventsThrottled } from '../../utils/custom-event'
import { getCardLoggersById } from '../../utils/event-loggers'
import BrazeContext, { initialBrazeContextValue } from './BrazeContext'
import useInitializeBraze from './useInitializeBraze'
import useManageInAppMessage from './useManageInAppMessage'
import { UserExternalIdDispatchAction, UserExternalIdState } from '../../types/external-id-state'

const AUTO_TEST_USER_EMAIL_ROOT = 'autotestvinted'

type Props = {
  children: ReactNode
}

const reducer = (
  state: UserExternalIdState,
  action: UserExternalIdDispatchAction,
): UserExternalIdState => {
  switch (action.type) {
    case 'set_loading':
      return { state: 'loading' }
    case 'set_failure':
      return { state: 'failure' }
    case 'set_success':
      return { value: action.value, state: 'success' }
    default:
      return state
  }
}

const BrazeProvider = ({ children }: Props) => {
  const { user } = useSession()
  const [userExternalId, dispatch] = useReducer(reducer, { value: null, state: 'loading' })

  const [providers, setProviders] = useState<Awaited<InitializeBrazeReturnType>['providers']>()
  const [contextValue, setContextValue] = useState({
    ...initialBrazeContextValue,
    dispatch,
  })
  const [isInitialized, setIsInitialized] = useState(false)
  const { relativeUrl } = useBrowserNavigation()
  const isAutoTestUser =
    (user?.email?.includes(AUTO_TEST_USER_EMAIL_ROOT) && user?.email?.endsWith('@vinted.com')) ||
    false

  const initializeBraze = useInitializeBraze(userExternalId.value)
  useManageInAppMessage(providers?.inAppMessageProvider)

  useEffect(() => {
    initializeBraze().then(({ initialized, stores, providers: newProviders }) => {
      const cardStores = [
        stores.inboxMessageCardStore,
        stores.inboxNotificationCardStore,
        stores.promoBoxCardStore,
      ]
      const cardLoggers = getCardLoggersById(cardStores)

      if (newProviders) setProviders(newProviders)

      setIsInitialized(initialized)

      setContextValue({
        ...stores,
        ...cardLoggers,
        userExternalId,
        dispatch,
      })
    })
  }, [initializeBraze, userExternalId, dispatch, isAutoTestUser])

  const handleRelativeUrlChange = useCallback(() => {
    if (!userExternalId.value) return
    if (!isInitialized) return

    flushCustomEventsThrottled(userExternalId.value)
    requestContentCardsRefreshThrottled()
  }, [isInitialized, userExternalId])

  useEffect(() => {
    handleRelativeUrlChange()
  }, [relativeUrl, handleRelativeUrlChange])

  return <BrazeContext.Provider value={contextValue}>{children}</BrazeContext.Provider>
}

export default BrazeProvider
