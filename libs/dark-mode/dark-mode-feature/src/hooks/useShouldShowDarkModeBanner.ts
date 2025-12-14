import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { getLocalStorageItem } from '@marketplace-web/browser/browser-storage-util'

import { IS_DARK_MODE_BANNER_CLOSED_LOCAL_STORAGE_KEY } from '../constants'
import useIsDarkMode from './useIsDarkMode'

const useShouldShowDarkModeAdoption = () => {
  const isDarkModeAdoptionEnabled = useFeatureSwitch('web_dark_mode_adoption')
  const isDarkMode = useIsDarkMode()

  return (
    isDarkModeAdoptionEnabled &&
    !getLocalStorageItem(IS_DARK_MODE_BANNER_CLOSED_LOCAL_STORAGE_KEY) &&
    !isDarkMode
  )
}

export default useShouldShowDarkModeAdoption
