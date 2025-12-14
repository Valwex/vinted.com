'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { PageId } from '@marketplace-web/environment/page-configuration-util'

const pageConfigMessage = '`%s` is `unknown`, you can set it in `get-page-configuration.ts`'

type Props = {
  requireAuthorization: boolean
  screen: string
  pageId: PageId
}

const ValidatePageConfigs = ({ requireAuthorization, screen, pageId }: Props) => {
  const pathname = usePathname()
  const skipScreenValidation = pathname?.startsWith('/dev/') || pathname === '/revision'

  useEffect(() => {
    if (skipScreenValidation) return
    if (screen !== 'unknown') return

    throw new Error(pageConfigMessage.replace('%s', 'screen'))
  }, [skipScreenValidation, screen])

  useEffect(() => {
    if (pageId !== 'unknown') return

    throw new Error(pageConfigMessage.replace('%s', 'pageId'))
  }, [pageId])

  useEffect(() => {
    if (!requireAuthorization) return
    if (document.querySelectorAll('link[rel="alternate"]').length) return

    throw new Error('use generatePageMetadata to set meta tags')
  }, [requireAuthorization])

  return null
}

export default ValidatePageConfigs
