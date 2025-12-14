'use client'

import { Cell, Tabs, Text, offset, useFloating, Icon, Spacer } from '@vinted/web-ui'
import { useEffect, useMemo, useState } from 'react'
import { AiSparkles16 } from '@vinted/monochrome-icons'

import { useTrackAbTestCallback } from '@marketplace-web/feature-flags/ab-tests-data'
import { useDebounce } from '@marketplace-web/shared/ui-helpers'
import { CatalogNavigationDto } from '@marketplace-web/catalog/catalog-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

import NavigatedCategory from './NavigatedCategory'
import AboutTabContent from './AboutTabContent'
import { OUR_PLATFORM_URL, AI_SHOPPING_ASSISTANT_URL } from '../../constants/routes'

type Props = {
  tree: Array<CatalogNavigationDto>
  impressumUrl: string | null
  isBusinessAccountLinksVisible: boolean
  isOurPlatformVisible: boolean
  isShoppingAssistantVisible: boolean
}

const CLOSED_ID = 0
const ABOUT_ID = -1
const OUR_PLATFORM_ID = -2
const AI_SHOPPING_ASSISTANT_ID = -3

const CatalogNavigation = ({
  tree,
  impressumUrl,
  isBusinessAccountLinksVisible,
  isOurPlatformVisible,
  isShoppingAssistantVisible,
}: Props) => {
  const translate = useTranslate('header.main_navigation')
  const trackAbTest = useTrackAbTestCallback()

  const [activeCategoryId, setActiveCategoryId] = useState(CLOSED_ID)
  const isVisible = activeCategoryId !== CLOSED_ID

  const floatingArgs: Parameters<typeof useFloating>[0] = {
    isFloaterVisible: isVisible,
    shouldAutoUpdate: true,
    strategy: 'fixed',
    middleware: [offset({ mainAxis: 1 })],
  }

  const categoriesFloating = useFloating(floatingArgs)
  const bgFloating = useFloating(floatingArgs)

  const activeCategory = useMemo(
    () => tree.find(item => item.id === activeCategoryId),
    [activeCategoryId, tree],
  )

  useEffect(() => {
    tree.forEach(item => {
      if (item.experiment) {
        trackAbTest(item.experiment)
      }
    })
  }, [tree, trackAbTest])

  const openUnstable = (id: number) => {
    if (id === OUR_PLATFORM_ID) return
    setActiveCategoryId(id)
  }
  const closeUnstable = () => setActiveCategoryId(CLOSED_ID)

  const openLazyUnstable = useDebounce(openUnstable, 250, false)
  const closeLazyUnstable = useDebounce(closeUnstable, 300, false)

  const open = (id: number) => {
    closeLazyUnstable.cancel()
    openUnstable(id)
  }
  const openLazy = (id: number) => {
    closeLazyUnstable.cancel()
    openLazyUnstable(id)
  }
  const closeLazy = () => {
    openLazyUnstable.cancel()
    closeLazyUnstable()
  }

  const handleClick = (id: number) => () => open(id)

  const renderCategoryTab = (item: CatalogNavigationDto) => {
    const handleMouseEnter = () => {
      if (isVisible) {
        open(item.id)
      } else {
        openLazy(item.id)
      }
    }

    return (
      <>
        <div
          className="u-fill-width u-fill-height u-flexbox u-align-items-center u-justify-content-center"
          onMouseEnter={handleMouseEnter}
        >
          <Text
            text={item.title}
            as="span"
            alignment="center"
            width="parent"
            type="subtitle"
            theme={activeCategoryId === item.id ? 'amplified' : undefined}
            testId={`first-category-${item.id}`}
          />
        </div>
        {item.id === activeCategory?.id && (
          <div
            onMouseLeave={closeLazy}
            onMouseEnter={closeLazyUnstable.cancel}
            ref={categoriesFloating.floaterRef}
            style={categoriesFloating.floaterStyle}
            className="u-fill-width"
          >
            <Cell>
              <div className="container catalog-dropdown__container">
                <NavigatedCategory category={activeCategory} />
              </div>
            </Cell>
          </div>
        )}
      </>
    )
  }

  const renderAboutTab = () => {
    const handleMouseEnter = () => {
      if (isVisible) {
        open(ABOUT_ID)
      } else {
        openLazy(ABOUT_ID)
      }
    }

    return (
      <>
        <div
          className="u-fill-width u-fill-height u-flexbox u-align-items-center u-justify-content-center"
          onMouseEnter={handleMouseEnter}
        >
          <Text
            text={translate('tabs.about')}
            as="span"
            alignment="center"
            width="parent"
            type="subtitle"
            theme={activeCategoryId === ABOUT_ID ? 'amplified' : undefined}
            testId="first-category-about"
          />
        </div>
        {activeCategoryId === ABOUT_ID && (
          <div
            onMouseLeave={closeLazy}
            onMouseEnter={closeLazyUnstable.cancel}
            ref={categoriesFloating.floaterRef}
            style={categoriesFloating.floaterStyle}
            className="u-fill-width"
          >
            <Cell>
              <div className="container catalog-dropdown__container">
                <AboutTabContent
                  impressumUrl={impressumUrl}
                  isBusinessAccountLinksVisible={isBusinessAccountLinksVisible}
                />
              </div>
            </Cell>
          </div>
        )}
      </>
    )
  }

  const renderOurPlatformTab = () => {
    return (
      <a className="nav-links" href={OUR_PLATFORM_URL}>
        <Text
          text={translate('tabs.platform')}
          as="span"
          alignment="center"
          type="subtitle"
          testId="first-category-platform"
        />
      </a>
    )
  }

  const renderAiShoppingAssistantTab = () => {
    return (
      <a className="nav-links" href={AI_SHOPPING_ASSISTANT_URL}>
        <div className="u-flexbox u-justify-content-center">
          <Icon name={AiSparkles16} color="primary-default" />
          <Spacer size="small" orientation="vertical" />
          <Text
            text={translate('tabs.shopping_assistant')}
            as="span"
            alignment="center"
            type="subtitle"
            testId="first-category-ai-shopping-assistant"
            theme="primary"
            bold
          />
        </div>
      </a>
    )
  }

  const extraItems: Array<{ id: number; children: JSX.Element }> = [
    { id: ABOUT_ID, children: renderAboutTab() },
  ]

  if (isOurPlatformVisible) {
    extraItems.push({ id: OUR_PLATFORM_ID, children: renderOurPlatformTab() })
  }

  if (isShoppingAssistantVisible) {
    extraItems.push({ id: AI_SHOPPING_ASSISTANT_ID, children: renderAiShoppingAssistantTab() })
  }

  const visibleTree = useMemo(() => tree.filter(item => !item.is_hidden), [tree])

  return (
    <>
      {isVisible && (
        <div
          ref={bgFloating.floaterRef}
          style={bgFloating.floaterStyle}
          className="catalog-dropdown__background"
          role="none"
          onClick={handleClick(CLOSED_ID)}
        />
      )}

      <nav data-testid="nav-tabs" ref={categoriesFloating.triggerRef} onMouseLeave={closeLazy}>
        <div ref={bgFloating.triggerRef}>
          <Tabs
            onClick={item => handleClick(item.id)()}
            activeItemId={activeCategoryId}
            items={visibleTree
              .map(item => ({
                id: item.id,
                children: renderCategoryTab(item),
              }))
              .concat(...extraItems)}
          />
        </div>
      </nav>
    </>
  )
}

export default CatalogNavigation
