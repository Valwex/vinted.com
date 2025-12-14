import { api } from '@marketplace-web/core-api/core-api-client-util'

import { GetItemEscrowFeesResp } from '../types/escrow-fees'
import {
  GetPriceEstimateWithFeesResponse,
  GetPriceEstimateWithFeesArgs,
} from '../types/price-estimate-with-fees'

export const getItemEscrowFees = ({ itemId }: { itemId: number }) =>
  api.get<GetItemEscrowFeesResp>(`/items/${itemId}/escrow_fees`)

export const getTransactionEscrowFees = ({ transactionId }: { transactionId: number }) =>
  api.get<GetItemEscrowFeesResp>(`/transactions/${transactionId}/escrow_fees`)

export const getPriceEstimateWithFees = (args: GetPriceEstimateWithFeesArgs) =>
  api.post<GetPriceEstimateWithFeesResponse>('offer/estimate_with_fees', args)
