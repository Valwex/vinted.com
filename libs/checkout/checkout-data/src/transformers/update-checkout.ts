import { UpdateSingleCheckoutArgs } from '../types/checkout'

export const updateSingleCheckoutDataArgsToParams = ({
  paymentMethod,
  additionalService,
  shippingPickupOptions,
  shippingPickupDetails,
  shippingAddress,
  itemPresentationEscrowV2,
}: UpdateSingleCheckoutArgs) => ({
  components: {
    item_presentation_escrow_v2: {
      items_to_remove: itemPresentationEscrowV2?.itemsToRemove,
    },
    additional_service: {
      is_selected: additionalService?.isSelected,
      type: additionalService?.type,
    },
    payment_method: {
      card_id: paymentMethod?.cardId,
      pay_in_method_id: paymentMethod?.methodId,
    },
    shipping_address: {
      user_id: shippingAddress?.userId,
      shipping_address_id: shippingAddress?.shippingAddressId,
    },
    shipping_pickup_options: {
      pickup_type: shippingPickupOptions?.pickupType,
    },
    shipping_pickup_details: {
      rate_uuid: shippingPickupDetails?.rateUuid,
      point_code: shippingPickupDetails?.pointCode,
      point_uuid: shippingPickupDetails?.pointUuid,
    },
  },
})
