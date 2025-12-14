'use client'

import { useEffect, ChangeEvent, useState, FormEvent, useRef, ReactNode, useMemo } from 'react'
import { Cell, InputText, Divider, Spacer, Text, Icon, InputBar, Container } from '@vinted/web-ui'
import { Checkmark24, Search16 } from '@vinted/monochrome-icons'

import {
  InputDropdown,
  InputDropdownRenderProps,
} from '@marketplace-web/common-components/input-dropdown-ui'
import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { ScrollableArea } from '@marketplace-web/common-components/scrollable-area-ui'
import {
  getPhonePrefixData,
  transformPhonePrefixDataResponse,
  startPhonePrefixSearch,
  closePhonePrefixDropdown,
  clickEvent,
} from '@marketplace-web/verification/verification-data'
import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'
import { useFetch } from '@marketplace-web/core-api/api-client-util'
import { useSession } from '@marketplace-web/shared/session-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'

type Props = {
  onChange: (phoneNumber: string) => void
  validation?: ReactNode
}

const PREFIX_DROPDOWN_MAX_HEIGHT = 300
const MOBILE_PREFIX_DROPDOWN_MAX_WIDTH = '58vh'

const PhoneNumberInputWithPrefix = ({ onChange, validation }: Props) => {
  const translate = useTranslate('settings.security.create_phone_number')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<string>()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchDirty, setIsSearchDirty] = useState(false)
  const currentUser = useSession().user
  const selectedCountryRef = useRef<HTMLDivElement>(null)
  const countryCode = currentUser?.country_code
  const breakpoint = useBreakpoint()
  const { track } = useTracking()
  const {
    fetch: fetchCountries,
    transformedData: initialCountries,
    isLoading: isLoadingInitialCountries,
  } = useFetch(getPhonePrefixData, transformPhonePrefixDataResponse)

  useEffect(() => {
    fetchCountries()
  }, [fetchCountries])

  const countries = useMemo(
    () =>
      initialCountries?.filter(
        country =>
          country.title.toLowerCase().includes(searchQuery) ||
          country.prefix.includes(searchQuery) ||
          country.countryCode.includes(searchQuery),
      ),
    [initialCountries, searchQuery],
  )

  const selectedPrefix = useMemo(() => {
    if (!selectedCountry || !initialCountries) return null

    return initialCountries.find(country => country.countryCode === selectedCountry)?.prefix
  }, [selectedCountry, initialCountries])

  useEffect(() => {
    if (!countryCode || !initialCountries) return

    const defaultCountry = initialCountries.find(
      country => country.countryCode === countryCode.toLowerCase(),
    )

    setSelectedCountry(defaultCountry?.countryCode || initialCountries[0]?.countryCode)
  }, [countryCode, initialCountries])

  useEffect(() => {
    onChange(`${selectedPrefix}${phoneNumber}`)
  }, [selectedPrefix, phoneNumber, onChange])

  const scrollToSelectedCountry = () => {
    if (selectedCountryRef.current) {
      selectedCountryRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }

  const resetCountries = () => {
    setSearchQuery('')
  }

  const handleCloseDropdown = () => {
    track(closePhonePrefixDropdown())
    resetCountries()
  }

  const handlePrefixChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedCountry(event.target.value)
  }

  const handlePrefixSelect = (code: string, props: InputDropdownRenderProps) => () => {
    setSelectedCountry(code)
    setSearchQuery('')
    props.closeDropdown()

    track(clickEvent({ target: 'phone_prefix_select_option', targetDetails: searchQuery }))
  }

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value)
  }

  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement> | FormEvent<HTMLTextAreaElement>,
  ) => {
    const { value } = event.currentTarget || event.target
    const search = value.toLowerCase()

    setSearchQuery(search)

    if (!isSearchDirty) {
      track(startPhonePrefixSearch())
      setIsSearchDirty(true)
    }
  }

  const handleDropdownOpen = () => {
    scrollToSelectedCountry()
    track(clickEvent({ target: 'phone_prefix_select' }))
  }

  const renderPrefix = (code: string, prefix: string) => {
    return (
      <>
        <Text text={prefix} as="span" />
        {code === selectedCountry && (
          <>
            <Spacer orientation="vertical" />
            <Icon name={Checkmark24} color="success-default" />
          </>
        )}
      </>
    )
  }

  const renderSearchBar = () => {
    return (
      <Container>
        <div>
          <InputBar
            prefix={
              <div className="u-flexbox u-fill-height u-align-items-center u-padding-left-regular">
                <Icon name={Search16} />
              </div>
            }
            name="search"
            placeholder={translate('prefix_search_placeholder')}
            onChange={handleSearchChange}
            onValueClear={resetCountries}
          />
        </div>
      </Container>
    )
  }

  const renderDropdown = (props: InputDropdownRenderProps) => (
    <div className="phone-number-input__dropdown">
      {renderSearchBar()}
      <ScrollableArea
        maxHeight={
          breakpoint.phones ? MOBILE_PREFIX_DROPDOWN_MAX_WIDTH : PREFIX_DROPDOWN_MAX_HEIGHT
        }
      >
        <SeparatedList separator={<Divider />}>
          {(countries || []).map(country => (
            <div
              key={country.prefix}
              ref={country.countryCode === selectedCountry ? selectedCountryRef : null}
            >
              <Cell
                type="navigating"
                body={<Text text={country.title} as="span" />}
                suffix={renderPrefix(country.countryCode, country.prefix)}
                onClick={handlePrefixSelect(country.countryCode, props)}
              />
            </div>
          ))}
        </SeparatedList>
      </ScrollableArea>
    </div>
  )

  return (
    <>
      <Spacer size="x-large" />
      <div className="u-flexbox u-flex-direction-row">
        <div className="phone-number-input__prefix">
          <InputDropdown
            name="prefix"
            textSave=""
            styling="tight"
            value={selectedPrefix}
            onChange={handlePrefixChange}
            onOpen={handleDropdownOpen}
            render={renderDropdown}
            isSaveButtonShown={false}
            onClose={handleCloseDropdown}
            isScrollable={false}
            isLoading={!selectedCountry || isLoadingInitialCountries}
            isPhone={!!breakpoint.phones}
            readOnly
            testId="phone-number-prefix"
          />
        </div>
        <Spacer size="large" orientation="vertical" />
        <InputText
          placeholder={translate('input.placeholder_with_country_code')}
          name="number"
          value={phoneNumber ?? ''}
          onChange={handlePhoneChange}
          testId="phone-number"
          styling="tight"
          validation={validation}
        />
      </div>
      <Spacer size="x-large" />
    </>
  )
}

export default PhoneNumberInputWithPrefix
