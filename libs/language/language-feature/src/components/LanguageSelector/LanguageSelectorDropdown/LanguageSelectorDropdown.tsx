'use client'

import { Dropdown16 } from '@vinted/monochrome-icons'
import { Button, Card, Cell, Divider, Icon, Spacer, Text } from '@vinted/web-ui'

import { OutsideClick } from '@marketplace-web/common-components/outside-click-ui'
import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'
import { LanguageDto } from '@marketplace-web/language/language-data'

import useLanguageSelector from '../useLanguageSelector'

type Props = {
  languages: Array<LanguageDto>
  activeLanguage: LanguageDto
  setActiveLanguage: (language: LanguageDto) => void
}

const LanguageSelectorDropdown = ({ languages, activeLanguage, setActiveLanguage }: Props) => {
  const { isMenuOpen, toggleMenu, hideMenu, saveLanguage } = useLanguageSelector({
    activeLanguage,
    setActiveLanguage,
  })

  const { title_short: titleShort } = activeLanguage
  const handleLanguageSelection = (language: LanguageDto) => () => saveLanguage(language)

  const renderLanguageText = (language: LanguageDto) => {
    const { id: activeLanguageId } = activeLanguage

    const activeLanguageProps: Partial<React.ComponentProps<typeof Text>> = {
      theme: 'amplified' as const,
      bold: true,
    }

    const props = language.id === activeLanguageId ? activeLanguageProps : {}

    return (
      <>
        <Text as="span" text={language.title_local} {...props} />
        <Spacer orientation="vertical" size="small" />
        <Text as="span" text={`(${language.title})`} {...props} />
      </>
    )
  }

  return (
    <OutsideClick onOutsideClick={hideMenu}>
      <div className="u-ui-padding-left-small">
        <Button
          text={titleShort.toUpperCase()}
          styling="flat"
          size="medium"
          theme="muted"
          inline
          truncated={false}
          icon={<Icon name={Dropdown16} color="greyscale-level-2" />}
          iconPosition="right"
          onClick={toggleMenu}
          aria={{
            'aria-expanded': isMenuOpen,
          }}
        />
        {isMenuOpen && (
          <div className="language-selector__dropdown">
            <Card styling="elevated">
              <div className="u-overflow-hidden">
                <SeparatedList separator={<Divider />}>
                  {languages.map(language => (
                    <Cell
                      type="navigating"
                      onClick={handleLanguageSelection(language)}
                      key={language.id}
                    >
                      {renderLanguageText(language)}
                    </Cell>
                  ))}
                </SeparatedList>
              </div>
            </Card>
          </div>
        )}
      </div>
    </OutsideClick>
  )
}

export default LanguageSelectorDropdown
