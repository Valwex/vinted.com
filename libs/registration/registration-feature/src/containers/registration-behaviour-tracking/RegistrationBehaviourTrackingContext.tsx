'use client'

import { createContext } from 'react'

import { RegistrationBehaviourTrackingContextValue } from './types'

const RegistrationBehaviourTrackingContext =
  createContext<RegistrationBehaviourTrackingContextValue | null>(null)

export default RegistrationBehaviourTrackingContext
