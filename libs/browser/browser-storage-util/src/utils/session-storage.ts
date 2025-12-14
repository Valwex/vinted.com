const serverSide = typeof window === 'undefined'

export const getSessionStorageItem = (key: string) => {
  if (serverSide) return null

  return sessionStorage.getItem(key)
}

export const removeSessionStorageItem = (key: string) => {
  if (serverSide) return
  sessionStorage.removeItem(key)
}

export const setSessionStorageItem = (key: string, value: string) => {
  if (serverSide) return
  sessionStorage.setItem(key, value)
}
