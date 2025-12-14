'use client'

import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import { HomepageTabModel } from '@marketplace-web/home/home-page-data'

import useShowHomeTabs from './useShowHomeTabs'
import { useHomeContext } from '../HomeProvider'

type Config = {
  navigateToTab: (tab: string) => void
  shouldShowTabs: boolean
  tabs: Array<HomepageTabModel>
  currentTab: HomepageTabModel
  currentTabName: string
}

const useTabs = (): Config => {
  const shouldShowTabs = useShowHomeTabs()
  const { tabs } = useHomeContext()

  const location = useBrowserNavigation()
  const currentTabName = (location.urlParams.tab as string | undefined) ?? tabs[0]!.name

  const navigateToTab = (tab: string) => {
    location.pushHistoryState(`?tab=${tab}`)
  }

  const currentTab = tabs.find(tab => tab.name === currentTabName) ?? tabs[0]!

  return {
    navigateToTab,
    shouldShowTabs: shouldShowTabs && tabs.length > 1,
    tabs,
    currentTab,
    currentTabName,
  }
}

export default useTabs
