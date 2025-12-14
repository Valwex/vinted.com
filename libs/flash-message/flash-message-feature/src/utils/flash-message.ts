import {
  setSessionStorageItem,
  getSessionStorageItem,
  removeSessionStorageItem,
} from '@marketplace-web/browser/browser-storage-util'

const FLASH_MESSAGE_SESSION_STORAGE_KEY = 'flashMessage'

export enum FlashMessageType {
  Success = 'success',
  Warning = 'warning',
}

type FlashMessage = {
  type: FlashMessageType
  message: string
  action?: {
    text: string
    url: string
  }
}

const isFlashMessage = (object: any): object is FlashMessage => {
  return 'type' in object && 'message' in object
}

export const setFlashMessage = (flashMessage: FlashMessage) =>
  setSessionStorageItem(FLASH_MESSAGE_SESSION_STORAGE_KEY, JSON.stringify(flashMessage))

export const popFlashMessage = () => {
  const sessionStorageFlashMessage = getSessionStorageItem(FLASH_MESSAGE_SESSION_STORAGE_KEY)

  if (!sessionStorageFlashMessage) return null

  removeSessionStorageItem(FLASH_MESSAGE_SESSION_STORAGE_KEY)

  try {
    const parsedFlashMessage = JSON.parse(sessionStorageFlashMessage)

    if (isFlashMessage(parsedFlashMessage)) return parsedFlashMessage
  } catch (error) {
    return null
  }

  return null
}
