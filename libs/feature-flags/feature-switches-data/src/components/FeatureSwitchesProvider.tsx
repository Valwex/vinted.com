'use client'

import { createContext, ReactNode } from 'react'

import { FeatureSwitches } from '../types/feature-switches'

type FeatureSwitchesProviderProps = {
  children: ReactNode
  featureSwitches: FeatureSwitches
}

export const FeatureSwitchesContext = createContext<FeatureSwitches | null>(null)

const FeatureSwitchesProvider = ({ featureSwitches, children }: FeatureSwitchesProviderProps) => (
  <FeatureSwitchesContext.Provider value={featureSwitches}>
    {children}
  </FeatureSwitchesContext.Provider>
)

export default FeatureSwitchesProvider
