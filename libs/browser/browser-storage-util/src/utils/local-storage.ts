const serverSide = typeof window === 'undefined'

export const getLocalStorageItem = (key: string) => {
  if (serverSide) return null

  return localStorage.getItem(key)
}

export const removeLocalStorageItem = (key: string) => {
  if (serverSide) return
  localStorage.removeItem(key)
}

export const setLocalStorageItem = (key: string, value: string) => {
  if (serverSide) return
  localStorage.setItem(key, value)
}
