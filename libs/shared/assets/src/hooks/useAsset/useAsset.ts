'use client'

import { useCallback } from 'react'

import { useIsDarkMode } from '@marketplace-web/dark-mode/dark-mode-feature'

import useAssetHost from '../useAssetHost'

const DEFAULT_PATH_PREFIX = 'assets'

type AssetOption = {
  theme?: {
    dark: string
  }
}

const trimSlashes = (value: string) => value.replace(/(^\/|\/$)/g, '')
const buildPath = (...parts: Array<string>) => parts.map(trimSlashes).join('/')

function useAsset(pathPrefix = DEFAULT_PATH_PREFIX) {
  const assetHostUrl = useAssetHost()
  const isDarkMode = useIsDarkMode()

  return useCallback(
    (file: string, options: AssetOption = {}) => {
      const path = `${buildPath(assetHostUrl, pathPrefix)}/`

      if (isDarkMode && options.theme?.dark) {
        return path + trimSlashes(options.theme.dark)
      }

      return path + trimSlashes(file)
    },
    [assetHostUrl, isDarkMode, pathPrefix],
  )
}

export default useAsset
