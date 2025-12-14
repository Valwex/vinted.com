'use client'

import { useMemo } from 'react'

import useAsset from '../useAsset'

type UseImageSrcSetOptions = {
  baseName: string
  darkMode?: boolean
  assetBasePath: string
}

function useImageSrcSet({ baseName, darkMode = false, assetBasePath }: UseImageSrcSetOptions) {
  const asset = useAsset(assetBasePath)

  return useMemo(() => {
    const suffix = darkMode ? '-dark' : ''
    const buildFile = (resolution: '1x' | '2x' | '3x') =>
      asset(`${baseName}${suffix}_${resolution}.png`)

    return {
      src: buildFile('1x'),
      srcSet: `${buildFile('1x')} 1x, ${buildFile('2x')} 2x, ${buildFile('3x')} 3x`,
    }
  }, [asset, baseName, darkMode])
}

export default useImageSrcSet
