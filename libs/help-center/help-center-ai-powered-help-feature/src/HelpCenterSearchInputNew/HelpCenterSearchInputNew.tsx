'use client'

import { Card, Cell, Icon, InputBar, List, Text } from '@vinted/web-ui'
import { FormEvent, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { AiSparkles16, Search16 } from '@vinted/monochrome-icons'

import { trim } from 'lodash'

import {
  aiPoweredHelpClearButtonClicked,
  aiPoweredHelpSuggestionsDisplayed,
  aiPoweredHelpSuggestionClicked,
} from '@marketplace-web/help-center/help-center-ai-powered-help-data'

import { OutsideClick } from '@marketplace-web/common-components/outside-click-ui'
import { useLatestCallback } from '@marketplace-web/shared/ui-state-util'
import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { cookiesDataByName, useCookie } from '@marketplace-web/environment/cookies-util'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { urlWithParams } from '@marketplace-web/browser/url-util'
import { AccessChannel } from '@marketplace-web/help-center/help-center-faq-entry-url-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useSession } from '@marketplace-web/shared/session-data'
import { useAbTest } from '@marketplace-web/feature-flags/ab-tests-data'

import useHelpCenterSessionTracking from '@marketplace-web/help-center/help-center-session-tracking-util'

import { HELP_SEARCH_URL } from '../constants/routes'
import { useQuerySuggestions } from '../HelpCenterAiSearch/hooks/useQuerySuggestions'

const HelpCenterSearchInputNew = ({ value = '' }) => {
  const translate = useTranslate('help_center.ai_search')
  const { track } = useTracking()
  const { helpCenterSessionId } = useHelpCenterSessionTracking()

  const isAiPoweredHelpSearchSuggestionsEnabled = useFeatureSwitch(
    'help_center_ai_powered_help_search_suggestions',
  )
  const aiHelpQuerySuggestionsAbTest = useAbTest('ai_help_query_suggestions_web_v1')
  const isAiHelpQuerySuggestionsAbTestEnabled =
    isAiPoweredHelpSearchSuggestionsEnabled &&
    (aiHelpQuerySuggestionsAbTest?.variant === 'on_1' ||
      aiHelpQuerySuggestionsAbTest?.variant === 'on_2')

  const cookies = useCookie()
  const { user } = useSession()
  const isLoggedInUser = user?.id

  const [query, setQuery] = useState(value)
  const [selectedSuggestion, setSelectedSuggestion] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const { fetchSuggestions, clearSuggestions, suggestions, displayedSuggestions } =
    useQuerySuggestions(query)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!query) return
    cookies.set(cookiesDataByName.help_center_search_session_id, uuid())

    navigateToPage(
      urlWithParams(HELP_SEARCH_URL, {
        search_text: query,
        access_channel: AccessChannel.HcSearch,
      }),
    )
  }

  const handleQuerySuggestions = useLatestCallback((queryString: string) => {
    if (trim(queryString).length > 2 && isAiHelpQuerySuggestionsAbTestEnabled && isLoggedInUser) {
      fetchSuggestions(queryString)
    }

    setQuery(queryString)
  })

  const handleOutsideClick = () => {
    setIsFocused(false)
  }

  useEffect(() => {
    if (!selectedSuggestion) return
    cookies.set(cookiesDataByName.help_center_search_session_id, uuid())

    navigateToPage(
      urlWithParams(HELP_SEARCH_URL, {
        search_text: selectedSuggestion,
        access_channel: AccessChannel.HcSearch,
      }),
    )
  }, [cookies, selectedSuggestion])

  useEffect(() => {
    handleQuerySuggestions(query)
  }, [handleQuerySuggestions, query])

  const renderSuggestionsDropdown = () => {
    if (!isLoggedInUser) return null
    if (!isAiHelpQuerySuggestionsAbTestEnabled) return null
    if (!isFocused) return null
    if (trim(query).length < 3) return null
    if (suggestions.length > 0) {
      if (helpCenterSessionId) {
        track(
          aiPoweredHelpSuggestionsDisplayed({
            helpCenterSessionId,
            query: trim(query),
            suggestions,
          }),
        )
      }

      return (
        <div className="u-ui-margin-top-large u-position-absolute u-zindex-large faq__ai_search-suggestions">
          <Card styling="lifted">
            <div className="u-overflow-hidden">
              <List noTrailingDivider size="tight">
                {displayedSuggestions.map((suggestion, index) => (
                  <Cell
                    key={index}
                    divider={index !== displayedSuggestions.length - 1}
                    clickable
                    onClick={() => {
                      let selection = suggestion
                      if (displayedSuggestions.length - 1 === index) selection = query
                      if (
                        helpCenterSessionId &&
                        isAiHelpQuerySuggestionsAbTestEnabled &&
                        isLoggedInUser
                      ) {
                        track(
                          aiPoweredHelpSuggestionClicked({
                            helpCenterSessionId,
                            selectedSuggestion: selection,
                            selectedSuggestionRank: index,
                          }),
                        )
                      }
                      setQuery(selection)
                      setSelectedSuggestion(selection)
                      setIsFocused(false)
                    }}
                  >
                    <Text
                      as="span"
                      theme="amplified"
                      text={suggestion}
                      html
                      highlight
                      highlightTheme="muted"
                    />
                  </Cell>
                ))}
              </List>
            </div>
          </Card>
        </div>
      )
    }

    return null
  }

  return (
    <OutsideClick onOutsideClick={handleOutsideClick}>
      <form onSubmit={handleSubmit}>
        <InputBar
          value={query}
          icon={<Icon name={isLoggedInUser ? AiSparkles16 : Search16} />}
          name="help-center-search"
          placeholder={translate('input_placeholder')}
          data-testId="help-center-new-search-text"
          onValueClear={() => {
            if (helpCenterSessionId && isAiHelpQuerySuggestionsAbTestEnabled && isLoggedInUser) {
              track(
                aiPoweredHelpClearButtonClicked({
                  helpCenterSessionId,
                  query,
                }),
              )
            }
            clearSuggestions()
            setQuery('')
          }}
          onChange={event => handleQuerySuggestions(event.currentTarget.value)}
          onFocus={() => setIsFocused(true)}
        />
        {renderSuggestionsDropdown()}
      </form>
    </OutsideClick>
  )
}

export default HelpCenterSearchInputNew
