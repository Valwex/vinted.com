function pickBy<T extends object, K extends keyof T>(
  object: T,
  predicate: (value: T[K], key: K) => boolean,
): Partial<T> {
  const picked: Partial<T> = { ...object }

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(object) as Array<[K, T[K]]>) {
    if (!predicate(value, key)) {
      delete picked[key]
    }
  }

  return picked
}

export const filterEmptyValuesEdgeSafe = <T extends object>(object: T): Partial<T> =>
  pickBy(
    object,
    val =>
      !(
        (Array.isArray(val) && (val as Array<unknown>).length === 0) ||
        val === null ||
        typeof val === 'undefined'
      ),
  )

export const isValueInObject = <T extends string | number>(
  value: unknown,
  object: Record<string, T>,
): value is T => Object.values(object).includes(value as T)
