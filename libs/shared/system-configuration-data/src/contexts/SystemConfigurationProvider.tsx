'use client'

import { createContext, ReactNode } from 'react'

import { SystemConfigurationModel } from '../types/system-configuration'

type Props = {
  children: ReactNode
  configuration: SystemConfigurationModel
}

export const SystemConfigurationContext = createContext<SystemConfigurationModel | undefined>(
  undefined,
)

const SystemConfigurationProvider = ({ configuration, children }: Props) => {
  return (
    <SystemConfigurationContext.Provider value={configuration}>
      {children}
    </SystemConfigurationContext.Provider>
  )
}

export default SystemConfigurationProvider
