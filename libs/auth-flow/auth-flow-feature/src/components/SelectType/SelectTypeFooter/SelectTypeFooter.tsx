'use client'

import { Button, Spacer, Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { KeyboardKey, onA11yKeyDown } from '@marketplace-web/vendor-abstractions/web-ui-util'
import { useAbTest, useTrackAbTestCallback } from '@marketplace-web/feature-flags/ab-tests-data'
import { useAuthModal } from '@marketplace-web/auth-flow/auth-modal-context-feature'
import { AuthView, useAuthenticationContext } from '@marketplace-web/auth-flow/auth-context-feature'
import { useAuthTracking } from '@marketplace-web/auth-flow/auth-tracking-feature'

const SelectTypeFooter = () => {
  const { authView, setAuthView, isAuthPage } = useAuthenticationContext()
  const isLoginView = authView === AuthView.SelectTypeLogin

  const selectType = isLoginView ? 'login' : 'register'
  const translate = useTranslate(`auth.select_type.${selectType}`)
  const actionsTranslate = useTranslate('auth.select_type.actions')
  const { trackClickEvent } = useAuthTracking()
  const { isBusinessAuth } = useAuthModal()

  const nonNativeAuthenticationRegistrationAbTest = useAbTest(
    'non_native_authentication_registration_v3',
  )
  const isNonNativeAuthRegistrationEnabled =
    nonNativeAuthenticationRegistrationAbTest?.variant === 'on' && !isBusinessAuth
  const nonNativeAuthenticationLoginAbTest = useAbTest('non_native_authentication_login_v3')
  const isNonNativeAuthLoginEnabled =
    nonNativeAuthenticationLoginAbTest?.variant === 'on' && !isBusinessAuth
  const trackAbTest = useTrackAbTestCallback()

  function handleSwitchContext() {
    if (isLoginView) {
      setAuthView(AuthView.SelectTypeRegister)
      trackClickEvent({ target: 'switch_to_registration' })

      return
    }

    setAuthView(AuthView.SelectTypeLogin)
    trackClickEvent({ target: 'switch_to_login' })
  }

  function proceedToEmailLogin() {
    setAuthView(AuthView.EmailLogin, { forcePageNavigation: isNonNativeAuthLoginEnabled })

    trackClickEvent({ target: 'switch_to_email_login' })
    trackAbTest(nonNativeAuthenticationLoginAbTest)
  }

  function proceedToEmailRegister() {
    setAuthView(AuthView.EmailRegister, { forcePageNavigation: isNonNativeAuthRegistrationEnabled })

    trackClickEvent({ target: 'switch_to_email_registration' })
    trackAbTest(nonNativeAuthenticationRegistrationAbTest)
  }

  function handleProceedLinkClick() {
    if (isLoginView) {
      proceedToEmailLogin()
    } else {
      proceedToEmailRegister()
    }
  }

  const renderEmailButton = () => {
    const testId = `auth-select-type--${selectType}-email`

    if (isAuthPage) {
      return (
        <Button theme="primary" styling="flat" onClick={handleProceedLinkClick} testId={testId}>
          {actionsTranslate('email')}
        </Button>
      )
    }

    return (
      <Text as="span" width="parent" alignment="center">
        {translate('actions.proceed.title')}
        <Spacer orientation="vertical" size="small" />
        <span
          role="button"
          onKeyDown={event =>
            onA11yKeyDown(event, { keys: [KeyboardKey.Enter, KeyboardKey.Space] })
          }
          className="u-cursor-pointer"
          tabIndex={0}
          onClick={handleProceedLinkClick}
          data-testid={testId}
        >
          <Text as="span" text={translate('actions.proceed.link')} theme="primary" underline />
        </span>
      </Text>
    )
  }

  return (
    <>
      {renderEmailButton()}
      <Spacer size={isAuthPage ? 'x2-large' : 'regular'} />
      <Text as="span" width="parent" alignment="center">
        {translate('actions.switch.title')}
        <Spacer orientation="vertical" size="small" />
        <span
          role="button"
          onClick={handleSwitchContext}
          onKeyDown={event =>
            onA11yKeyDown(event, { keys: [KeyboardKey.Enter, KeyboardKey.Space] })
          }
          className="u-cursor-pointer"
          tabIndex={0}
          data-testid={`auth-select-type--${selectType}-switch`}
        >
          <Text as="span" text={translate('actions.switch.link')} theme="primary" underline />
        </span>
      </Text>
    </>
  )
}

export default SelectTypeFooter
