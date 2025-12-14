import { ReactNode } from 'react'
import { isFragment } from 'react-is'
import { compact, isArray, isEmpty } from 'lodash'

export const isEmptyFragment = (instance: ReactNode) => {
  if (!isFragment(instance)) return false
  if (!instance.props) return true
  if (typeof instance.props !== 'object') return true
  if (!('children' in instance.props)) return true

  const children = instance.props?.children

  if (isArray(children)) return isEmpty(compact(children))

  return !children
}
