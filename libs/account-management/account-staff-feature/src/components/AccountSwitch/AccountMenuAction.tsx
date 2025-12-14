'use client'

import { MouseEvent, ReactNode } from 'react'

type Props = {
  href?: string
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void
  children: ReactNode
}

const AccountMenuAction = ({ href, onClick, children }: Props) =>
  href ? (
    <a href={href} onClick={onClick} className="nav-link">
      {children}
    </a>
  ) : (
    <button type="button" onClick={onClick} className="nav-link">
      {children}
    </button>
  )

export default AccountMenuAction
