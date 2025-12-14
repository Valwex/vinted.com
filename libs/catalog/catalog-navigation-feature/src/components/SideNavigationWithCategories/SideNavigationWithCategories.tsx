'use client'

import { SideNavigation } from '@marketplace-web/user-menu/user-menu-feature'
import { CatalogNavigationDto } from '@marketplace-web/catalog/catalog-data'
import { LanguageDto } from '@marketplace-web/language/language-data'

import CategoriesSection from '../CategoriesSection'

type Props = {
  catalogTree: Array<CatalogNavigationDto>
  impressumUrl: string | null
  isBusinessAccountLinksVisible: boolean
  initialLanguages: Array<LanguageDto>
}

const SideNavigationWithCategories = ({
  catalogTree,
  impressumUrl,
  isBusinessAccountLinksVisible,
  initialLanguages,
}: Props) => {
  return (
    <SideNavigation
      catalogTree={catalogTree}
      impressumUrl={impressumUrl}
      isBusinessAccountLinksVisible={isBusinessAccountLinksVisible}
      initialLanguages={initialLanguages}
      renderCategoriesSection={categories => <CategoriesSection categories={categories} />}
    />
  )
}

export default SideNavigationWithCategories
