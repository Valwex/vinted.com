const MS_PER_SECOND = 1000

type PromiseCache<T> = {
  stalePromise: Promise<T>
  promise: Promise<T>
  until: number
}

type MemoizeCallbackOptions<T> = {
  cacheDuration?: number
  staleResponseWhileRevalidate?: boolean
  clearOnException?: boolean
  cache?: Map<string, PromiseCache<T>>
}

export function withMemoizedCallback<T>(
  key: string,
  callback: () => Promise<T>,
  {
    cacheDuration = 0,
    staleResponseWhileRevalidate,
    clearOnException,
    cache = new Map(),
  }: MemoizeCallbackOptions<T> = {},
) {
  function isCacheExpired() {
    const until = cache.get(key)?.until || 0

    return Date.now() >= until
  }

  function getCachedPromise() {
    if (isCacheExpired()) return undefined

    return cache.get(key)
  }

  function handleResolvedPromise() {
    const cachedItem = cache.get(key)

    if (!cachedItem) return

    cachedItem.until = Date.now() + cacheDuration * MS_PER_SECOND
    cachedItem.stalePromise = cachedItem.promise
  }

  function cacheItem(promise: Promise<T>) {
    const cachedItem = cache.get(key)

    promise.then(handleResolvedPromise).catch(() => {
      if (clearOnException) {
        cache.delete(key)

        return
      }

      handleResolvedPromise()
    })

    const newCacheItem = { promise, stalePromise: cachedItem?.promise || promise, until: Infinity }
    cache.set(key, newCacheItem)

    return newCacheItem
  }

  return () => {
    const cachedItem = getCachedPromise() || cacheItem(callback())

    if (staleResponseWhileRevalidate) return cachedItem.stalePromise

    return cachedItem.promise
  }
}

export function withMemoizedPromise<A extends ReadonlyArray<unknown>, T>(
  callback: (...args: A) => Promise<T>,
  options: MemoizeCallbackOptions<T> = {},
) {
  const cache = options.cache ?? new Map()

  const clearCache = () => {
    cache.clear()
  }

  const wrappedCallback = (...args: A) =>
    withMemoizedCallback(JSON.stringify(args), () => callback(...args), { ...options, cache })()

  return Object.assign(wrappedCallback, { clearCache })
}
