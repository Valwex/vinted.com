// Workaround hook to avoid race condition issue where InputDropdown sets an old value
import { useCallback, useEffect, useState } from 'react'

const useRunAfterRerender = () => {
  type Callback = () => unknown
  const [stack, setStack] = useState<Array<Callback>>([])

  useEffect(() => {
    if (!stack.length) return

    setStack([])
    stack.forEach(callback => callback())
  }, [stack])

  return useCallback((callback: Callback) => {
    setStack(prevStack => [...prevStack, callback])
  }, [])
}

export default useRunAfterRerender
