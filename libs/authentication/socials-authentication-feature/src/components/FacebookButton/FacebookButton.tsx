'use client'

import { useState, ReactNode } from 'react'
import { Button } from '@vinted/web-ui'
import { noop } from 'lodash'

import useInitFacebook from '../../hooks/useInitFacebook/useInitFacebook'
import { FACEBOOK_PERMISSIONS, FacebookLoginStatus } from '../../constants'

const FacebookIcon = () => (
  <div className="u-flexbox u-padding-small">
    <svg fill="none" viewBox="0 0 24 24" width="20" height="20">
      <path
        fill="#0866FF"
        d="M24 12.004c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.627 3.875 10.35 9.101 11.647v-7.98H6.627v-3.667H9.1v-1.58c0-4.084 1.849-5.977 5.858-5.977.76 0 2.073.149 2.61.298v3.324c-.284-.03-.776-.045-1.387-.045-1.967 0-2.728.745-2.728 2.683v1.297h3.92l-.674 3.667h-3.246v8.245C19.396 23.198 24 18.139 24 12.004Z"
      />
      <path
        fill="#fff"
        d="m16.7 15.671.673-3.667h-3.92v-1.297c0-1.938.761-2.683 2.728-2.683.611 0 1.104.015 1.387.044V4.745c-.537-.15-1.849-.299-2.61-.299-4.009 0-5.857 1.894-5.857 5.978v1.58H6.626v3.667h2.475v7.98a12.021 12.021 0 0 0 4.352.265V15.67H16.7Z"
      />
    </svg>
  </div>
)

type FbFieldsResp = {
  email?: string
  birthday?: string
  gender?: string
  name?: string
  first_name?: string
  last_name?: string
}

type Props = {
  text: ReactNode
  isLoading?: boolean
  onClick?: () => void
  onSuccess: (token: string, fields: FbFieldsResp) => void
  onFailure?: () => void
}

const FacebookButton = ({
  text,
  isLoading,
  onClick = noop,
  onSuccess,
  onFailure = noop,
}: Props) => {
  const [isFbLoginLoading, setIsFbLoginLoading] = useState(false)
  const { isInitialized, isEnabled } = useInitFacebook()

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (isLoading || isFbLoginLoading) {
      event.preventDefault()

      return
    }

    onClick()
    setIsFbLoginLoading(true)

    FB.login(
      response => {
        if (response.status !== FacebookLoginStatus.Connected) {
          onFailure()
          setIsFbLoginLoading(false)

          return
        }

        try {
          FB.api(
            '/me',
            {
              fields: ['email', 'birthday', 'gender', 'name', 'first_name', 'last_name'],
            },
            fields => {
              onSuccess(response.authResponse.accessToken, fields)
            },
          )
        } catch (exception) {
          window.apphealth?.captureError(exception)
          // Calling success because the user is still allowed to login
          onSuccess(response.authResponse.accessToken, {})
        } finally {
          setIsFbLoginLoading(false)
        }
      },
      { scope: FACEBOOK_PERMISSIONS },
    )
  }

  if (!isEnabled) return null

  return (
    <Button
      theme="amplified"
      onClick={handleClick}
      disabled={!isInitialized || isLoading || isFbLoginLoading}
      isLoading={isLoading || isFbLoginLoading}
      // TODO: Replace with FacebookLogo24 from @vinted/multichrome-icons when it's updated
      icon={<FacebookIcon />}
    >
      {text}
    </Button>
  )
}

export default FacebookButton
