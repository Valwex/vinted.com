'use client'

import { useContext } from 'react'

import { AbTestsContext } from '../components/context'

const useAbTest = (name: string) => useContext(AbTestsContext)[name]

export default useAbTest
