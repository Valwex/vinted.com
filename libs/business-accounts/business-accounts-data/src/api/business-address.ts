import { api } from '@marketplace-web/core-api/core-api-client-util'

import {
  BusinessAccountAddressesResp,
  BusinessAddressDto,
  BusinessUboAddressResp,
  GetBusinessAccountAddressesArgs,
  SetBusinessAccountAddressesArgs,
} from '../types/business-address'
import { setBusinessAccountAddressesArgsToParams } from '../transformers/business-address'

export const validateBusinessUboAddress = (business_ubo_address: BusinessAddressDto) =>
  api.post<BusinessUboAddressResp>('/user_addresses/validate_business_ubo_address', {
    business_ubo_address,
  })

export const setBusinessAccountAddresses = ({
  businessAccountId,
  ...args
}: SetBusinessAccountAddressesArgs) =>
  api.post<BusinessAccountAddressesResp>(
    `/business_accounts/${businessAccountId}/addresses`,
    setBusinessAccountAddressesArgsToParams(args),
  )

export const getBusinessAccountAddresses = ({
  businessAccountId,
}: GetBusinessAccountAddressesArgs) =>
  api.get<BusinessAccountAddressesResp>(`/business_accounts/${businessAccountId}/addresses`)
