'use client'

import { useContext } from 'react'

import { ConsentContext } from '../contexts/ConsentProvider'

const useConsentContext = () => {
  const consentFromContext = useContext(ConsentContext)

  if (!consentFromContext) {
    throw new Error('useConsentContext must be used within a ConsentProvider')
  }

  return consentFromContext
}

export default useConsentContext
