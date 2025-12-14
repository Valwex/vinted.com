import { CatalogNavigationDto } from '@marketplace-web/catalog/catalog-data'

import { LanguageDto } from '@marketplace-web/language/language-data'

import CatalogNavigation from '../CatalogNavigation'
import SideNavigationWithCategories from '../SideNavigationWithCategories'

type Props = {
  languages: Array<LanguageDto>
  catalogTree: Array<CatalogNavigationDto>
  impressumUrl: string | null
  isBusinessAccountLinksVisible: boolean
  isOurPlatformVisible: boolean
  isSideNavigationOpen: boolean
  isShoppingAssistantVisible: boolean
}

const HeaderCatalogNavigation = ({
  isSideNavigationOpen,
  languages,
  catalogTree,
  impressumUrl,
  isBusinessAccountLinksVisible,
  isOurPlatformVisible,
  isShoppingAssistantVisible,
}: Props) => {
  return (
    <div className="l-header__navigation">
      {isSideNavigationOpen && (
        <div className="u-mobiles-only">
          <SideNavigationWithCategories
            catalogTree={catalogTree}
            impressumUrl={impressumUrl}
            isBusinessAccountLinksVisible={isBusinessAccountLinksVisible}
            initialLanguages={languages}
          />
        </div>
      )}

      <div className="u-desktops-only">
        <div className="container">
          <CatalogNavigation
            tree={catalogTree}
            impressumUrl={impressumUrl}
            isBusinessAccountLinksVisible={isBusinessAccountLinksVisible}
            isOurPlatformVisible={isOurPlatformVisible}
            isShoppingAssistantVisible={isShoppingAssistantVisible}
          />
        </div>
      </div>
    </div>
  )
}

export default HeaderCatalogNavigation
