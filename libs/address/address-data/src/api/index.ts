import { isNil, omitBy } from 'lodash'

import { api } from '@marketplace-web/core-api/core-api-client-util'

import { ApiResponse } from '@marketplace-web/core-api/api-client-util'

import {
  AddShippingAddressArgs,
  AddShippingOrderAddressArgs,
  AddUserAddressArgs,
  AddUserAddressesMissingInfoArgs,
  DefaultShippingAddressResp,
  GetTaxAddressResp,
  SaveTransactionShippingContactArgs,
  UserAddressResp,
} from '../types/address'
import {
  addShippingAddressArgsToParams,
  addShippingOrderAddressArgsToParams,
  addUserAddressArgsToParams,
} from '../transformers/address'
import { PostCodeArgs, PostCodeResponse } from '../types/postal-code'

export const addShippingAddress = (args: AddShippingAddressArgs) =>
  api.post<UserAddressResp>(`/transactions/${args.transactionId}/shipping_destination`, {
    user_address: addShippingAddressArgsToParams(args),
  })

export const addShippingOrderAddress = (args: AddShippingOrderAddressArgs) =>
  api.post(`/shipping_orders/${args.shippingOrderId}/shipping_address`, {
    ...addShippingOrderAddressArgsToParams(args),
  })

export const deleteTransactionShippingContact = (transactionId: number) =>
  api.delete<ApiResponse>(`/transactions/${transactionId}/shipping_contact`)

export const getTaxAddress = () => api.get<GetTaxAddressResp>('/user_addresses/missing_info')

export const addUserAddressesMissingInfo = (user_address: AddUserAddressesMissingInfoArgs) =>
  api.post<UserAddressResp>('/user_addresses/missing_info', {
    user_address,
  })

export const saveTransactionShippingContact = (args: SaveTransactionShippingContactArgs) =>
  api.post<ApiResponse>(`/transactions/${args.transactionId}/shipping_contact`, {
    save_for_later: args.saveForLater,
    shipping_contact: omitBy(
      {
        buyer_phone_number: args.buyerPhoneNumber,
        seller_phone_number: args.sellerPhoneNumber,
      },
      isNil,
    ),
  })

export const getDefaultShippingAddress = ({ prefill }: { prefill?: boolean } = {}) =>
  api.get<DefaultShippingAddressResp>('/user_addresses/default_shipping_address', {
    params: {
      prefill,
    },
  })

export const addAddress = (args: AddUserAddressArgs) =>
  api.post<UserAddressResp>('/user_addresses', {
    ...addUserAddressArgsToParams(args),
  })

export const getDefaultBillingAddress = () =>
  api.get<UserAddressResp>('/user_addresses/default_billing_address')

export const getPostalCodeConfiguration = ({ code, countryId }: PostCodeArgs) =>
  api.get<PostCodeResponse>(`postal_codes/${code}`, {
    params: {
      country_id: countryId,
    },
  })
