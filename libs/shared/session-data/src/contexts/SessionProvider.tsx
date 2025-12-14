'use client'

import { createContext, ReactNode, useReducer, Dispatch, useMemo } from 'react'
import produce from 'immer'

import { SessionAction, SessionData } from '../types'

type SessionProviderProps = {
  children: ReactNode
  initialSessionData: SessionData
}

const initialState: SessionData = {
  user: null,
  isWebview: false,
  debugPin: undefined,
  isContentOnlyView: false,
  trackingPlatform: undefined,
  anonId: undefined,
  screen: 'unknown',
}

const sessionReducer = produce((draft: SessionData, action: SessionAction) => {
  if (!draft.user) return

  switch (action.type) {
    case 'SET_HAS_CONFIRMED_PAYMENTS_ACCOUNT':
      draft.user.has_confirmed_payments_account = action.payload
      break
    default:
  }
}, initialState)

export const SessionStateContext = createContext<SessionData>(initialState)
export const SessionDispatchContext = createContext<Dispatch<SessionAction> | undefined>(undefined)

const SessionProvider = ({ initialSessionData, children }: SessionProviderProps) => {
  const initialReducerState: SessionData = {
    ...initialState,
    user: initialSessionData.user,
    isWebview: initialSessionData.isWebview,
    debugPin: initialSessionData.debugPin,
    isContentOnlyView: initialSessionData.isContentOnlyView,
    trackingPlatform: initialSessionData.trackingPlatform,
    screen: initialSessionData.screen,
    anonId: initialSessionData.anonId,
  }

  const [state, dispatch] = useReducer(sessionReducer, initialReducerState)

  const stateValues = useMemo(() => state, [state])
  const dispatchValues = useMemo(() => dispatch, [])

  return (
    <SessionDispatchContext.Provider value={dispatchValues}>
      <SessionStateContext.Provider value={stateValues}>{children}</SessionStateContext.Provider>
    </SessionDispatchContext.Provider>
  )
}

export default SessionProvider
