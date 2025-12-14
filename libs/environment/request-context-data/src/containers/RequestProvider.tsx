'use client'

import { ReactNode, useMemo } from 'react'

import { PageId } from '@marketplace-web/environment/page-configuration-util'

import RequestContext from './RequestContext'

type Props = {
  children: ReactNode
  pageId: PageId | null
  userAgent: string
  isBot: boolean
}

const RequestProvider = ({ pageId, children, userAgent, isBot }: Props) => {
  const value = useMemo(
    () => ({
      pageId,
      userAgent,
      isBot,
    }),
    [pageId, userAgent, isBot],
  )

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
}

export default RequestProvider
