'use client'

import { createContext } from 'react'

import { Breakpoints } from '../../types'

const BreakpointContext = createContext<{ breakpoints: Breakpoints }>({
  breakpoints: { active: [] },
})
const { Provider, Consumer } = BreakpointContext

export { Provider, Consumer }

export default BreakpointContext
