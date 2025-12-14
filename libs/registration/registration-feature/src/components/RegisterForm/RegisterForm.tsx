'use client'

import { Button, Cell, Checkbox, InputText, Spacer, Text } from '@vinted/web-ui'
import { camelCase } from 'lodash'
import { ChangeEvent, ReactNode, useCallback, useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'

import { useSuccessUrl } from '@marketplace-web/auth-flow/success-url-feature'
import { useDataDomeCaptcha } from '@marketplace-web/bot-detection/data-dome-feature'
import { getGoogleRedirectUrl } from '@marketplace-web/authentication/socials-authentication-feature'
import { ErrorItem, ResponseError } from '@marketplace-web/core-api/api-client-util'
import {
  useBrowserNavigation,
  reloadPage,
  navigateToPage,
} from '@marketplace-web/browser/browser-navigation-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useFeatureSwitch } from '@marketplace-web/feature-flags/feature-switches-data'
import { useAbTest, useTrackAbTest } from '@marketplace-web/feature-flags/ab-tests-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useSystemConfiguration } from '@marketplace-web/shared/system-configuration-data'
import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'
import {
  renderValidation,
  useFormValidationMessage,
} from '@marketplace-web/vendor-abstractions/react-hook-form-feature'
import { normalizedQueryParam } from '@marketplace-web/browser/url-util'
import {
  clickEvent,
  RegisterUserResponse,
  validateUser,
} from '@marketplace-web/registration/registration-data'
import { useSession } from '@marketplace-web/shared/session-data'
import { ContentLoader } from '@marketplace-web/common-components/content-loader-ui'
import { useAuthModal } from '@marketplace-web/auth-flow/auth-modal-context-feature'
import { AuthView, useAuthenticationContext } from '@marketplace-web/auth-flow/auth-context-feature'
import { useAuthTracking, UserTarget } from '@marketplace-web/auth-flow/auth-tracking-feature'

import { NewsletterSubscription } from '../../constants'
import { isIdTokenInvalidError, isNetworkError, isTimeoutError } from '../../utils/errors'
import PasswordField from '../PasswordField'
import { Field } from './constants'
import { FormData } from './types'
import {
  validateEmail,
  validateLogin,
  validateLoginAsync,
  validatePasswordAsync,
  validateRealName,
  validateRealNameAsync,
  validateZipCodeAsync,
} from './utils'
import { FocusContainerProvider } from '../../containers/focus-container/FocusContainerProvider'
import { RevealOnFocus } from '../../containers/focus-container/consumers/RevealOnFocus'
import RegistrationTokenExpiredModal from '../RegistrationTokenExpiredModal'
import useRegistrationBehaviourTracking from '../../hooks/useRegistrationBehaviourTracking'
import UsernameSuggestion from '../UsernameSuggestion'
import {
  BUSINESS_TERMS_AND_CONDITIONS_URL,
  BUSINESS_TERMS_OF_SALE_URL,
  BUSINESS_TERMS_URL,
  IMPRESSUM_URL,
  PRIVACY_POLICY_URL,
  TERMS_URL,
} from '../../constants/routes'
import { isValueInObject } from '../../utils/object'

const TRANSLATION_PREFIX = 'auth.register'

const fieldToTrackingTargetMap = {
  [Field.RealName]: 'full_name',
  [Field.Login]: 'username',
  [Field.Email]: 'email',
  [Field.Password]: 'password',
  [Field.SubscribeToNewsletter]: 'newsletter_checkbox',
  [Field.AgreeRules]: 'policies_checkbox',
  [Field.ZipCode]: 'zip_code',
} satisfies Record<Field, UserTarget>

const clickableElementToTrackingActionDetailsMap = {
  terms_and_conditions: 'terms-and-conditions-link',
  privacy_policy: 'privacy-policy-link',
} as const

type Props = {
  realName?: string
  email?: string
  isPasswordRequired?: boolean
  onSubmit: (data: FormData) => Promise<ResponseError | RegisterUserResponse | null>
}

const RegisterForm = ({ realName, email, isPasswordRequired, onSubmit }: Props) => {
  const { searchParams, baseUrl } = useBrowserNavigation()
  const { track } = useTracking()
  const { isWebview } = useSession()
  const { authView, isAuthPage, resetAuthView } = useAuthenticationContext()

  const registerFormValidationsRemovalAbTest = useAbTest(
    'web_frontend_register_form_validations_removal',
  )
  useTrackAbTest(registerFormValidationsRemovalAbTest)

  const isFrontendValidationsDisabled = registerFormValidationsRemovalAbTest?.variant === 'on'

  const {
    trackRegistrationBehaviourSubmitSuccess,
    trackRegistrationBehaviourSubmitFailure,
    trackRegistrationBehaviourClick,
  } = useRegistrationBehaviourTracking()

  const { registrationRealNameRequired, newsletterSubscriptionType } =
    useSystemConfiguration() || {}
  const { isBusinessAuth } = useAuthModal()
  const isProTermsAndConditionsFSEnabled = useFeatureSwitch('pro_terms_and_conditions_enabled')
  const isNonNativeFlowEnabled = useFeatureSwitch('non_native_flow_pages')
  const isRegistrationTokenExpiredModalEnabled = useFeatureSwitch(
    'registration_token_expired_modal',
  )
  const zipCodeInRegistrationUsAbTest = useAbTest('us_zip_collection_registration_form')
  useTrackAbTest(zipCodeInRegistrationUsAbTest)

  const [baseError, setBaseError] = useState('')
  const [showRealNameField, setShowRealNameField] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTokenExpiredModalVisible, setIsTokenExpiredModalVisible] = useState(false)
  const [isSuggestedUsernameUsed, setIsSuggestedUsernameUsed] = useState(false)

  const state = normalizedQueryParam(searchParams.state)
  const stateUrl = getGoogleRedirectUrl(state, {
    clearVintedInAppParam: isNonNativeFlowEnabled,
    baseUrl,
  })
  const successUrl = useSuccessUrl(stateUrl)
  const { trackInputEvent, trackClickEvent } = useAuthTracking()

  const {
    setError,
    control,
    register,
    handleSubmit,
    getValues,
    formState: { isSubmitting, errors },
    setValue,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      realName,
    },
  })
  const getErrorMessage = useFormValidationMessage(errors, `${TRANSLATION_PREFIX}.fields`)
  const translate = useTranslate(TRANSLATION_PREFIX)
  const selectTypeTranslate = useTranslate('auth.select_type')
  const errorsTranslate = useTranslate('errors')
  const username = useWatch({ control, name: Field.Login })

  function trackLinkClick(target: UserTarget | undefined) {
    if (!target) return undefined

    return () => {
      trackRegistrationBehaviourClick({
        actionDetails: clickableElementToTrackingActionDetailsMap[target],
      })

      trackClickEvent({ target })
    }
  }

  function interpolateLink(url: string, eventTarget?: UserTarget) {
    return (part: Array<ReactNode>) => (
      <a
        key={url}
        href={url}
        target={isWebview ? undefined : '_blank'}
        rel="noopener noreferrer"
        onClick={trackLinkClick(eventTarget)}
      >
        {part}
      </a>
    )
  }

  const setErrors = useCallback(
    (newErrors: Array<ErrorItem>) => {
      let newBaseError = ''
      let hasFieldError = false

      newErrors.forEach(({ field, value }) => {
        const fieldName = camelCase(field)

        if (fieldName === Field.RealName) setShowRealNameField(true)
        if (fieldName === 'base') newBaseError ||= value
        if (!isValueInObject(fieldName, Field)) return

        hasFieldError = true
        setError(fieldName, { type: 'manual', message: value })
      })

      setBaseError(hasFieldError ? '' : newBaseError)
    },
    [setError],
  )

  async function handleFormSubmit(data: FormData) {
    const response = await onSubmit(data)

    if (!response) return

    if (isNetworkError(response)) {
      setBaseError(selectTypeTranslate('errors.offline'))

      return
    }

    if (isTimeoutError(response)) {
      setBaseError(errorsTranslate('generic'))
      setIsLoading(false)

      return
    }

    if (isIdTokenInvalidError(response)) {
      if (isRegistrationTokenExpiredModalEnabled) {
        setIsTokenExpiredModalVisible(true)
      } else {
        resetAuthView()
      }

      return
    }

    if ('errors' in response) {
      setErrors(response.errors)

      trackRegistrationBehaviourSubmitFailure()

      return
    }

    if (authView !== AuthView.EmailRegister) {
      const suggestedUsernameSubmissionTarget = {
        screen: 'complete_registration',
        target: 'submit_suggested_username',
        targetDetails: JSON.stringify({
          registered_username_same_as_suggested:
            isSuggestedUsernameUsed || 'username_not_suggested',
        }),
      } as const

      track(clickEvent(suggestedUsernameSubmissionTarget))
    }

    trackRegistrationBehaviourSubmitSuccess({ userId: response.user.id })

    navigateToPage(successUrl)
  }

  useDataDomeCaptcha(() => {
    const formData = getValues()

    if (!formData) return

    handleFormSubmit(formData)
  })

  const handleInputFocus = (target: string) => () => trackInputEvent({ target, state: 'focus' })

  const handleInputBlur = (target: string) => () => trackInputEvent({ target, state: 'unfocus' })

  const getInputEvents = (field: Field) => {
    const target = fieldToTrackingTargetMap[field]

    return {
      onFocus: handleInputFocus(target),
      onBlur: handleInputBlur(target),
    }
  }

  function handleCheckboxClick(
    field: Field.AgreeRules | Field.SubscribeToNewsletter,
    onChange: (isChecked: boolean) => void,
  ) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      trackClickEvent({
        target: fieldToTrackingTargetMap[field],
        targetDetails: event.target.checked ? 'checked' : 'unchecked',
      })

      onChange(event.target.checked)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === username) return

    setValue(Field.Login, suggestion, { shouldDirty: true, shouldValidate: true })

    const target = {
      screen: 'complete_registration',
      target: 'use_suggested_username',
    } as const

    track(clickEvent(target))
  }

  function handleSubmitButtonClick(event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) {
    if (isSubmitting) {
      event.preventDefault()

      return
    }

    const target =
      authView === AuthView.EmailRegister ? 'register_with_email' : 'register_with_social'

    trackClickEvent({ target })
  }

  function renderBaseError() {
    if (!baseError) return null

    return (
      <div className="u-ui-padding-horizontal-large u-ui-padding-top-large u-ui-padding-bottom-small">
        <Text as="span" text={baseError} theme="warning" width="parent" alignment="center" />
      </div>
    )
  }

  const renderHint = (hint: string, { revealOnFocus }: { revealOnFocus?: boolean } = {}) => {
    if (!revealOnFocus) return hint

    return <RevealOnFocus>{hint}</RevealOnFocus>
  }

  const handleRealNameValidation = (value: string | undefined) => {
    if (isFrontendValidationsDisabled) return validateRealNameAsync(value)

    if (!value) return undefined

    return validateRealName(value)
  }

  const handleLoginValidation = (value: string | undefined) => {
    if (isFrontendValidationsDisabled) return validateLoginAsync(value)

    if (!value) return undefined

    return validateLogin(value)
  }

  const handlePasswordValidation = (value: string | undefined) => {
    if (isFrontendValidationsDisabled) return validatePasswordAsync(value)

    if (!value) return undefined

    return validatePasswordAsync(value)
  }

  function renderRealNameField() {
    if (!registrationRealNameRequired && !showRealNameField) return null
    if (realName && !showRealNameField) {
      return <input {...register(Field.RealName)} type="hidden" value={realName} />
    }

    return (
      <FocusContainerProvider>
        <InputText
          {...register(Field.RealName, {
            required: !isFrontendValidationsDisabled,
            validate: handleRealNameValidation,
          })}
          placeholder={translate('fields.real_name.title')}
          validation={
            renderValidation(getErrorMessage(Field.RealName)) ||
            renderHint(translate('fields.real_name.hint'), { revealOnFocus: isAuthPage })
          }
          aria={{ 'aria-required': true }}
          {...getInputEvents(Field.RealName)}
        />
      </FocusContainerProvider>
    )
  }

  function renderEmailField() {
    if (email) return <input {...register(Field.Email)} type="hidden" value={email} />

    const error = getErrorMessage(Field.Email)

    return (
      <FocusContainerProvider>
        <InputText
          {...register(Field.Email, {
            required: !isFrontendValidationsDisabled,
            validate: isFrontendValidationsDisabled ? undefined : validateEmail,
          })}
          placeholder={translate('fields.email.title')}
          validation={
            error
              ? renderValidation(getErrorMessage(Field.Email))
              : renderHint(translate('fields.email.hint'), { revealOnFocus: isAuthPage })
          }
          aria={{ 'aria-required': true }}
          {...getInputEvents(Field.Email)}
        />
      </FocusContainerProvider>
    )
  }

  function translateTermsAndCondition(key: string) {
    return translate(key, {
      'terms-and-conditions': interpolateLink(TERMS_URL, 'terms_and_conditions'),
      'pro-terms-and-conditions': interpolateLink(BUSINESS_TERMS_AND_CONDITIONS_URL),
      'pro-terms-of-sale': interpolateLink(BUSINESS_TERMS_OF_SALE_URL),
      'pro-terms-of-use': interpolateLink(BUSINESS_TERMS_URL),
      'privacy-policy': interpolateLink(PRIVACY_POLICY_URL, 'privacy_policy'),
      impressum: interpolateLink(IMPRESSUM_URL),
    })
  }

  function renderTermsAndConditionsCheckbox() {
    const error = getErrorMessage(Field.AgreeRules)
    const businessTermsAndConditionsKey = isProTermsAndConditionsFSEnabled
      ? 'fields.agree_rules.business.title_pro_terms_and_conditions'
      : 'fields.agree_rules.business.title'

    const checkboxLabel = isBusinessAuth
      ? translateTermsAndCondition(businessTermsAndConditionsKey)
      : translateTermsAndCondition('fields.agree_rules.title')

    return (
      <>
        <Controller
          defaultValue={false}
          render={({ field: { name, value, onChange } }) => (
            <Checkbox
              name={name}
              text={checkboxLabel}
              checked={value}
              onChange={handleCheckboxClick(name, onChange)}
              testId="terms-and-conditions-checkbox"
            />
          )}
          rules={{
            required: true,
          }}
          name={Field.AgreeRules}
          control={control}
        />
        {error && <Spacer size="small" />}
        {renderValidation(error)}
      </>
    )
  }

  function renderFields() {
    return (
      <>
        {renderRealNameField()}
        <FocusContainerProvider>
          <InputText
            {...register(Field.Login, {
              required: !isFrontendValidationsDisabled,
              minLength: isFrontendValidationsDisabled ? undefined : 3,
              maxLength: isFrontendValidationsDisabled ? undefined : 20,
              validate: handleLoginValidation,
            })}
            placeholder={translate('fields.login.title')}
            validation={
              renderValidation(getErrorMessage(Field.Login)) ||
              renderHint(translate('fields.login.hint'), { revealOnFocus: isAuthPage })
            }
            aria={{ 'aria-required': true }}
            {...getInputEvents(Field.Login)}
          />
          <UsernameSuggestion
            username={username}
            realName={realName}
            onSuggestionClick={handleSuggestionClick}
            setIsSuggestedUsernameUsed={setIsSuggestedUsernameUsed}
          />
        </FocusContainerProvider>
        {renderEmailField()}
        {isPasswordRequired && (
          <FocusContainerProvider>
            <PasswordField
              {...register(Field.Password, {
                required: !isFrontendValidationsDisabled,
                validate: handlePasswordValidation,
              })}
              validation={
                renderValidation(getErrorMessage(Field.Password)) ||
                renderHint(translate('fields.password.hint'), { revealOnFocus: isAuthPage })
              }
              placeholder={translate('fields.password.title')}
              aria={{ 'aria-required': true }}
              {...getInputEvents(Field.Password)}
            />
          </FocusContainerProvider>
        )}
        {zipCodeInRegistrationUsAbTest?.variant === 'on' && (
          <InputText
            {...register(Field.ZipCode, {
              validate: value => (value ? validateZipCodeAsync(value) : undefined),
            })}
            placeholder={translate('fields.zip_code.title')}
            validation={
              renderValidation(getErrorMessage(Field.ZipCode)) ||
              renderHint(translate('fields.zip_code.hint'))
            }
            {...getInputEvents(Field.ZipCode)}
          />
        )}
        {isAuthPage && <Spacer size="large" />}
        <Cell>
          <SeparatedList separator={<Spacer size="large" />}>
            <Controller
              defaultValue={newsletterSubscriptionType === NewsletterSubscription.OptOut}
              render={({ field: { value, name, onChange } }) => (
                <Checkbox
                  name={name}
                  text={translate('fields.subscribe.title', {
                    // Only used for markets with a custom applied copy (e.g. Hungary)
                    'privacy-policy': interpolateLink(PRIVACY_POLICY_URL),
                  })}
                  checked={value}
                  onChange={handleCheckboxClick(name, onChange)}
                  testId="subscribe-newsletter-checkbox"
                />
              )}
              name={Field.SubscribeToNewsletter}
              control={control}
            />
            {renderTermsAndConditionsCheckbox()}
          </SeparatedList>
        </Cell>
      </>
    )
  }

  function renderFooter() {
    return (
      <Cell>
        <Button
          text={translate('actions.submit')}
          type="submit"
          styling="filled"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          onClick={handleSubmitButtonClick}
        />
        <Spacer />
      </Cell>
    )
  }

  useEffect(() => {
    if (!registrationRealNameRequired) return
    if (!realName) return

    async function handleValidateInitialUserData() {
      setIsLoading(true)

      const response = await validateUser({
        user: {
          real_name: realName,
        },
      })

      if ('errors' in response) {
        setErrors(response.errors)
      }

      setIsLoading(false)
    }

    handleValidateInitialUserData()
  }, [realName, setErrors, registrationRealNameRequired])

  if (isLoading) {
    return <ContentLoader />
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit, trackRegistrationBehaviourSubmitFailure)}>
        {renderBaseError()}
        {renderFields()}
        {renderFooter()}
      </form>
      <RegistrationTokenExpiredModal
        isVisible={isTokenExpiredModalVisible}
        onOkClick={reloadPage}
      />
    </>
  )
}

export default RegisterForm
