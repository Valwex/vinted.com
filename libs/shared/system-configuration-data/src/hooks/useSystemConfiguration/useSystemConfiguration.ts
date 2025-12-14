'use client'

import { useContext } from 'react'

import { SystemConfigurationContext } from '../../contexts/SystemConfigurationProvider'

const useSystemConfiguration = () => {
  const systemConfigurationFromContext = useContext(SystemConfigurationContext)

  if (!systemConfigurationFromContext) {
    throw new Error('useSystemConfiguration must be used within a SystemConfigurationProvider')
  }

  return systemConfigurationFromContext
}

export default useSystemConfiguration
