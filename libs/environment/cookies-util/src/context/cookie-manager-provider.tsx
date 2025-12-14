'use client'

import { ReactNode } from 'react'

import { CookieHandler } from '../types/cookie'
import { CookieManagerContext } from './cookie-manager-context'

type Props = {
  children?: ReactNode
  cookieManager: CookieHandler
}

const CookieManagerProvider = ({ children, cookieManager }: Props) => (
  <CookieManagerContext.Provider value={cookieManager}>{children}</CookieManagerContext.Provider>
)

export default CookieManagerProvider
