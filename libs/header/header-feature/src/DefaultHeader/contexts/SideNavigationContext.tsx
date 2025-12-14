'use client'

import { noop } from 'lodash'
import { PropsWithChildren, useContext, createContext, useState, useMemo } from 'react'

const SideNavigationContext = createContext({ isOpen: false, toggle: noop })

export const SideNavigationContextProvider = (props: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false)

  const value = useMemo(
    () => ({ isOpen, toggle: () => setIsOpen(current => !current) }),
    [isOpen, setIsOpen],
  )

  return <SideNavigationContext.Provider value={value} {...props} />
}

export const useSideNavigationContext = () => {
  const context = useContext(SideNavigationContext)

  if (!context) {
    throw new Error('useSideNavigationContext must be used within a SideNavigationProvider')
  }

  return context
}

type SideNavigationGuardProps = {
  condition: 'open' | 'closed'
}

export const SideNavigationGuard = ({
  children,
  condition,
}: PropsWithChildren<SideNavigationGuardProps>) => {
  const { isOpen } = useSideNavigationContext()
  if (isOpen && condition === 'open') return children

  return null
}
