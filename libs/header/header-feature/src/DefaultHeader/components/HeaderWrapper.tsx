'use client'

import classNames from 'classnames'
import { PropsWithChildren } from 'react'

import { useSideNavigationContext } from '../contexts/SideNavigationContext'

const HeaderWrapper = (props: PropsWithChildren) => {
  const { isOpen } = useSideNavigationContext()

  return <div className={classNames('l-header js-header', { 'is-active': isOpen })} {...props} />
}

export default HeaderWrapper
