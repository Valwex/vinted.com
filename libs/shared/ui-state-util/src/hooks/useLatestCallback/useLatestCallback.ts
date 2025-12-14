'use client'

import { useCallback, useRef } from 'react'

export type CallbackFn = (...params: Array<any>) => any
/** Uses a ref to always call the latest function without stale closure variables, just pass a function to this */
export default function useLatestCallback<T extends CallbackFn | undefined>(fn: T): T {
  const fnRef = useRef(fn)
  fnRef.current = fn
  // memoize, so it does not re-render when passed into useEffect []
  const latest = useCallback(
    (...params: Parameters<NonNullable<T>>) => fnRef?.current?.(...params),
    [],
  )

  return (fnRef.current ? latest : fnRef.current) as T
}
