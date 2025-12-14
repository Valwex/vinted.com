'use client'

import { Button, Container, Spacer } from '@vinted/web-ui'

import { useAuthModal } from '@marketplace-web/auth-flow/auth-modal-context-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'
import { urlWithParams } from '@marketplace-web/browser/url-util'
import { clickEvent } from '@marketplace-web/catalog/catalog-navigation-data'
import { AccessChannel } from '@marketplace-web/help-center/help-center-faq-entry-url-data'

import { HELP_FAQ_ENTRIES_URL, ITEM_UPLOAD_URL } from '../../../constants/routes'

type Props = {
  isLoggedIn: boolean
}

const LoginSection = ({ isLoggedIn }: Props) => {
  const translate = useTranslate('header.side_bar')
  const { track } = useTracking()
  const { openAuthModal } = useAuthModal()

  const handleModalOpen = () => {
    openAuthModal()
    const trakingEvent = clickEvent({
      target: 'login',
    })

    track(trakingEvent)
  }

  const handleSellNow = () => {
    const trakingEvent = clickEvent({
      target: 'upload_item',
    })

    track(trakingEvent)
  }

  return (
    <Container>
      <SeparatedList separator={<Spacer />}>
        <Button
          text={translate('sell_now')}
          styling="filled"
          url={ITEM_UPLOAD_URL}
          onClick={handleSellNow}
          testId="side-bar-sell-btn"
        />
        {!isLoggedIn && (
          <Button
            text={translate('sign_in')}
            onClick={handleModalOpen}
            testId="side-bar-signin-btn"
          />
        )}
        <Button
          text={translate('guide')}
          styling="flat"
          testId="side-bar-guide-btn"
          url={urlWithParams(HELP_FAQ_ENTRIES_URL, {
            access_channel: AccessChannel.Profile,
          })}
        />
      </SeparatedList>
    </Container>
  )
}

export default LoginSection
