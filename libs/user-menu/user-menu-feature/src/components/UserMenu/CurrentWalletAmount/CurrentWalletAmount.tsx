'use client'

import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Text } from '@vinted/web-ui'

import {
  getWalletBalance,
  transformWalletBalanceDto,
  WalletBalanceModel,
} from '@marketplace-web/wallet/wallet-data'
import { formatCurrencyAmount } from '@marketplace-web/currency/currency-data'
import { useSession } from '@marketplace-web/shared/session-data'

const CurrentWalletAmount = () => {
  const { locale } = useIntl()
  const { user } = useSession()

  const currentUserId = user?.id

  const [balance, setBalance] = useState<WalletBalanceModel | null>()

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUserId) return

      const response = await getWalletBalance(currentUserId)

      if ('errors' in response) return

      setBalance(transformWalletBalanceDto(response.user_balance))
    }

    fetchData()
  }, [currentUserId])

  if (!balance) return null

  const { availableAmount } = balance

  return <Text as="h4" type="caption" text={formatCurrencyAmount(availableAmount, locale)} />
}

export default CurrentWalletAmount
