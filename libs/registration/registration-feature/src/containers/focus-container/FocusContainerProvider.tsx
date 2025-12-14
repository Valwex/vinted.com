'use client'

import { FocusEvent, ReactNode, useMemo, useState } from 'react'

import { useAuthenticationContext } from '@marketplace-web/auth-flow/auth-context-feature'

import { FocusContainerContext } from './FocusContainerContext'

type Props = {
  children: ReactNode
}

export const FocusContainerProvider = ({ children }: Props) => {
  const [isFocused, setIsFocused] = useState(false)
  const { isAuthPage } = useAuthenticationContext()

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement, Element>) => {
    if (!document.hasFocus()) return
    if (event.currentTarget.contains(event.relatedTarget)) return

    setIsFocused(false)
  }

  const contextValue = useMemo(() => ({ isFocused }), [isFocused])

  if (!isAuthPage) return children

  return (
    <FocusContainerContext.Provider value={contextValue}>
      <div onFocus={handleFocus} onBlur={handleBlur}>
        {children}
      </div>
    </FocusContainerContext.Provider>
  )
}
