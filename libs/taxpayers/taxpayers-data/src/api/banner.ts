import { api } from '@marketplace-web/core-api/core-api-client-util'

export const dismissTaxpayerRestrictionBanner = () =>
  api.post('/taxpayers/banners/taxpayer_banner/dismiss')

export const dismissTaxpayerRestrictionModal = () =>
  api.post('/taxpayers/banners/taxpayer_banner/dismiss_modal')

export const dismissTaxpayerFillFormModal = () =>
  api.post('/taxpayers/banners/taxpayer_banner/mark_redirected')
