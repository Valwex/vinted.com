import { isArray, isEmpty, isNil, pickBy } from 'lodash'

export const filterEmptyValues = <T extends object>(object: T): Partial<T> =>
  pickBy(object, val => !(isArray(val) && isEmpty(val)) && !isNil(val))
