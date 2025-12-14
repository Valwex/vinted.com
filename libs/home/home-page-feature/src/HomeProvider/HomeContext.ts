'use client'

import { createContext } from 'react'
import { noop } from 'lodash'

import { HomepageTabModel } from '@marketplace-web/home/home-page-data'

export type HomeContextType = {
  homepageSessionId: string
  tabs: Array<HomepageTabModel>
  fetchTab: (tab: HomepageTabModel) => void
  setFetchTab: (fn: (tab: HomepageTabModel) => void) => void
}

const HomeContext = createContext<HomeContextType>({
  // These fallback values will never be used, as the provider is required
  homepageSessionId: '',
  tabs: [],
  fetchTab: noop,
  setFetchTab: noop,
})

export default HomeContext
