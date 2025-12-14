import { useEffect, useState } from 'react'

import { STICKY_AD_SPACING } from '../../constants'

export type StickyOptions = {
  offset: number
}

export type Props = {
  isSticky?: boolean
}

function useStickyOptions({ isSticky }: Props) {
  const [stickyOptions, setStickyOptions] = useState<StickyOptions>()

  useEffect(() => {
    if (!document || !isSticky) {
      setStickyOptions(undefined)

      return
    }

    const headerHeight = document.querySelector<HTMLDivElement>('.js-header')?.offsetHeight || 0

    setStickyOptions({ offset: headerHeight + STICKY_AD_SPACING })
  }, [isSticky])

  return stickyOptions
}

export default useStickyOptions
