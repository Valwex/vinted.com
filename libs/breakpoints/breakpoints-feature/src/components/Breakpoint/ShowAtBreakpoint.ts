'use client'

import { ReactNode } from 'react'

import useBreakpoint from '../../hooks/useBreakpoint'
import { Breakpoints } from '../../types'

type Props = {
  children: ReactNode
  breakpoint: keyof Breakpoints
}

const ShowAtBreakpoint = ({ breakpoint, children }: Props) => {
  const breakpoints = useBreakpoint()

  const matchedBreakpoint = breakpoints[breakpoint]

  return matchedBreakpoint ? children : null
}

export default ShowAtBreakpoint
