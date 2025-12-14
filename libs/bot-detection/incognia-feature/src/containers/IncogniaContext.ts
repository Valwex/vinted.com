'use client'

import { createContext } from 'react'

import { IncogniaContextValue } from '../types/context'

export const IncogniaContext = createContext<IncogniaContextValue | null>(null)
