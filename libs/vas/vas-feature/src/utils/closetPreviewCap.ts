import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@marketplace-web/browser/browser-storage-util'

import { getCurrentTimeInSeconds } from './date'

const SECONDS_PER_WEEK = 60 * 60 * 24 * 7

export enum ClosetPreviewLocation {
  Feed = 'feed',
}

export const getIsClosetPreviewSeen = (location: ClosetPreviewLocation) => {
  const seenAt = getLocalStorageItem(`closet_preview_in_${location}_at`)

  if (!seenAt) return false

  const seenAtInSeconds = Number(seenAt)
  const currentTimeInSeconds = getCurrentTimeInSeconds()

  return currentTimeInSeconds - seenAtInSeconds < SECONDS_PER_WEEK
}

export const setClosetPreviewAsSeen = (location: ClosetPreviewLocation) => {
  const currentTimeInSeconds = getCurrentTimeInSeconds()

  setLocalStorageItem(`closet_preview_in_${location}_at`, currentTimeInSeconds.toString())
}
