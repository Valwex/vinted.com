import { ManageableAccountDto } from '../types/account-staff'

const isManageableAccountDto = (dto: unknown): dto is ManageableAccountDto =>
  !!dto && typeof dto === 'object' && 'user_id' in dto

export const manageableAccountsFromUserDto = (
  dto: { manageable_accounts?: unknown } | null,
): Array<ManageableAccountDto> | null => {
  if (!Array.isArray(dto?.manageable_accounts)) return null

  return dto.manageable_accounts.filter(isManageableAccountDto)
}
