'use client'

import { Cell } from '@vinted/web-ui'
import { ReactNode, PropsWithChildren } from 'react'

import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import { useSession } from '@marketplace-web/shared/session-data'
import { getIsInCatalog, CatalogNavigationDto } from '@marketplace-web/catalog/catalog-data'

import { SearchSubscribeButton } from '../SavedSearches'
import SearchBar from '../SearchBar'

type Props = {
  catalogTree: Array<CatalogNavigationDto>
  wrapperComponent?: (props: PropsWithChildren) => ReactNode
}

const DefaultWrapperComponent = (props: PropsWithChildren) => (
  <div className="l-search" {...props} />
)

const MobileHeaderSearchBar = ({
  catalogTree,
  wrapperComponent: WrapperComponent = DefaultWrapperComponent,
}: Props) => {
  const { relativeUrl, searchParams } = useBrowserNavigation()
  const userId = useSession().user?.id
  const isInCatalog = getIsInCatalog(relativeUrl)
  const disableSearchSaving = searchParams?.disable_search_saving

  const showSearchSubscribeButton = isInCatalog && userId && !disableSearchSaving

  return (
    <WrapperComponent>
      <Cell styling="tight">
        <div className="u-ui-padding-vertical-regular">
          <div className="container">
            <div className="u-flexbox">
              <div className="u-fill-width">
                <SearchBar catalogTree={catalogTree} isInCatalog={isInCatalog} />
              </div>

              {showSearchSubscribeButton && (
                <div className="u-phones-only u-ui-margin-left-medium">
                  <SearchSubscribeButton catalogTree={catalogTree} />
                </div>
              )}
            </div>
          </div>
        </div>
      </Cell>
    </WrapperComponent>
  )
}

export default MobileHeaderSearchBar
