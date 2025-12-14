'use client'

import { clickEvent } from '@marketplace-web/escrow-pricing/escrow-pricing-data'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'

import {
  HELP_REFUND_POLICY,
  HELP_REFUND_POLICY_PRO,
  HELP_RIGHT_OF_WITHDRAWAL_PRO,
} from '../../../constants/routes'

type Props = {
  onRefundPolicyClick?: () => void
  onRefundPolicyProClick?: () => void
  onRefundPolicyProWithdrawalClick?: () => void
}

const usePolicyLinks = ({
  onRefundPolicyProClick,
  onRefundPolicyProWithdrawalClick,
  onRefundPolicyClick,
}: Props) => {
  const { track } = useTracking()

  const handleRefundPolicyProClick = () => {
    track(
      clickEvent({
        screen: 'escrow_fee_education',
        target: 'refund_policy_link',
      }),
    )

    onRefundPolicyProClick?.()
  }

  const handleRefundPolicyWithdrawalClick = () => {
    onRefundPolicyProWithdrawalClick?.()
  }

  const handleRefundPolicyClick = () => {
    track(
      clickEvent({
        screen: 'escrow_fee_education',
        target: 'refund_policy_link',
      }),
    )

    onRefundPolicyClick?.()
  }

  const refundPolicyLink = {
    'refund-policy-link': (chunks: string) => (
      // Disabling: to maintain the same referral policy as if it was hardcoded relative link
      // eslint-disable-next-line react/jsx-no-target-blank
      <a
        href={HELP_REFUND_POLICY}
        target="_blank"
        onClick={handleRefundPolicyClick}
        data-testid="refund-policy-link"
      >
        {chunks}
      </a>
    ),
  }

  const refundAssistenceProLinks = {
    'right-of-withdrawal-link': (chunks: string) => (
      <a
        href={HELP_RIGHT_OF_WITHDRAWAL_PRO}
        target="_blank"
        data-testid="right-of-withdrawal-link-pro"
        rel="noopener noreferrer"
        onClick={handleRefundPolicyWithdrawalClick}
      >
        {chunks}
      </a>
    ),
    'pro-refund-policy-link': (chunks: string) => (
      <a
        href={HELP_REFUND_POLICY_PRO}
        onClick={handleRefundPolicyProClick}
        target="_blank"
        data-testid="pro-refund-policy-link"
        rel="noopener noreferrer"
      >
        {chunks}
      </a>
    ),
  }

  return {
    refundPolicyLink,
    refundAssistenceProLinks,
  }
}

export default usePolicyLinks
