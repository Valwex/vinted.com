'use client'

import { Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

import { SERVICE_FEE_HELP_URL, SERVICE_FEE_PRO_HELP_URL } from '../../../constants/routes'

type Props = {
  translationsPrefix:
    | 'buyer_protection_dialog.buyer_protection_info_business'
    | 'buyer_protection_dialog.buyer_protection_info'
  onServiceFeeHelpUrlClick?: () => void
  sellerIsBusinessUser?: boolean
}

const ServiceFeeLink = ({
  translationsPrefix,
  onServiceFeeHelpUrlClick,
  sellerIsBusinessUser,
}: Props) => {
  const translate = useTranslate(translationsPrefix)
  const serviceFeeHelpUrl = sellerIsBusinessUser ? SERVICE_FEE_PRO_HELP_URL : SERVICE_FEE_HELP_URL

  const handleServiceFeeHelpUrlClick = () => {
    onServiceFeeHelpUrlClick?.()
  }

  return (
    <a
      href={serviceFeeHelpUrl}
      target="_blank"
      rel="noreferrer"
      data-testid="service-fee-help-link"
      onClick={handleServiceFeeHelpUrlClick}
    >
      <Text
        text={translate('service_fee_link_title')}
        clickable
        alignment="center"
        type="subtitle"
        as="p"
      />
    </a>
  )
}

export default ServiceFeeLink
