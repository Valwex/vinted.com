'use client'

import { Button, Card, Cell, Icon } from '@vinted/web-ui'
import { Dropdown16 } from '@vinted/monochrome-icons'

import { SearchBarSearchType } from '@marketplace-web/search/search-feature'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

const SEARCH_TYPES: Array<SearchBarSearchType> = [
  SearchBarSearchType.Item,
  SearchBarSearchType.User,
]
const SELECTOR_DROPDOWN_WIDTH = 150

type Props = {
  isOpen?: boolean
  selectedType?: SearchBarSearchType
  onClick: () => void
  onSelect: (type: SearchBarSearchType) => void
}

const TypeSelector = ({
  isOpen = false,
  selectedType = SearchBarSearchType.Item,
  onClick,
  onSelect,
}: Props) => {
  const translate = useTranslate('searchbar')

  const handleTypeClick = (searchType: SearchBarSearchType) => () => {
    onSelect(searchType)
  }

  const renderDropdownItem = (searchType: SearchBarSearchType) => (
    <Cell
      key={searchType}
      type="navigating"
      styling="narrow"
      onClick={handleTypeClick(searchType)}
      testId={`search-bar-search-type-${searchType}`}
    >
      {translate(`types.${searchType}`)}
    </Cell>
  )

  const renderDropdown = (searchTypes: Array<SearchBarSearchType>) => {
    if (!isOpen) return null

    return (
      <div
        className="u-ui-margin-top-regular u-position-absolute"
        style={{ width: SELECTOR_DROPDOWN_WIDTH }}
      >
        <Card>
          <div className="u-overflow-hidden">{searchTypes.map(renderDropdownItem)}</div>
        </Card>
      </div>
    )
  }

  const searchType = SEARCH_TYPES.find(type => type === selectedType)

  if (!searchType) return null

  return (
    <div className="u-position-relative">
      <Button
        text={<span id={`search-${searchType}`}>{translate(`types.${searchType}`)}</span>}
        styling="flat"
        size="medium"
        theme="muted"
        icon={<Icon name={Dropdown16} color="greyscale-level-2" />}
        iconPosition="right"
        onClick={onClick}
        testId="search-bar-search-type"
        aria={{
          'aria-expanded': isOpen,
        }}
      />
      {renderDropdown(SEARCH_TYPES)}
    </div>
  )
}

export default TypeSelector
