'use client'

import { Spacer, Text } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { SeparatedList } from '@marketplace-web/common-components/separated-list-ui'
import { ScrollableArea } from '@marketplace-web/common-components/scrollable-area-ui'

import ContentRow from '../ContentRow'
import ServiceFeeLink from '../ServiceFeeLink'
import BuyerProtectionIcon from '../BuyerProtectionIcon'
import useContentRows from '../hooks/useContentRows'

type Props = {
  translationsPrefix:
    | 'buyer_protection_dialog.buyer_protection_info_business'
    | 'buyer_protection_dialog.buyer_protection_info'
  sellerIsBusinessUser?: boolean
  onRefundPolicyClick?: () => void
  onRefundPolicyProClick?: () => void
  onRefundPolicyProWithdrawalClick?: () => void
  onServiceFeeHelpUrlClick?: () => void
}

const ScrollableContentArea = ({
  translationsPrefix,
  sellerIsBusinessUser,
  onRefundPolicyClick,
  onRefundPolicyProClick,
  onRefundPolicyProWithdrawalClick,
  onServiceFeeHelpUrlClick,
}: Props) => {
  const contentRows = useContentRows({
    onRefundPolicyClick,
    onRefundPolicyProClick,
    onRefundPolicyProWithdrawalClick,
    sellerIsBusinessUser,
  })

  const translate = useTranslate(translationsPrefix)

  return (
    <ScrollableArea>
      <div className="u-ui-padding-horizontal-x2-large" data-testid="service-fee-modal-content">
        <div className="u-text-center">
          <BuyerProtectionIcon sellerIsBusinessUser={sellerIsBusinessUser} />
          <Spacer size="large" />
          <Text as="h1" text={translate('title')} type="heading" />
          <ServiceFeeLink
            sellerIsBusinessUser={sellerIsBusinessUser}
            translationsPrefix={translationsPrefix}
            onServiceFeeHelpUrlClick={onServiceFeeHelpUrlClick}
          />
        </div>
        <div className="u-ui-padding-vertical-x-large">
          <SeparatedList separator={<Spacer size="x-large" />}>
            {contentRows.map(row => (
              <ContentRow
                {...row}
                key={row.translationId}
                translationsPrefix={translationsPrefix}
              />
            ))}
          </SeparatedList>
        </div>
      </div>
    </ScrollableArea>
  )
}

export default ScrollableContentArea
