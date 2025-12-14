function useAssetHost() {
  // TODO: investigate a better way of getting the asset prefix
  // will be replaced with `assetPrefix` from `next.config.ts` https://github.com/vercel/next.js/blob/c2da6c12e772e94bb1a94f1e810a95598c00d615/packages/next/src/build/define-env.ts#L251C6-L251C37
  // eslint-disable-next-line no-underscore-dangle
  const assetHost = process.env.__NEXT_ASSET_PREFIX ?? '/'

  if (process.env.NODE_ENV === 'production') return assetHost

  return '/'
}

export default useAssetHost
