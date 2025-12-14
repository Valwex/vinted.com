'use client'

import { useContext } from 'react'

import { RegistrationBehaviourTrackingContext } from '../../containers/registration-behaviour-tracking'

const useRegistrationBehaviourTracking = () => {
  const context = useContext(RegistrationBehaviourTrackingContext)

  if (!context) {
    throw new Error(
      'useRegistrationBehaviourTracking must be used within a RegistrationBehaviourTrackingProvider',
    )
  }

  return context
}

export default useRegistrationBehaviourTracking
