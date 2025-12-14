import { AbTestExposeEventArgs, AbTestExposeEventExtra } from '../types/events'

export const abTestExposeEvent = (args: AbTestExposeEventArgs) => {
  const { id, name, anonId, userId, countryCode, variant } = args

  const extra: AbTestExposeEventExtra = {
    test_id: String(id),
    test_name: name,
    test_anon_id: anonId,
    country_code: countryCode,
  }

  if (variant) extra.variant = variant
  if (userId) extra.test_user_id = String(userId)

  return {
    event: 'ab_test.expose',
    extra,
  }
}
