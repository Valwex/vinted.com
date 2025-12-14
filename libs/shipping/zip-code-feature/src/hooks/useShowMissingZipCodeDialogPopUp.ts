import { useEffect, useState } from 'react'

import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@marketplace-web/browser/browser-storage-util'

const STORAGE_KEY = 'missing_zip_code_dialog_pop_up_shown'

const useForceShowMissingZipCodeDialog = (popUpShowInterval: number | undefined) => {
  const [forceShowDialog, setForceShowDialog] = useState(false)

  useEffect(() => {
    const handleForceShowDialog = () => {
      if (!popUpShowInterval) return

      const lastShownTime = getLocalStorageItem(STORAGE_KEY)

      if (!lastShownTime) {
        setForceShowDialog(true)

        return
      }

      const lastShownTimeDate = new Date(lastShownTime)
      const currentTime = new Date()
      const diffTimeInSeconds = (currentTime.getTime() - lastShownTimeDate.getTime()) / 1000

      if (diffTimeInSeconds >= popUpShowInterval) {
        setForceShowDialog(true)
      }
    }

    handleForceShowDialog()
  }, [popUpShowInterval])

  const handleForceShowDialogClose = () => {
    setLocalStorageItem(STORAGE_KEY, new Date().toISOString())
    setForceShowDialog(false)
  }

  return { forceShowDialog, handleForceShowDialogClose }
}

export default useForceShowMissingZipCodeDialog
