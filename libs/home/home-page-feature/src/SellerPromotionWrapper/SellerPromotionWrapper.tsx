'use client'

import useTabs from '../hooks/useTabs'

const SellerPromotionWrapper = ({ children }: { children: React.ReactNode }) => {
  const { currentTab } = useTabs()

  if (!currentTab.isSellerPromotionEnabled) return null

  return children
}

export default SellerPromotionWrapper
