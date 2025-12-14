import { api } from '@marketplace-web/core-api/core-api-client-util'

import { RecentTransactionsResp } from '../types/recent-transaction'

const moneyObjectHeader = {
  'X-Money-Object': 'true',
}

export const getRecentTransactions = (count?: number) =>
  api.get<RecentTransactionsResp>('help_center/recent_transactions', {
    params: { count },
    headers: moneyObjectHeader,
  })
