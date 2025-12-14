import { WalletBalanceDto, WalletBalanceModel } from '../types/wallet'
import { transformCurrencyAmountDto } from './currency'

export const transformWalletBalanceDto = ({
  available_amount,
  escrow_amount,
}: WalletBalanceDto): WalletBalanceModel => ({
  pendingAmount: transformCurrencyAmountDto(escrow_amount),
  availableAmount: transformCurrencyAmountDto(available_amount),
})
