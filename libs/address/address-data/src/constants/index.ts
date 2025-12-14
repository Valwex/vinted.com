export enum AddressEntryType {
  None = 0,
  Shipping = 1,
  Billing = 2,
}

export enum AddressFormType {
  CheckoutAddress = 'checkout_address',
  GenerateLabelAddress = 'generate_label_address',
  SingleCheckoutAddress = 'single_checkout_address',
}

export enum AddressField {
  Country = 'country',
  Name = 'name',
  Line1 = 'line1',
  Line2 = 'line2',
  PostalCode = 'postal_code',
  City = 'city',
}

export enum AddressType {
  Billing = 'billing',
  Residency = 'residency',
}

export enum AddressScreenTrackingType {
  Escrow = 'escrow',
  SettingsBillingAddress = 'settings_billing_address',
  SettingsShippingAddress = 'settings_shipping_address',
  SettingsBalanceActivation = 'settings_balance_activation',
}

export enum ShippingAddressScreenLocation {
  Checkout = 'checkout',
  Settings = 'settings',
}
