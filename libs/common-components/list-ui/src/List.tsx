'use client'

import { Children, ReactNode } from 'react'
import { compact } from 'lodash'

type Props = {
  children?: Array<ReactNode>
}

const renderChild = (child: ReactNode) => <li className="pile__element">{child}</li>

const List = ({ children }: Props) => {
  if (!children) return null

  return <ul className="pile">{Children.map(compact(children), renderChild)}</ul>
}

export default List
