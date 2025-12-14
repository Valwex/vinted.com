export enum TransactionSide {
  Buyer = 'buyer',
  Seller = 'seller',
}

export enum ApplicableTransactionAction {
  Offer = 'offer',
  Buy = 'buy',
  RequestOffer = 'request_offer',
  Transfer = 'transfer',
  Reserve = 'reserve',
  WaitingForShipment = 'waiting_for_shipment',
  LeaveFeedback = 'feedback',
}

export enum AdditionalTransactionAction {
  MarkAsSold = 'mark_as_sold',
  MarkAsReceived = 'mark_as_received',
  CanMarkAsReceived = 'can_mark_as_received',
  Bundle = 'bundle',
  UsePayments = 'use_payments',
  DeleteConversation = 'delete_thread',
  Cancel = 'cancel',
  ConfirmShipmentInstructions = 'confirm_shipment_instructions',
  ExtendShippingDeadline = 'extend_shipping_deadline',
  ChangeDeliveryOption = 'change_delivery_option',
}
