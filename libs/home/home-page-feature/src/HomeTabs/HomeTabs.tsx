'use client'

import useTabs from '../hooks/useTabs'
import Tabs from './Tabs'

const HomeTabsNew = () => {
  const tabProps = useTabs()

  return <Tabs {...tabProps} />
}

export default HomeTabsNew
