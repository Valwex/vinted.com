'use client'

import { Lock24, Money24, SpeechBubble24 } from '@vinted/monochrome-icons'

import useRefundPolicyLinks from './useRefundPolicyLinks'

type Props = {
  sellerIsBusinessUser?: boolean
  onRefundPolicyClick?: () => void
  onRefundPolicyProClick?: () => void
  onRefundPolicyProWithdrawalClick?: () => void
}

const useContentRows = ({
  sellerIsBusinessUser,
  onRefundPolicyClick,
  onRefundPolicyProClick,
  onRefundPolicyProWithdrawalClick,
}: Props) => {
  const { refundPolicyLink, refundAssistenceProLinks } = useRefundPolicyLinks({
    onRefundPolicyClick,
    onRefundPolicyProClick,
    onRefundPolicyProWithdrawalClick,
  })

  const proContentRows = [
    {
      translationId: 'refund_assistence',
      iconName: Money24,
      translationValue: refundAssistenceProLinks,
    },
    {
      translationId: 'secure_transactions',
      iconName: Lock24,
    },
    {
      translationId: 'full_support',
      iconName: SpeechBubble24,
    },
  ]

  const defaultContentRows = [
    {
      translationId: 'refund_updated',
      iconName: Money24,
      translationValue: refundPolicyLink,
    },
    {
      translationId: 'secure_transactions',
      iconName: Lock24,
    },
    {
      translationId: 'full_support_updated',
      iconName: SpeechBubble24,
    },
  ]

  return sellerIsBusinessUser ? proContentRows : defaultContentRows
}

export default useContentRows
