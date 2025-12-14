'use client'

import { useContext } from 'react'
import { Card, Cell, Icon, Spacer } from '@vinted/web-ui'
import { WarningCircleFilled24 } from '@vinted/monochrome-icons'

import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'
import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { HttpStatus } from '@marketplace-web/core-api/api-client-util'

import { EmailCodeView } from '../../constants'
import Context from './EmailVerificationCodeContext'
import EnterCode from './EnterCode'
import NotReceiveEmail from './NotReceiveEmail'

const componentByEmailCodeView: Record<EmailCodeView, () => JSX.Element> = {
  [EmailCodeView.EnterCode]: EnterCode,
  [EmailCodeView.NotReceiveEmail]: NotReceiveEmail,
}

const Content = () => {
  const breakpoint = useBreakpoint()
  const translate = useTranslate()
  const { error } = useContext(Context)
  const { view: viewParam } = useBrowserNavigation().searchParams
  const view = typeof viewParam === 'string' ? viewParam : EmailCodeView.EnterCode

  const isTooManyRequestsError = error?.status === HttpStatus.TooManyRequests
  const isPhonesOrTablets = breakpoint.tablets || breakpoint.phones
  const Component = componentByEmailCodeView[view]

  const renderContent = () => {
    if (isPhonesOrTablets) {
      return (
        <>
          {!isTooManyRequestsError && <Spacer size="regular" />}
          <Component />
        </>
      )
    }

    return (
      <>
        {!isTooManyRequestsError && <Spacer size="x4-large" />}
        <Component />
        <Spacer size="x5-large" />
      </>
    )
  }

  const renderErrorMessage = () => {
    if (!isTooManyRequestsError) return null

    return (
      <>
        <Card>
          <Cell
            prefix={<Icon name={WarningCircleFilled24} color="warning-default" />}
            body={translate('email_verification_code.errors.too_many_requests.body')}
          />
        </Card>
        <Spacer size="x-large" />
      </>
    )
  }

  return (
    <>
      {renderErrorMessage()}
      <div className="auth__container">{renderContent()}</div>
    </>
  )
}

export default Content
