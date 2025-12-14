'use client'

import { createContext } from 'react'

import { DataDomeContextValue } from '../types'

export const DataDomeContext = createContext<DataDomeContextValue | null>(null)
