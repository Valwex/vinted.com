import { CookieHandler } from '../types/cookie'
import ClientCookieManager from './cookie-manager-client'
import SSRCookieManager from './cookie-manager-ssr'

const createCookieManager = (cookies?: Record<string, string | undefined>): CookieHandler => {
  return typeof window === 'undefined' ? new SSRCookieManager(cookies) : new ClientCookieManager()
}

export { createCookieManager }
