import { useMemo } from 'react'

import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@marketplace-web/browser/browser-storage-util'

export default function useIncrementalStorageCount(name: string) {
  return useMemo(() => {
    const storedCount = getLocalStorageItem(name)

    if (!storedCount) {
      setLocalStorageItem(name, '1')

      return 1
    }

    const updatedCount = Number(storedCount) + 1

    setLocalStorageItem(name, `${updatedCount}`)

    return updatedCount
  }, [name])
}
