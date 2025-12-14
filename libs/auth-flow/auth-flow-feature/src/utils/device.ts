const DEVICE_OS_ANDROID = 'Android'
const DEVICE_OS_IOS = 'iOS'
const DEVICE_OS_WINDOWS_PHONE = 'Windows Phone'
export const DEVICE_OS_MAC = 'MacOS'

export function parseOS(userAgent: string) {
  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return DEVICE_OS_WINDOWS_PHONE
  }

  if (/android/i.test(userAgent)) {
    return DEVICE_OS_ANDROID
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return DEVICE_OS_IOS
  }

  if (/Macintosh/.test(userAgent)) {
    return DEVICE_OS_MAC
  }

  return null
}

export const isIOS = (userAgent: string) => parseOS(userAgent) === DEVICE_OS_IOS
