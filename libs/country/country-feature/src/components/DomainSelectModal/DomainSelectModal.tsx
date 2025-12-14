'use client'

import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Dialog, Button, Text, Navigation, Cell, Icon } from '@vinted/web-ui'
import { X24 } from '@vinted/monochrome-icons'
import * as flagIcons from '@vinted/flag-icons'
import { capitalize } from 'lodash'

import { cookiesDataByName, useCookie } from '@marketplace-web/environment/cookies-util'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'

import { CountryLinkDto } from '@marketplace-web/country/country-data'

type Props = {
  domainLinks: Array<CountryLinkDto>
}

const FLAG_SIZE = 24

function buildFlagName(countryCode: string) {
  return capitalize(countryCode) + FLAG_SIZE
}

const DomainSelectModal = ({ domainLinks }: Props) => {
  const [show, setShow] = useState(true)
  const cookies = useCookie()
  const translate = useTranslate()

  const { relativeUrl, urlQuery, host } = useBrowserNavigation()

  const currentRelativeUrl = `${relativeUrl}${urlQuery}`

  const isRootPath = currentRelativeUrl === '/'

  function handleCloseModal() {
    cookies.set(cookiesDataByName.domain_selected, 'true')
    setShow(false)
  }
  const handleDomainLinkClick = (
    countryLink: CountryLinkDto,
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (!countryLink.link.includes(host)) return

    event.preventDefault()
    handleCloseModal()
  }

  function renderCountryCell(countryLink: CountryLinkDto, index: number) {
    const flagIconName = flagIcons[buildFlagName(countryLink.code)]

    let newRelativeUrl = ''

    if (!isRootPath) {
      newRelativeUrl = currentRelativeUrl
    }

    return (
      <Cell
        key={index}
        body={
          <a
            className="domain-selection-link"
            href={countryLink.link + newRelativeUrl}
            onClick={event => handleDomainLinkClick(countryLink, event)}
          >
            {flagIconName && <Icon display="block" name={flagIconName} />}
            <FormattedMessage id={`native_country_names.${countryLink.code}`} />
          </a>
        }
      />
    )
  }

  if (!domainLinks.length) return null

  return (
    <Dialog show={show} hasScrollableContent testId="domain-select-modal">
      <div className="u-ui-padding-regular u-fill-width">
        <Navigation
          theme="transparent"
          right={
            <Button
              aria={{ 'aria-label': translate('common.a11y.actions.dialog_close') }}
              testId="domain-select-modal-close-button"
              styling="flat"
              onClick={handleCloseModal}
              iconName={X24}
              inline
            />
          }
        />
        <Cell>
          <Text text={<FormattedMessage id="domain_selection.title" />} type="heading" as="h2" />
        </Cell>
        <div className="u-fill-height u-overflow-auto">{domainLinks.map(renderCountryCell)}</div>
      </div>
    </Dialog>
  )
}

export default DomainSelectModal
