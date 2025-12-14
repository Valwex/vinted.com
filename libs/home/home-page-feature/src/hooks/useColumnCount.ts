import {
  getFirstListedBreakpoint,
  useBreakpoint,
} from '@marketplace-web/breakpoints/breakpoints-feature'

import { BREAKPOINT_TO_COLUMN_COUNT } from '../constants'

const useColumnCount = () => {
  const activeBreakpoint = getFirstListedBreakpoint(useBreakpoint().active)
  const columnCount = BREAKPOINT_TO_COLUMN_COUNT[activeBreakpoint ?? 'desktops']

  return columnCount
}

export default useColumnCount
