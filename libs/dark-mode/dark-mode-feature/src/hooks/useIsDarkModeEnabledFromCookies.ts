'use client'

import { cookiesDataByName, useCookie } from '@marketplace-web/environment/cookies-util'

import { ColorTheme } from '../constants'

const useIsDarkModeEnabledFromCookies = () => {
  const cookies = useCookie()

  return cookies.get(cookiesDataByName.color_theme) === ColorTheme.Dark
}

export default useIsDarkModeEnabledFromCookies
