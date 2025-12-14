import { ConsentGroup } from '../constants'

const serverSide = typeof window === 'undefined'

export function checkConsentGroup(group: ConsentGroup, optanonCookie?: string) {
  if (!optanonCookie) return false

  const optanonConsentParams = new URLSearchParams(optanonCookie)
  const optanonConsentGroups = optanonConsentParams.get('groups')?.split(',') || []

  return optanonConsentGroups.includes(group)
}

export const toggleOneTrustInfoDisplay = () => {
  if (serverSide) return
  window.OneTrust?.ToggleInfoDisplay()
}

const falselyStrings = ['0', 'f', 'F', 'false', 'FALSE', 'off', 'OFF']

export const isStringTruthy = (value: unknown) =>
  typeof value === 'string' && !falselyStrings.includes(value)
