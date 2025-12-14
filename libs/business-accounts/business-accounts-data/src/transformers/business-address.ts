import { Response } from '@marketplace-web/core-api/api-client-util'

import {
  AddressDto,
  AddressModel,
  BusinessAccountAddressDto,
  BusinessAccountAddressesDto,
  BusinessAccountAddressesModel,
  BusinessAccountAddressesResp,
  SetBusinessAccountAddressesArgs,
} from '../types/business-address'

export const transformBusinessAccountAddressDto = (
  address: BusinessAccountAddressDto,
): AddressModel => {
  const { id, name, country_id, country_title_local, city, postal_code, line1, line2 } = address

  return {
    id,
    name,
    countryId: country_id,
    country: country_title_local || '',
    city,
    postalCode: postal_code,
    line1,
    line2,
  }
}

export const transformBusinessAccountAddressModel = (
  address: AddressModel,
): BusinessAccountAddressDto => {
  const { name, countryId, country, city, postalCode, line1, line2 } = address

  return {
    name: name || null,
    country_id: countryId || null,
    country_title_local: country,
    city: city || null,
    postal_code: postalCode || null,
    line1: line1 || null,
    line2: line2 || '',
  }
}

export const transformBusinessAccountAddressesDto = (
  addresses: BusinessAccountAddressesDto,
): BusinessAccountAddressesModel => {
  const { business_address, return_address } = addresses

  return {
    businessAddress: business_address && transformBusinessAccountAddressDto(business_address),
    returnAddress: return_address && transformBusinessAccountAddressDto(return_address),
    isUsingTheSameAddress: !return_address,
  }
}

export const transformBusinessAccountAddressesResponse = (
  response: Response<BusinessAccountAddressesResp>,
) => ({
  addresses: transformBusinessAccountAddressesDto(response.addresses),
})

export const setBusinessAccountAddressesArgsToParams = ({
  businessAddress,
  returnAddress,
}: Pick<
  SetBusinessAccountAddressesArgs,
  'businessAddress' | 'returnAddress'
>): BusinessAccountAddressesDto => ({
  business_address: businessAddress && transformBusinessAccountAddressModel(businessAddress),
  return_address: returnAddress && transformBusinessAccountAddressModel(returnAddress),
})

export const transformAddressDto = (address: AddressDto): AddressModel => ({
  id: address.id,
  countryId: address.country_id,
  name: address.name,
  country: address.country,
  city: address.city,
  line1: address.line1,
  line2: address.line2,
  postalCode: address.postal_code,
  state: address.state,
})
