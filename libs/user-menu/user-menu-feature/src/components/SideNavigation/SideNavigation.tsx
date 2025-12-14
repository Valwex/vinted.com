'use client'

import { useEffect, useMemo } from 'react'
import { Divider } from '@vinted/web-ui'

import { LanguageSelector } from '@marketplace-web/language/language-feature'
import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'
import { CatalogNavigationDto } from '@marketplace-web/catalog/catalog-data'
import { useSession } from '@marketplace-web/shared/session-data'
import { LanguageDto } from '@marketplace-web/language/language-data'
import {
  useAbTest,
  useTrackAbTest,
  useTrackAbTestCallback,
} from '@marketplace-web/feature-flags/ab-tests-data'

import LoginSection from './LoginSection'
import OtherSection from './OtherSection'
import AccountLinksWithIcons from '../AccountLinks/AccountLinksWithIcons'
import AccountLinks from '../AccountLinks'

type Props = {
  catalogTree: Array<CatalogNavigationDto>
  impressumUrl: string | null
  isBusinessAccountLinksVisible: boolean
  initialLanguages: Array<LanguageDto>
  renderCategoriesSection: (categories: Array<CatalogNavigationDto>) => React.ReactNode
}

const SideNavigation = ({
  catalogTree,
  impressumUrl,
  isBusinessAccountLinksVisible,
  initialLanguages,
  renderCategoriesSection,
}: Props) => {
  const { user } = useSession()
  const trackAbTest = useTrackAbTestCallback()

  const visibleTree = useMemo(() => catalogTree.filter(item => !item.is_hidden), [catalogTree])

  useEffect(() => {
    catalogTree.forEach(item => {
      if (item.experiment) {
        trackAbTest(item.experiment)
      }
    })
  }, [catalogTree, trackAbTest])

  const userMenuDropdownAbTest = useAbTest('user_menu_dropdown_reorder_web')
  useTrackAbTest(userMenuDropdownAbTest)

  const isUserMenuDropdOwnAbTestOn =
    userMenuDropdownAbTest && userMenuDropdownAbTest.variant !== 'off'

  return (
    <SeparatedList separator={<Divider />}>
      <LoginSection isLoggedIn={!!user} />
      {renderCategoriesSection(visibleTree)}
      {user && (isUserMenuDropdOwnAbTestOn ? <AccountLinksWithIcons /> : <AccountLinks />)}
      <LanguageSelector initialLanguages={initialLanguages} />
      <OtherSection
        impressumUrl={impressumUrl}
        isBusinessAccountLinksVisible={isBusinessAccountLinksVisible}
      />
    </SeparatedList>
  )
}

export default SideNavigation
