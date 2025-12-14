'use client'

import { useCallback, useEffect, useState } from 'react'
import { Chip, Spacer, Text } from '@vinted/web-ui'

import { KeyboardKey, onA11yKeyDown } from '@marketplace-web/vendor-abstractions/web-ui-util'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { getUsernameSuggestion } from '@marketplace-web/registration/registration-data'

const TRANSLATION_PREFIX = 'auth.register.fields.login'
const USERNAME_SUGGESTION_REAL_NAME_MIN_LENGTH = 3

type Props = {
  username: string | undefined
  realName: string | undefined
  onSuggestionClick: (suggestion: string) => void
  setIsSuggestedUsernameUsed: (isUsed: boolean) => void
}

const UsernameSuggestion = ({
  username,
  realName,
  onSuggestionClick,
  setIsSuggestedUsernameUsed,
}: Props) => {
  const translate = useTranslate(TRANSLATION_PREFIX)

  const [suggestions, setSuggestions] = useState<Array<string>>([])

  const isRealNameValidForSuggestion =
    (realName?.replace(/\s/g, '').length ?? 0) >= USERNAME_SUGGESTION_REAL_NAME_MIN_LENGTH

  const getUsernameSuggestionApiTrigger = useCallback(async () => {
    if (!realName || suggestions.length) return

    const response = await getUsernameSuggestion(realName, ['personalised_second'])

    if ('errors' in response) return
    setSuggestions(Array.isArray(response.username) ? response.username : [response.username])
  }, [realName, suggestions])

  useEffect(() => {
    if (!isRealNameValidForSuggestion) {
      return
    }

    getUsernameSuggestionApiTrigger()
  }, [isRealNameValidForSuggestion, getUsernameSuggestionApiTrigger])

  useEffect(() => {
    if (!username || !suggestions.length) {
      return
    }

    setIsSuggestedUsernameUsed(suggestions.includes(username))
  }, [username, suggestions, setIsSuggestedUsernameUsed])

  if (!suggestions.length || !isRealNameValidForSuggestion) return null

  return (
    <div className="u-ui-padding-horizontal-large">
      <Text
        as="span"
        type="caption"
        text={translate('username_suggestion_ab_test')}
        theme="amplified"
      />
      <span>
        <Spacer orientation="vertical" size="small" />
        {suggestions.map(suggestion => (
          <span
            key={suggestion}
            role="button"
            tabIndex={0}
            onKeyDown={event =>
              onA11yKeyDown(event, { keys: [KeyboardKey.Enter, KeyboardKey.Space] })
            }
          >
            <Spacer orientation="vertical" size="small" />
            <Chip
              text={suggestion}
              radius="round"
              type="button"
              textType="subtitle"
              activated={username === suggestion}
              onClick={() => onSuggestionClick(suggestion)}
              testId="username-suggestion-chip"
            />
          </span>
        ))}
      </span>
      <Spacer size="medium" />
    </div>
  )
}

export default UsernameSuggestion
