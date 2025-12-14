'use client'

import { Button, Cell, Dialog, Spacer, Text } from '@vinted/web-ui'

import { useRefUrl } from '@marketplace-web/ref-url/ref-url-feature'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'

import { TAXPAYER_FORM_URL_WITH_REF } from '../../../constants/routes'

type Props = {
  show: boolean
  onClose: () => void
}

const TaxpayerFillFormModal = ({ show, onClose }: Props) => {
  const translate = useTranslate('taxpayer_fill_form_modal')
  const refUrl = useRefUrl()

  const handleFillForm = () => navigateToPage(TAXPAYER_FORM_URL_WITH_REF(refUrl))

  const handleClose = () => onClose()

  return (
    <Dialog show={show} testId="taxpayer-fill-form-modal">
      <Cell>
        <div className="u-flexbox u-flex-direction-column u-align-items-center">
          <Text as="h1" type="heading" text={translate('title')} alignment="center" />
          <Spacer />
          <Text as="span" text={translate('body')} />
          <Spacer size="x2-large" />
          <Button text={translate('actions.primary')} onClick={handleFillForm} styling="filled" />
          <Spacer />
          <Button text={translate('actions.secondary')} styling="flat" onClick={handleClose} />
        </div>
      </Cell>
    </Dialog>
  )
}

export default TaxpayerFillFormModal
