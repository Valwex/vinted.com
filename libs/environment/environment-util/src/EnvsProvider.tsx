'use client'

import { createContext, ReactNode } from 'react'

import type { UniversalEnvs } from './variables'

type EnvsProviderProps = {
  children: ReactNode
  envs: UniversalEnvs
}

export const EnvsContext = createContext<UniversalEnvs | undefined>(undefined)

const EnvsProvider = ({ envs, children }: EnvsProviderProps) => {
  return <EnvsContext.Provider value={envs}>{children}</EnvsContext.Provider>
}

export default EnvsProvider
