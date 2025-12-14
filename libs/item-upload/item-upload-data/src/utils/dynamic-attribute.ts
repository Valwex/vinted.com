import { NormalizedAttributes } from '../types/dynamic-attribute'

export const reduceAttributes = <T, K extends keyof T | undefined = undefined>(
  attributes: Array<T & { code: string }> | undefined,
  key?: K,
) => {
  const initialValue: NormalizedAttributes<T, K> = {
    byName: {} as NormalizedAttributes<T, K>['byName'],
    names: [],
  }

  if (!attributes?.length) return initialValue

  return attributes.reduce<NormalizedAttributes<T, K>>(
    (acc, attr) => ({
      byName: {
        ...acc.byName,
        [attr.code]: key ? attr[key] : attr,
      },
      names: [...acc.names, attr.code],
    }),
    initialValue,
  )
}
