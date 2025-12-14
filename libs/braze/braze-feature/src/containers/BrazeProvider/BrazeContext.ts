'use client'

import type { Card, InAppMessage } from '@braze/web-sdk'
import { Dispatch, createContext } from 'react'

import { BrazeCardLoggers } from '../../types/event-loggers'
import { NullableBrazeStores } from '../../types/store'
import { DEFAULT_STORES } from '../../utils/store'
import { UserExternalIdDispatchAction, UserExternalIdState } from '../../types/external-id-state'

export type BrazeContextType = {
  cards?: Array<Card> | undefined // TODO: Remove this after refactoring mocking cards in tests
  userExternalId: UserExternalIdState
  dispatch: Dispatch<UserExternalIdDispatchAction>
  inAppMessage?: InAppMessage | null // TODO: Remove this after refactoring mocking in-app message in tests
} & BrazeCardLoggers &
  NullableBrazeStores

const defaultBrazeLogFunction = () => Promise.resolve(false)

export const initialBrazeContextValue: BrazeContextType = {
  logCardImpression: defaultBrazeLogFunction,
  logCardClick: defaultBrazeLogFunction,
  logCardDismissal: defaultBrazeLogFunction,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {},
  userExternalId: { state: 'loading' },
  ...DEFAULT_STORES,
}

const BrazeContext = createContext<BrazeContextType>(initialBrazeContextValue)

export default BrazeContext
