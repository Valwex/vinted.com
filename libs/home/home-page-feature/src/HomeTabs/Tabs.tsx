'use client'

import { Chip } from '@vinted/web-ui'
import { useEffect, useRef } from 'react'

import { userClickHomepageVertical } from '@marketplace-web/home/home-page-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { scrollToTop } from '@marketplace-web/browser/browser-interaction-util'

import { useHomeContext } from '../HomeProvider'
import type useTabs from '../hooks/useTabs'
import { scrollToTab } from '../utils/tabs'

type Props = ReturnType<typeof useTabs>

const TabsComponent = ({ currentTab, shouldShowTabs, navigateToTab, tabs }: Props) => {
  const { track } = useTracking()
  const containerRef = useRef<HTMLDivElement>(null)
  const { homepageSessionId, fetchTab } = useHomeContext()

  useEffect(() => {
    scrollToTab(currentTab.name, containerRef.current)
    // Only for initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!shouldShowTabs) return null

  const handleClick = (tabName: string) => {
    scrollToTab(tabName, containerRef.current)
    scrollToTop()
    track(
      userClickHomepageVertical({
        homepageSessionId,
        target: tabName,
      }),
    )

    const newTab = tabs.find(tab => tab.name === tabName)
    if (!newTab) return

    navigateToTab(tabName)
    fetchTab(newTab)
  }

  const tabItems = Object.values(tabs).map(({ name, title }) => ({ title, id: name }))

  return (
    <div className="homepage-tabs">
      <div className="homepage-tabs__content" ref={containerRef}>
        {tabItems.map(tab => (
          <span className="u-flex-shrink-none" key={tab.id}>
            <Chip
              id={tab.id}
              text={tab.title}
              type="button"
              radius="round"
              textType="subtitle"
              onClick={() => handleClick(tab.id)}
              activated={tab.id === currentTab.name}
            />
          </span>
        ))}
      </div>
    </div>
  )
}

export default TabsComponent
