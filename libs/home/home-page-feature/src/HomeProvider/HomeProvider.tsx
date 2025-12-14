'use client'

import { PropsWithChildren, useMemo, useState, useTransition } from 'react'
import { noop } from 'lodash'

import { HomepageTabModel } from '@marketplace-web/home/home-page-data'

import HomeContext from './HomeContext'

type Props = {
  homepageSessionId: string
  tabs: Array<HomepageTabModel>
}

const HomeProvider = ({ children, homepageSessionId, tabs }: PropsWithChildren<Props>) => {
  const [isLoading, startTransition] = useTransition()
  const [fetchTab, setFetchTab] = useState<(tab: HomepageTabModel) => void>(() => noop)

  const value = useMemo(
    () => ({
      homepageSessionId,
      startTransition,
      isLoading,
      tabs,
      fetchTab,
      setFetchTab,
    }),
    [homepageSessionId, tabs, startTransition, isLoading, fetchTab],
  )

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>
}

export default HomeProvider
