export const isValueInObject = <T extends string | number>(
  value: unknown,
  object: Record<string, T>,
): value is T => Object.values(object).includes(value as T)
