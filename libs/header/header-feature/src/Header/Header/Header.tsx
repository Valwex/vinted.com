'use client'

import classNames from 'classnames'
import { useState } from 'react'

import { HeaderCatalogNavigation } from '@marketplace-web/catalog/catalog-navigation-feature'
import { CatalogNavigationDto } from '@marketplace-web/catalog/catalog-data'

import { LanguageDto } from '@marketplace-web/language/language-data'

import HeaderToggleMobileMenu from '../HeaderToggleMobileMenu'

type Props = {
  children?: JSX.Element
  languages: Array<LanguageDto>
  catalogTree: Array<CatalogNavigationDto>
  impressumUrl: string | null
  isBusinessAccountLinksVisible: boolean
  isOurPlatformVisible: boolean
  isShoppingAssistantVisible: boolean
}

const Header = ({
  children,
  languages,
  catalogTree,
  impressumUrl,
  isBusinessAccountLinksVisible,
  isOurPlatformVisible,
  isShoppingAssistantVisible,
}: Props) => {
  const [isSideNavigationOpen, setIsSideNavigationOpen] = useState(false)

  function toggleSideNavigation() {
    setIsSideNavigationOpen(prevState => !prevState)
  }

  return (
    <>
      {/* TODO: remove `js-header` which is used in the <Advertisement /> */}
      <div className={classNames('l-header js-header', { 'is-active': isSideNavigationOpen })}>
        <header className="l-header__main">
          <div className="container u-flexbox u-align-items-center u-fill-height">
            <div className="u-flexbox u-align-items-center u-fill-width">
              {children}

              <div className="u-mobiles-only">
                <HeaderToggleMobileMenu
                  isActive={isSideNavigationOpen}
                  onToggle={toggleSideNavigation}
                />
              </div>
            </div>
          </div>
        </header>

        <HeaderCatalogNavigation
          isSideNavigationOpen={isSideNavigationOpen}
          languages={languages}
          catalogTree={catalogTree}
          impressumUrl={impressumUrl}
          isBusinessAccountLinksVisible={isBusinessAccountLinksVisible}
          isOurPlatformVisible={isOurPlatformVisible}
          isShoppingAssistantVisible={isShoppingAssistantVisible}
        />
      </div>
    </>
  )
}

export default Header
