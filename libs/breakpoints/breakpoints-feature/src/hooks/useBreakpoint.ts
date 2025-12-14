import { useContext } from 'react'

import BreakpointContext from '../components/Breakpoint/BreakpointContext'

function useBreakpoint() {
  const { breakpoints } = useContext(BreakpointContext)

  return breakpoints
}

export default useBreakpoint
