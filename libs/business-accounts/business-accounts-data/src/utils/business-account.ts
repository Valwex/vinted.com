import { BusinessAccountDto } from '../types/business-account'

const isBusinessAccountDto = (dto: unknown): dto is BusinessAccountDto =>
  !!dto && typeof dto === 'object' && 'id' in dto

export const businessAccountFromUserDto = (
  dto: { business_account?: unknown } | null,
): BusinessAccountDto | null => {
  if (!isBusinessAccountDto(dto?.business_account)) return null

  return dto.business_account
}
