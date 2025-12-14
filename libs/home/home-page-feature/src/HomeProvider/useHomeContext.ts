'use client'

import { useContext } from 'react'

import HomeContext from './HomeContext'

const useHomeContext = () => {
  const context = useContext(HomeContext)

  if (!context) {
    throw new Error('useHomeContext must be used within a HomeProvider')
  }

  return context
}

export default useHomeContext
