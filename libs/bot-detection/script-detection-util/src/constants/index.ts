export const SCRIPT_TRACKING_HEADERS = {
  'X-Browser-Compat': 'X-Browser-Compat',
} as const

export const NEXT_SCRIPT_TRACKING_HEADERS = Object.fromEntries(
  Object.entries(SCRIPT_TRACKING_HEADERS).map(([key, value]) => [key, value.toLowerCase()]),
) as {
  [K in keyof typeof SCRIPT_TRACKING_HEADERS]: Lowercase<(typeof SCRIPT_TRACKING_HEADERS)[K]>
}

export const EMAIL_REGISTER_HEADERS = {
  [SCRIPT_TRACKING_HEADERS['X-Browser-Compat']]: '1',
}

export const FACEBOOK_REGISTER_HEADERS = {
  [SCRIPT_TRACKING_HEADERS['X-Browser-Compat']]: '2',
}

export const GOOGLE_REGISTER_HEADERS = {
  [SCRIPT_TRACKING_HEADERS['X-Browser-Compat']]: '3',
}

export const APPLE_REGISTER_HEADERS = {
  [SCRIPT_TRACKING_HEADERS['X-Browser-Compat']]: '4',
}
