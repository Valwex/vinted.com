'use client'

import { useEffect, useState } from 'react'
import { Checkmark48 } from '@vinted/monochrome-icons'
import { Button, Cell, Dialog, Icon, Spacer, Text } from '@vinted/web-ui'

import {
  getSessionStorageItem,
  removeSessionStorageItem,
} from '@marketplace-web/browser/browser-storage-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import {
  viewEvent,
  taxpayersClickEvent,
  taxpayersViewScreenEvent,
} from '@marketplace-web/taxpayers/taxpayers-data'

import { SPECIAL_VERIFICATION_SESSION_ID_KEY } from '../../pages/TaxpayersSpecialVerificationForm/constants'

const TaxpayersSpecialVerificationSuccessModal = () => {
  const translate = useTranslate('taxpayer_special_verification.success_modal')
  const { track } = useTracking()

  const specialVerificationSessionId = getSessionStorageItem(SPECIAL_VERIFICATION_SESSION_ID_KEY)

  const [show, setShow] = useState(!!specialVerificationSessionId)

  useEffect(() => {
    if (!show) return

    track(
      viewEvent({
        screen: 'taxpayers_special_verification_success',
        target: 'verification_completed',
        targetDetails: JSON.stringify({ verification_id: specialVerificationSessionId }),
      }),
    )
    track(
      taxpayersViewScreenEvent({
        screen: 'taxpayers_special_verification_success',
        details: null,
      }),
    )

    removeSessionStorageItem(SPECIAL_VERIFICATION_SESSION_ID_KEY)
  }, [show, specialVerificationSessionId, track])

  const handleClose = () => {
    track(
      taxpayersClickEvent({
        target_name: 'finish_special_verification',
        target: 'button',
        target_details: null,
        screen: 'taxpayers_special_verification_success',
      }),
    )

    setShow(false)
  }

  const renderHeader = () => {
    return (
      <>
        <Spacer size="x-large" />
        <Icon name={Checkmark48} color="success-default" />
      </>
    )
  }

  const renderBody = () => {
    return (
      <>
        <Text as="h1" alignment="center" type="heading" text={translate('title')} />
        <Spacer size="large" />
        <Text as="span" alignment="center" type="body" text={translate('body')} />
      </>
    )
  }

  const renderFooter = () => {
    return (
      <>
        <Spacer size="large" />
        <Button
          styling="filled"
          text={translate('actions.finish')}
          testId="special-verification-finish-button"
          onClick={handleClose}
        />
      </>
    )
  }

  return (
    <Dialog show={show} className="u-text-center">
      {renderHeader()}
      <Cell>
        {renderBody()}
        {renderFooter()}
      </Cell>
    </Dialog>
  )
}

export default TaxpayersSpecialVerificationSuccessModal
