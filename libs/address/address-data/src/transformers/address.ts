import { Response } from '@marketplace-web/core-api/api-client-util'

import { AddressEntryType } from '../constants'
import {
  AddressDto,
  AddressModel,
  AddShippingAddressArgs,
  AddShippingOrderAddressArgs,
  AddUserAddressArgs,
  DefaultShippingAddressResp,
  NewAddressDto,
} from '../types/address'

export const transformAddress = (address: AddressDto): AddressModel => ({
  id: address.id,
  userId: address.user_id,
  entryType: address.entry_type,
  countryId: address.country_id,
  isDefault: address.is_default === 1,
  isDeleted: address.is_deleted,
  isComplete: address.is_complete,
  cityId: address.city_id,
  name: address.name,
  createdAt: address.created_at,
  country: address.country,
  city: address.city,
  updatedAt: address.updated_at,
  externalCode: address.external_code,
  latitude: address.latitude,
  line1: address.line1,
  line2: address.line2,
  longitude: address.longitude,
  postalCode: address.postal_code,
  state: address.state,
  formattedAddress: address.formatted_address,
  countryIsoCode: address.country_iso_code,
})

export const transformAddressModelToDto = (address: AddressModel): NewAddressDto => ({
  entry_type: address.entryType || AddressEntryType.Shipping,
  name: address.name || null,
  country_id: address.countryId || null,
  country: address.country || null,
  city: address.city || null,
  line1: address.line1 || null,
  line2: address.line2 || null,
  postal_code: address.postalCode || null,
  state: address.state || null,
})

export const addShippingAddressArgsToParams = ({ address }: AddShippingAddressArgs) => ({
  entry_type: AddressEntryType.Shipping,
  country_id: address.countryId,
  name: address.name,
  country: address.country,
  city: address.city,
  line1: address.line1,
  line2: address.line2,
  postal_code: address.postalCode,
})

export const addShippingOrderAddressArgsToParams = ({
  addressId,
}: AddShippingOrderAddressArgs) => ({
  address_id: addressId,
})

export const addUserAddressArgsToParams = ({
  address,
  isSingleCheckout,
  skipShippingCallback,
}: AddUserAddressArgs) => ({
  user_address: transformAddressModelToDto(address),
  is_single_checkout: isSingleCheckout,
  skip_shipping_callback: skipShippingCallback,
})

export const transformDefaultShippingAddress = ({
  user_address,
}: Response<DefaultShippingAddressResp>) => {
  if (!user_address) return null

  return transformAddress(user_address)
}
