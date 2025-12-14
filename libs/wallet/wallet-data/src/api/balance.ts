import { api } from '@marketplace-web/core-api/core-api-client-util'

import { WalletBalanceResponse } from '../types/wallet'
import { moneyObjectHeader } from './money-object-header'

export const getWalletBalance = (userId: number) =>
  api.get<WalletBalanceResponse>(`users/${userId}/balance`, { headers: moneyObjectHeader })
