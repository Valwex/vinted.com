'use client'

import { ReactNode, useEffect, useState, useMemo } from 'react'

import ThemeContext from './ThemeContext'
import type { ColorModeType } from './ThemeContext'

export type ThemeProviderProps = {
  children: ReactNode
  mode: ColorModeType
}

const ThemeProvider = ({ mode: defaultMode, children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<ColorModeType>(defaultMode)

  useEffect(() => {
    setMode(defaultMode)
  }, [defaultMode])

  const value = useMemo(() => ({ mode, updateMode: setMode }), [mode])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
