const DEVICE_OS_ANDROID = 'Android'
const DEVICE_OS_IOS = 'iOS'
const DEVICE_OS_WINDOWS_PHONE = 'Windows Phone'
export const DEVICE_OS_MAC = 'MacOS'

export const DEVICE_IPHONE = 'iphone'
export const DEVICE_ANDROID = 'android'

const phonesOsDevice = {
  [DEVICE_OS_ANDROID]: DEVICE_ANDROID,
  [DEVICE_OS_IOS]: DEVICE_IPHONE,
} as const

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

export function parseDevice(
  userAgent: string,
): (typeof phonesOsDevice)[keyof typeof phonesOsDevice] | undefined {
  const os = parseOS(userAgent)

  if (!os) return undefined

  return phonesOsDevice[os]
}

export const isIOS = (userAgent: string) => parseOS(userAgent) === DEVICE_OS_IOS
export const isAndroid = (userAgent: string) => parseOS(userAgent) === DEVICE_OS_ANDROID
