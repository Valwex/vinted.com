'use client'

import { createContext } from 'react'

import { PageId } from '@marketplace-web/environment/page-configuration-util'

export type RequestContextType = {
  pageId: PageId | null
  userAgent: string
  isBot: boolean
}

const RequestContext = createContext<RequestContextType>(null as any)

export default RequestContext
