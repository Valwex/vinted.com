import { api } from '@marketplace-web/core-api/core-api-client-util'

export const disableUserHoliday = (userId: number) => api.delete(`/users/${userId}/holiday`)
