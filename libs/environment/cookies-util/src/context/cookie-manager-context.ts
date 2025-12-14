'use client'

import { createContext } from 'react'

import { CookieHandler } from '../types/cookie'

export const CookieManagerContext = createContext<CookieHandler | null>(null)
