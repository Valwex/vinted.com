'use client'

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from 'react'
import { noop } from 'lodash'

export type ProactiveModerationContextType = {
  isProactiveModerationEnabled: boolean
  toggleProactiveModeration: () => void
  selectedItemIds: Array<number> | null
  setSelectedItemIds: Dispatch<SetStateAction<Array<number> | null>>
}

export const ProactiveModerationContext = createContext<ProactiveModerationContextType>({
  isProactiveModerationEnabled: false,
  toggleProactiveModeration: noop,
  selectedItemIds: null,
  setSelectedItemIds: noop,
})

export const ProactiveModerationContextProvider = ({ children }: { children: ReactNode }) => {
  const [isProactiveModerationEnabled, setIsProactiveModerationEnabled] = useState(false)
  const [selectedItemIds, setSelectedItemIds] = useState<Array<number> | null>(null)

  const toggleProactiveModeration = useCallback(() => {
    setIsProactiveModerationEnabled(prevState => !prevState)
    setSelectedItemIds(null)
  }, [])

  const providerValue = useMemo(
    () => ({
      isProactiveModerationEnabled,
      toggleProactiveModeration,
      selectedItemIds,
      setSelectedItemIds,
    }),
    [isProactiveModerationEnabled, toggleProactiveModeration, selectedItemIds, setSelectedItemIds],
  )

  return (
    <ProactiveModerationContext.Provider value={providerValue}>
      {children}
    </ProactiveModerationContext.Provider>
  )
}

export const useProactiveModerationContext = () => {
  const context = useContext(ProactiveModerationContext)

  if (!context) {
    throw new Error(
      'useProactiveModerationContext must be used within a ProactiveModerationContextProvider',
    )
  }

  return context
}
