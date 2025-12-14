'use client'

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@vinted/web-ui'
import { Apple24, AppleLogo24Dark } from '@vinted/multichrome-icons'
import { produce } from 'immer'
import { noop } from 'lodash'
import { decodeJwt } from 'jose'

import { useEnvs } from '@marketplace-web/environment/environment-util'
import { useSession } from '@marketplace-web/shared/session-data'

import { initAppleId } from '../../utils/apple'
import { loadScript } from '../../utils/script'
import { AppleIDLoginStatus } from '../../constants'

type Props = {
  text: ReactNode
  isLoading?: boolean
  onClick?: () => void
  onSuccess: (detail: AppleSignInAPI.SignInResponseI) => void
  onFailure?: () => void
}

const APPLE_SDK_URL =
  'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js'

const AppleButton = ({ text, isLoading, onClick = noop, onSuccess, onFailure = noop }: Props) => {
  const [isLoadingAppleID, setIsLoadingAppleID] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const clientId = useEnvs('APPLE_CLIENT_ID')
  const { isWebview } = useSession()

  const onSuccessRef = useRef(onSuccess)
  onSuccessRef.current = onSuccess

  const onFailureRef = useRef(onFailure)
  onFailureRef.current = onFailure

  const handleAppleSignInSuccess = useCallback((event: Event) => {
    const { detail } = event as CustomEvent<AppleSignInAPI.SignInResponseI>
    const { email } = decodeJwt<{
      email: string
    }>(detail.authorization.id_token)

    const newDetail = produce(detail, draft => {
      if (!email || draft.user) return

      draft.user = {
        name: {
          firstName: '',
          lastName: '',
        },
        email,
      }
    })

    onSuccessRef.current(newDetail)
    setIsLoadingAppleID(false)
  }, [])

  const handleAppleSignInFailure = useCallback(() => {
    onFailureRef.current()
    setIsLoadingAppleID(false)
  }, [])

  useEffect(() => {
    document.addEventListener(AppleIDLoginStatus.Success, handleAppleSignInSuccess)
    document.addEventListener(AppleIDLoginStatus.Failure, handleAppleSignInFailure)

    return () => {
      document.removeEventListener(AppleIDLoginStatus.Success, handleAppleSignInSuccess)
      document.removeEventListener(AppleIDLoginStatus.Failure, handleAppleSignInFailure)
    }
  }, [handleAppleSignInFailure, handleAppleSignInSuccess])

  useEffect(() => {
    async function initialize() {
      if (!clientId) return

      await loadScript({
        id: 'apple-sdk',
        isAsync: true,
        src: APPLE_SDK_URL,
      })

      initAppleId(clientId)
      setIsInitialized(true)
    }

    initialize()
  }, [clientId])

  function handleClick(event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) {
    if (isLoading || isLoadingAppleID) {
      event.preventDefault()

      return
    }

    onClick()
    setIsLoadingAppleID(true)

    window.AppleID?.auth.signIn()
  }

  if (!clientId) return null

  return (
    <Button
      theme="amplified"
      onClick={handleClick}
      disabled={!isInitialized || isLoading || isLoadingAppleID}
      isLoading={isLoading || isLoadingAppleID}
      icon={isWebview ? <AppleLogo24Dark /> : <Apple24 />}
      text={text}
      styling={isWebview ? 'filled' : 'outlined'}
    />
  )
}

export default AppleButton
