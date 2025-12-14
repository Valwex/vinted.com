import Cookies from 'universal-cookie'

import { ROOT_COOKIE_PATH } from '../constants/cookies'
import { CookieData, CookieHandler } from '../types/cookie'

export default class ClientCookieManager implements CookieHandler {
  private cookies = new Cookies()

  set = (cookie: CookieData, value: string) => {
    if (cookie.httpOnly) {
      throw new Error('Attempting to set a server cookie using ClientCookieManager.')
    }

    this.cookies.set(cookie.name, value, {
      path: ROOT_COOKIE_PATH,
      ...cookie,
    })
  }

  delete = (cookie: CookieData) => {
    this.cookies.remove(cookie.name, { path: cookie.path || ROOT_COOKIE_PATH })
  }

  get = (cookie: CookieData) => {
    return this.cookies.get(cookie.name)
  }
}
