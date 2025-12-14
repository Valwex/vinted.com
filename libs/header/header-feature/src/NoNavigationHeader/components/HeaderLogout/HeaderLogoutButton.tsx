'use client'

import { Button } from '@vinted/web-ui'
import { usePathname, useSearchParams } from 'next/navigation'

import { EmailCodeView } from '@marketplace-web/verification/verification-feature'
import { createCookieManager } from '@marketplace-web/environment/cookies-util'
import { logoutUser } from '@marketplace-web/session-management/session-management-data'
import { navigateToPage } from '@marketplace-web/browser/browser-navigation-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'

import { trackLogoutEvent } from '../../../utils/client-email-code-test-handlers'
import { ROOT_URL } from '../../../constants/routes'

type Props = {
  userId: number
}

const HeaderLogoutButton = ({ userId, ...props }: Props & React.ComponentProps<typeof Button>) => {
  const { track } = useTracking()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleClick = async () => {
    const response = await logoutUser({ cookies: createCookieManager() })

    if (!response || !pathname) return

    const view = searchParams?.get('view') || EmailCodeView.EnterCode

    trackLogoutEvent({ userId, track, relativeUrl: pathname, view })
    navigateToPage(ROOT_URL)
  }

  return <Button theme="muted" styling="flat" size="medium" onClick={handleClick} {...props} />
}

export default HeaderLogoutButton
