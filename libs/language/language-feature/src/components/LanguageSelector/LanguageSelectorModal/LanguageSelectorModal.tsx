'use client'

import { Fragment, useEffect, useState } from 'react'
import {
  Label,
  Spacer,
  Cell,
  Text,
  Card,
  Dialog,
  Radio,
  Button,
  Divider,
  Icon,
} from '@vinted/web-ui'
import { Dropdown16, Globe24 } from '@vinted/monochrome-icons'

import { FormattedMessage } from '@marketplace-web/i18n/i18n-feature'
import { LanguageDto } from '@marketplace-web/language/language-data'
import { useAbTest, useTrackAbTest } from '@marketplace-web/feature-flags/ab-tests-data'

import useLanguageSelector from '../useLanguageSelector'

type Props = {
  languages: Array<LanguageDto>
  activeLanguage: LanguageDto
  isStandalone?: boolean
  setActiveLanguage: (language: LanguageDto) => void
}

const LanguageSelectorModal = ({
  languages,
  activeLanguage,
  isStandalone,
  setActiveLanguage,
}: Props) => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageDto>(activeLanguage)
  const { isMenuOpen, toggleMenu, saveLanguage } = useLanguageSelector({
    activeLanguage,
    setActiveLanguage,
  })

  const userMenuDropdownAbTest = useAbTest('user_menu_dropdown_reorder_web')
  useTrackAbTest(userMenuDropdownAbTest)

  const isUserMenuDropdOwnAbTestOn =
    userMenuDropdownAbTest && userMenuDropdownAbTest.variant !== 'off'

  useEffect(() => {
    setSelectedLanguage(activeLanguage)
  }, [activeLanguage])

  const handleLanguageSelect = (language: LanguageDto) => () => setSelectedLanguage(language)
  const handleLanguageSubmit = (language: LanguageDto) => () => saveLanguage(language)

  const renderNavigationToggle = () => (
    <>
      {isUserMenuDropdOwnAbTestOn && <Spacer size="x2-large" />}
      <Label
        type="stacked"
        styling="default"
        text={<FormattedMessage id="language_selector.menu_title" />}
      />
      <Cell
        prefix={<Icon name={Globe24} color="greyscale-level-2" />}
        type="navigating"
        onClick={toggleMenu}
      >
        <Text as="h3" text={activeLanguage.title_local} type="subtitle" theme="amplified" />
        <Spacer orientation="vertical" size="small" />
        <Text as="h3" text={`(${activeLanguage.title})`} type="subtitle" theme="muted" />
      </Cell>
    </>
  )

  const renderStandaloneToggle = () => (
    <div className="u-ui-padding-left-small u-padding-top-large">
      <Button
        text={activeLanguage.title_short.toUpperCase()}
        styling="flat"
        size="medium"
        theme="muted"
        inline
        truncated={false}
        icon={<Icon name={Dropdown16} color="greyscale-level-2" />}
        iconPosition="right"
        onClick={toggleMenu}
      />
    </div>
  )

  return (
    <>
      {isStandalone ? renderStandaloneToggle() : renderNavigationToggle()}
      <Dialog show={isMenuOpen}>
        <Card styling="elevated">
          <Cell>
            <div className="u-text-center">
              <Text
                as="h1"
                text={<FormattedMessage id="language_selector.menu_title" />}
                type="heading"
              />
            </div>
          </Cell>

          {languages.map(language => {
            const isChecked = language.id === selectedLanguage.id
            const labelId = `radio-label-${language.title}`

            return (
              <Fragment key={language.id}>
                <Cell
                  type="navigating"
                  onClick={handleLanguageSelect(language)}
                  suffix={
                    <Radio
                      name={`language_selector_${language.id}`}
                      checked={isChecked}
                      onChange={() => undefined}
                      aria={{
                        'aria-labelledby': labelId,
                      }}
                    />
                  }
                >
                  <Text as="span" text={language.title_local} theme="amplified" bold id={labelId} />
                  <Spacer orientation="vertical" size="small" />
                  <Text as="span" text={`(${language.title})`} bold />
                </Cell>
                <Divider />
              </Fragment>
            )
          })}

          <div className="u-ui-padding-large">
            <Button
              text={<FormattedMessage id="language_selector.menu_options.save" />}
              styling="filled"
              onClick={handleLanguageSubmit(selectedLanguage)}
              testId="language-selector-modal-save"
            />
          </div>
          <div className="u-ui-padding-large u-padding-top-none">
            <Button
              text={<FormattedMessage id="language_selector.menu_options.cancel" />}
              styling="flat"
              onClick={toggleMenu}
              testId="language-selector-modal-cancel"
            />
          </div>
        </Card>
      </Dialog>
    </>
  )
}

export default LanguageSelectorModal
