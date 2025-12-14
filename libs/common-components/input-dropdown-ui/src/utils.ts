export const formatValue = (value: string | null | undefined) => {
  return value || ''
}

export const testIdAttribute = (testId: string | undefined, type: string, fallback = false) => {
  if (!testId) {
    if (fallback) return type

    return undefined
  }

  return `${testId}-${type}`
}
