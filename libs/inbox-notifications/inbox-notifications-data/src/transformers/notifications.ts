import { UnreadNotificationsCountDto } from '../types/dtos'

export const transformUnreadNotificationsCountDto = (dto: UnreadNotificationsCountDto): number =>
  dto.count

export const transformUnreadNotificationsResponse = transformUnreadNotificationsCountDto
