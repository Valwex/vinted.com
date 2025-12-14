'use client'

import { createContext, ReactNode, useMemo } from 'react'
import { keyBy } from 'lodash'

import { AbTestDto } from '../types/ab-test'

type AbTestsProviderProps = {
  children: ReactNode
  initialAbTests: Array<AbTestDto>
}

type AbTests = Record<string, AbTestDto>

export const AbTestsContext = createContext<AbTests>({})

const AbTestsProvider = ({ initialAbTests, children }: AbTestsProviderProps) => {
  const abTestsObject = useMemo(
    () => keyBy(initialAbTests, abTest => abTest.name),
    [initialAbTests],
  )

  return <AbTestsContext.Provider value={abTestsObject}>{children}</AbTestsContext.Provider>
}

export default AbTestsProvider
