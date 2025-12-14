import { createPhoto } from '@marketplace-web/item-upload/media-upload-data'
import { isResponseError } from '@marketplace-web/core-api/api-client-util'
import {
  getSessionStorageItem,
  setSessionStorageItem,
} from '@marketplace-web/browser/browser-storage-util'

const KEY = 'search_by_image_url_map'

const getUuidMap = (): Record<string, string | undefined> => {
  const currentStr = getSessionStorageItem(KEY)

  let current = {}
  if (currentStr) {
    try {
      current = JSON.parse(currentStr)
    } catch {
      /* empty */
    }
  }

  return current
}

export const uploadImage = async (file: File): Promise<string | undefined> => {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return undefined
  }

  const formData = new FormData()
  formData.append('photo[type]', 'item')
  formData.append('photo[file]', file)

  const response = await createPhoto(formData)
  if (isResponseError(response)) {
    return undefined
  }
  if (!response.temp_uuid) {
    return undefined
  }

  const current = getUuidMap()
  current[response.temp_uuid] = response.url

  setSessionStorageItem(KEY, JSON.stringify(current))

  return response.temp_uuid
}

export const uuidToUrl = (uuid: string): string | undefined => {
  return getUuidMap()[uuid]
}
