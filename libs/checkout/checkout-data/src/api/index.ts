import { api } from '@marketplace-web/core-api/core-api-client-util'

import {
  GetUserBuyCountResp,
  InitiateSingleCheckoutArgs,
  SingleCheckoutResp,
  UpdateSingleCheckoutArgs,
} from '../types/checkout'
import { updateSingleCheckoutDataArgsToParams } from '../transformers/update-checkout'

export const initiateSingleCheckout = (
  { id, type }: InitiateSingleCheckoutArgs,
  config: { headers: Record<string, string> },
) =>
  api.post<SingleCheckoutResp>(
    '/purchases/checkout/build',
    {
      purchase_items: [{ id: Number(id), type }],
    },
    config,
  )

export const refreshSingleCheckoutPurchase = (id: string) =>
  api.put<SingleCheckoutResp>(`/purchases/${id}/checkout`, { components: [] })

export const updateSingleCheckoutData = (id: string, args: UpdateSingleCheckoutArgs | undefined) =>
  api.put<SingleCheckoutResp>(
    `/purchases/${id}/checkout`,
    args && updateSingleCheckoutDataArgsToParams(args),
  )

export const getUserBuyCount = () =>
  api.get<GetUserBuyCountResp>('/tracker_attributes', {
    params: {
      type: 'buy_debit_transactions',
    },
  })
