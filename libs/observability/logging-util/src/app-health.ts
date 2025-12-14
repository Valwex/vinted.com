import * as AppHealth from '@vinted/apphealth-web'

import { serverSide } from '@marketplace-web/environment/environment-util'

const AUTO_TEST_USER_EMAIL_ROOT = 'autotestvinted'

export const initializeAppHealth = (projectName: string, version: string, env: string) => {
  AppHealth.watch(projectName, {
    context: {
      version,
      env,
    },
  })
  window.apphealth = AppHealth
}

export const disableAppHealthForTestUsers = (email: string | null | undefined) => {
  if (serverSide) return
  if (process.env.NODE_ENV !== 'production') return

  if (email?.includes(AUTO_TEST_USER_EMAIL_ROOT)) {
    AppHealth.unwatch()
  }
}
