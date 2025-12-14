'use client'

import { createContext, ReactNode } from 'react'

type Props = {
  children: ReactNode
  cookieConsentVersion: string
}

export const ConsentContext = createContext<string | undefined>(undefined)

const ConsentProvider = ({ cookieConsentVersion, children }: Props) => {
  return <ConsentContext.Provider value={cookieConsentVersion}>{children}</ConsentContext.Provider>
}

export default ConsentProvider
