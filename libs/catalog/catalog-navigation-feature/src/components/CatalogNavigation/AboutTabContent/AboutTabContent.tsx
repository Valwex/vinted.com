'use client'

import { useMemo } from 'react'

import CompanyBlock from '../AboutPanel/CompanyBlock'
import DiscoverBlock from '../AboutPanel/DiscoverBlock'
import { LinkCellContext } from '../AboutPanel/LinkCell/LinkCell'
import PoliciesBlock from '../AboutPanel/PoliciesBlock'
import PrivacyBlock from '../AboutPanel/PrivacyBlock'

type Props = {
  impressumUrl: string | null
  isBusinessAccountLinksVisible: boolean
}

const AboutTabContent = ({ impressumUrl, isBusinessAccountLinksVisible }: Props) => {
  const linkCellContextValue = useMemo(() => ({ boldHover: true }), [])

  return (
    <LinkCellContext.Provider value={linkCellContextValue}>
      <div className="catalog-dropdown__navigated-container u-flex-wrap">
        <div className="catalog-dropdown__level1-container">
          <DiscoverBlock isBusinessAccountLinksVisible={isBusinessAccountLinksVisible} />
        </div>
        <div className="catalog-dropdown__level1-container">
          <CompanyBlock />
        </div>
        <div className="catalog-dropdown__level1-container">
          <PoliciesBlock
            impressumUrl={impressumUrl}
            isBusinessAccountLinksVisible={isBusinessAccountLinksVisible}
          />
        </div>
        <div className="catalog-dropdown__level1-container">
          <PrivacyBlock />
        </div>
      </div>
    </LinkCellContext.Provider>
  )
}

export default AboutTabContent
