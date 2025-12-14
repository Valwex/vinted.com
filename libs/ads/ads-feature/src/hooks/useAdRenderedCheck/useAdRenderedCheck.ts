import { noop } from 'lodash'
import { useCallback, useEffect } from 'react'

import { useDebounce } from '@marketplace-web/shared/ui-helpers'

import { SMALLEST_AD_HEIGHT } from '../../constants'

type Props = {
  targetElement?: HTMLDivElement | null
  onAdRender?: (isAdVisible: boolean) => void
}

function useAdRenderedCheck({ targetElement, onAdRender = noop }: Props) {
  const debouncedOnAdRender = useDebounce(onAdRender)

  const handleMutationObserver = useCallback(() => {
    const adElementHeight = targetElement?.clientHeight || 0

    debouncedOnAdRender(adElementHeight >= SMALLEST_AD_HEIGHT)
  }, [debouncedOnAdRender, targetElement])

  useEffect(() => {
    if (!targetElement) return noop

    const observer = new MutationObserver(handleMutationObserver)

    observer.observe(targetElement, { attributes: true, childList: true, subtree: true })

    return () => observer.disconnect()
  }, [handleMutationObserver, targetElement])
}

export default useAdRenderedCheck
