'use client'

import { createElement, MouseEvent, ReactNode } from 'react'

type Props = {
  href?: string
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
  children: ReactNode
}

const UserMenuGroupAction = ({ href, onClick, children }: Props) =>
  createElement(
    href ? 'a' : 'button',
    {
      href,
      onClick,
      className: 'nav-link',
    },
    children,
  )

export default UserMenuGroupAction
