import {
  getLocalStorageItem,
  getSessionStorageItem,
  setLocalStorageItem,
  setSessionStorageItem,
} from '@marketplace-web/browser/browser-storage-util'

import { AbTestDto } from '../types/ab-test'
import { Exposee, ShouldTrackExposeCallback } from '../types/exposee'

export const shouldTrackOnce: ShouldTrackExposeCallback = (
  { name }: AbTestDto,
  { anonId }: Exposee,
) => {
  const key = `${name}_test_exposed`

  if (getLocalStorageItem(`use-track-ab-test-expose-event-${name}`) === anonId) return false
  if (getLocalStorageItem(key) === anonId) return false

  setLocalStorageItem(key, anonId)

  return true
}

export const shouldTrackOncePerSessionDay = ({ name }: AbTestDto) => {
  const key = `${name}_test_exposed_day`
  const dateToday = new Date().toLocaleDateString()
  const lastExposureDate = getSessionStorageItem(key)

  if (lastExposureDate === dateToday) return false

  setSessionStorageItem(key, dateToday)

  return true
}
