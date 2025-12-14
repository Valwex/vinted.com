import { CookieData } from '../types/cookie'
import { relativeDate } from '../utils/date'

export type CookieName = (typeof cookiesData)[number]['name']

const getMaxAge = (options: Parameters<typeof relativeDate>[0]) => {
  const currentTimeInSeconds = Math.floor(new Date().getTime() / 1_000)
  const relativeExpiryDate = relativeDate(options).getTime() / 1_000

  return Math.floor(relativeExpiryDate - currentTimeInSeconds)
}

const cookiesData = [
  // Recommended: maxAge should not be set to more than 1 year
  {
    name: 'seller_header_visits',
    maxAge: getMaxAge({ years: 1 }),
    httpOnly: false,
  },
  {
    name: 'refresh_token_web',
    maxAge: getMaxAge({ days: 7 }),
    httpOnly: true,
  },
  {
    name: 'access_token_web',
    // TODO: revisit `maxAge` requirement when 'vinted_fr_session' cookie is removed
    maxAge: getMaxAge({ days: 7 }),
    httpOnly: true,
  },
  {
    name: 'help_center_search_session_id',
    maxAge: getMaxAge({ days: 1 }),
  },
  {
    name: 'referrals_phones_bottom_sheet_was_shown',
    maxAge: getMaxAge({ years: 1 }),
  },
  {
    name: 'v_udt',
    maxAge: getMaxAge({ years: 20 }),
    httpOnly: true,
  },
  {
    name: 'last_user_id',
    maxAge: getMaxAge({ years: 1 }),
  },
  {
    name: 'action_callback_route',
    maxAge: getMaxAge({ hours: 1 }),
  },
  {
    name: 'help_center_session_id',
    maxAge: getMaxAge({ minutes: 1 }),
  },
  {
    name: 'anon_id',
    maxAge: getMaxAge({ years: 20 }),
    sameSite: 'Lax',
  },
  {
    name: 'anonymous-locale',
    maxAge: getMaxAge({ years: 20 }),
  },
  {
    name: '_vinted_sb_fr_session',
    maxAge: getMaxAge({ days: 7 }),
    httpOnly: true,
  },
  {
    name: '_vinted_fr_session',
    maxAge: getMaxAge({ days: 7 }),
    httpOnly: true,
  },
  {
    name: 'locale',
  },
  {
    name: 'viewport_size',
    maxAge: getMaxAge({ days: 1 }),
  },
  {
    name: 'domain_selected',
    maxAge: getMaxAge({ years: 20 }),
  },
  {
    name: 'OptanonConsent',
    maxAge: getMaxAge({ years: 1 }),
  },
  {
    name: 'color_theme',
    maxAge: getMaxAge({ years: 1 }),
  },
  {
    name: 'anon_id',
    maxAge: getMaxAge({ years: 20 }),
    sameSite: 'Lax',
  },
  {
    name: 'X-VINTED-IN-APP',
  },
  {
    name: 'v_uid',
    maxAge: getMaxAge({ years: 20 }),
    httpOnly: true,
  },
  {
    name: 'app_banner',
    maxAge: getMaxAge({ days: 5 }),
  },
  {
    name: 'auth_redirect_retry_count',
    maxAge: 5,
  },
  {
    name: 'migration_code',
    maxAge: getMaxAge({ days: 1 }),
  },
  {
    name: 'banners_ui_state',
    maxAge: getMaxAge({ minutes: 10 }),
  },
  {
    name: 'seen_banners',
    maxAge: getMaxAge({ minutes: 10 }),
  },
  {
    name: 'last_nonce_token',
    maxAge: getMaxAge({ years: 1 }),
    httpOnly: true,
  },
  {
    name: 'next_middleware_layout_rewrite',
    maxAge: getMaxAge({ years: 1 }),
  },
  {
    name: 'is_shipping_fees_applied_info_banner_dismissed',
    maxAge: getMaxAge({ years: 20 }),
  },
  {
    name: 'datadome',
  },
  {
    name: 'is_ntd_form_feedback_submitted',
    maxAge: getMaxAge({ days: 30 }),
  },
  {
    name: 'non_dot_com_www_domain_cookie_buster',
    maxAge: getMaxAge({ days: 30 }),
  },
] as const

const cookiesDataByName = cookiesData.reduce(
  (accumulator, cookie) => {
    accumulator[cookie.name] = cookie

    return accumulator
  },
  {} as Record<CookieName, CookieData>,
)

export { cookiesDataByName }
