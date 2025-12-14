'use client'

import { createContext } from 'react'

import { FocusContainerContextValue } from './types'

export const FocusContainerContext = createContext<FocusContainerContextValue | null>(null)
