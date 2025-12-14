'use client'

import { Fragment, ReactComponentElement, ReactNode } from 'react'
import { Spacer, Divider } from '@vinted/web-ui'
import { compact } from 'lodash'

import { isEmptyFragment } from './utils'

type Props = {
  children: Array<ReactNode>
  separator?: ReactComponentElement<typeof Divider | typeof Spacer>
}

const SeparatedList = ({ children, separator = <Spacer orientation="vertical" /> }: Props) => {
  const items = compact(children.flat()).filter(child => !isEmptyFragment(child))

  if (!items?.length) {
    return null
  }

  return items.map((item, index) => (
    <Fragment key={index}>
      {item}
      {items.length - 1 !== index && separator}
    </Fragment>
  ))
}

export default SeparatedList
