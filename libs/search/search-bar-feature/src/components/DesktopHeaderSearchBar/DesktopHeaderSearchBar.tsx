'use client'

import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import { getIsInCatalog, CatalogNavigationDto } from '@marketplace-web/catalog/catalog-data'

import SearchBar from '../SearchBar'

type Props = {
  catalogTree: Array<CatalogNavigationDto>
}

const DesktopHeaderSearchBar = ({ catalogTree }: Props) => {
  const { relativeUrl } = useBrowserNavigation()

  return (
    <div className="u-desktops-only u-fill-width u-position-relative u-z-index-notification u-ui-margin-right-x3-large">
      <SearchBar catalogTree={catalogTree} isInCatalog={getIsInCatalog(relativeUrl)} />
    </div>
  )
}

export default DesktopHeaderSearchBar
