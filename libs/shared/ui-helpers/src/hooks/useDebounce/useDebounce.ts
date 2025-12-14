'use client'

import { useEffect, useMemo, useRef } from 'react'
import { debounce } from 'lodash'

const useDebounce = <A extends ReadonlyArray<unknown>>(
  callback: (...args: A) => void,
  delay = 300,
  leading = true,
) => {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const debouncedCallback = useMemo(
    () =>
      debounce((...args: A) => callbackRef.current(...args), delay, {
        leading,
      }),
    [delay, leading],
  )

  useEffect(() => {
    return () => {
      debouncedCallback.cancel()
    }
  }, [debouncedCallback])

  return debouncedCallback
}

export default useDebounce
