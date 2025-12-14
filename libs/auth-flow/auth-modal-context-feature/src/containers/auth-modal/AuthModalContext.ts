'use client'

import { createContext } from 'react'

import { AuthModalContextValue } from './types'

export const AuthModalContext = createContext<AuthModalContextValue | null>(null)
