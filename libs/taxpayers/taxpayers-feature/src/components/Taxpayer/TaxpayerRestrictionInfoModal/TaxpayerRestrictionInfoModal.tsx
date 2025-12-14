'use client'

import { useEffect, useState } from 'react'
import { Button, Cell, Divider, Dialog, Navigation, Spacer, Text } from '@vinted/web-ui'
import { X16 } from '@vinted/monochrome-icons'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'
import {
  dismissTaxpayerRestrictionModal,
  getTaxpayerNavigationInfo,
  taxpayersClickEvent,
  taxpayersViewEvent,
} from '@marketplace-web/taxpayers/taxpayers-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useRefUrl } from '@marketplace-web/ref-url/ref-url-feature'

import { getIsUserBusiness } from '../../../utils/taxpayer'
import {
  TAXPAYER_CENTER_URL_WITH_REF,
  TAXPAYER_EDUCATION_URL_WITH_REF,
  TAXPAYER_FORM_URL_WITH_REF,
} from '../../../constants/routes'

type Props = {
  show: boolean
  isSellingBlocked: boolean
  screen?: string
  onClose: () => void
}

const TaxpayerRestrictionInfoModal = ({ show, isSellingBlocked, screen, onClose }: Props) => {
  const translate = useTranslate('taxpayer_restriction_info_modal')
  const { track } = useTracking()
  const refUrl = useRefUrl()

  const [isTaxpayerNavigationLoading, setIsTaxpayerNavigationLoading] = useState(false)

  const title = isSellingBlocked
    ? translate('selling_blocked.title')
    : translate('restricted.title')
  const body = isSellingBlocked ? translate('selling_blocked.body') : translate('restricted.body')

  useEffect(() => {
    if (!show || !screen) return

    track(
      taxpayersViewEvent({
        screen,
        target: 'block_modal',
        target_details: isSellingBlocked ? 'sales' : 'balance',
      }),
    )
  }, [track, show, isSellingBlocked, screen])

  const handleFinaliseReport = () => {
    if (screen) {
      track(
        taxpayersClickEvent({
          screen,
          target: 'block_modal',
          target_details: 'finalise',
          target_name: isSellingBlocked ? 'sales' : 'balance',
        }),
      )
    }

    dismissTaxpayerRestrictionModal()
    navigateToPage(TAXPAYER_FORM_URL_WITH_REF(refUrl))
  }

  const handleLearnMore = async () => {
    if (screen) {
      track(
        taxpayersClickEvent({
          screen,
          target: 'block_modal',
          target_details: 'learn',
          target_name: isSellingBlocked ? 'sales' : 'balance',
        }),
      )
    }

    dismissTaxpayerRestrictionModal()
    setIsTaxpayerNavigationLoading(true)

    const response = await getTaxpayerNavigationInfo()

    if ('errors' in response) {
      setIsTaxpayerNavigationLoading(false)

      return
    }

    const isUserBusiness = getIsUserBusiness(response.user_type)

    if (isUserBusiness) {
      navigateToPage(TAXPAYER_EDUCATION_URL_WITH_REF(refUrl))
    } else {
      navigateToPage(TAXPAYER_CENTER_URL_WITH_REF(refUrl))
    }
  }

  const handleClose = () => {
    if (screen) {
      track(
        taxpayersClickEvent({
          screen,
          target: 'block_modal',
          target_details: 'close',
          target_name: isSellingBlocked ? 'sales' : 'balance',
        }),
      )
    }

    onClose()
  }

  return (
    <Dialog
      show={show}
      className="u-flexbox u-flex-direction-column"
      testId="taxpayer-restriction-modal"
    >
      <Navigation
        right={
          <Button
            styling="flat"
            onClick={handleClose}
            testId="taxpayer-restriction-modal-close"
            iconName={X16}
            inline
          />
        }
      />
      <Divider />
      <Cell>
        <div className="u-flexbox u-justify-content-center">
          <Text as="h1" type="heading" text={title} alignment="center" />
        </div>
        <Spacer size="large" />
        <Text as="span" type="body" text={body} />
        <Spacer size="x-large" />
        <Button
          styling="filled"
          text={translate('actions.finalise')}
          onClick={handleFinaliseReport}
        />
        <Spacer size="large" />
        <Button
          styling="flat"
          text={translate('actions.learn_more')}
          onClick={handleLearnMore}
          isLoading={isTaxpayerNavigationLoading}
        />
      </Cell>
    </Dialog>
  )
}

export default TaxpayerRestrictionInfoModal
