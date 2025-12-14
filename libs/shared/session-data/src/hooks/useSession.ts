'use client'

import { useContext } from 'react'

import { SessionStateContext, SessionDispatchContext } from '../contexts/SessionProvider'

const useSession = () => {
  const sessionState = useContext(SessionStateContext)
  const sessionDispatch = useContext(SessionDispatchContext)

  if (!sessionState || !sessionDispatch) {
    throw new Error('useSession must be used within a SessionProvider')
  }

  return {
    ...sessionState,
    setHasConfirmedPaymentsAccount: (hasConfirmed: boolean) =>
      sessionDispatch({ type: 'SET_HAS_CONFIRMED_PAYMENTS_ACCOUNT', payload: hasConfirmed }),
  }
}

export default useSession
