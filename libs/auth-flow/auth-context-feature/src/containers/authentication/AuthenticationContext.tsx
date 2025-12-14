'use client'

import { createContext } from 'react'

import { AuthenticationContextValue } from './types'

const AuthenticationContext = createContext<AuthenticationContextValue | null>(null)

export default AuthenticationContext
