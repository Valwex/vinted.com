'use client'

import { useEffect, useState } from 'react'

import {
  getTwoFADetails,
  transformTwoFaDetails,
  TwoFaDetailsModel,
  VerificationType,
} from '@marketplace-web/verification/verification-data'
import { TwoFactorVerification } from '@marketplace-web/verification/verification-feature'
import { redirectToPage } from '@marketplace-web/browser/browser-navigation-util'
import { useAuthenticationContext } from '@marketplace-web/auth-flow/auth-context-feature'

import { LOGIN_SELECT_TYPE } from '../../constants/routes'

const LoginTwoFactorVerification = () => {
  const [twoFactorLoginData, setTwoFactorLoginData] = useState<
    TwoFaDetailsModel & { refUrl: string }
  >()
  const [isVerifierEnabled, setIsVerifierEnabled] = useState(false)
  const { twoFactorLoginData: twoFactorErrorData, isAuthPage } = useAuthenticationContext()

  useEffect(() => {
    if (!twoFactorErrorData) return

    const fetchTwoFaLoginData = async (id: string) => {
      const response = await getTwoFADetails(id)

      if ('errors' in response) return

      setTwoFactorLoginData({
        ...transformTwoFaDetails(response),
        refUrl: twoFactorErrorData.refUrl,
      })
    }

    if ('id' in twoFactorErrorData) {
      fetchTwoFaLoginData(twoFactorErrorData.id)
      setIsVerifierEnabled(true)

      return
    }

    setTwoFactorLoginData(twoFactorErrorData)
  }, [twoFactorErrorData])

  if (!twoFactorErrorData) {
    redirectToPage(LOGIN_SELECT_TYPE)

    return null
  }

  if (!twoFactorLoginData) return null

  const { controlCode, nextResendAvailableIn, userMaskedInfo, showResendOption, refUrl, channel } =
    twoFactorLoginData

  return (
    <div className="narrow-container u-background-white u-padding-bottom-x-large">
      <TwoFactorVerification
        controlCode={controlCode}
        refUrl={refUrl}
        verificationType={VerificationType.Login}
        maskedInfo={userMaskedInfo}
        nextResendAvailableIn={Number(nextResendAvailableIn)}
        showResend={Boolean(showResendOption)}
        // twoFAId is not used in login verification
        // TODO: Remove this prop when conditional props are added to TwoFactorVerification
        twoFAId={0}
        isVerifierEnabled={isVerifierEnabled}
        isAuthPage={isAuthPage}
        channel={channel}
      />
    </div>
  )
}

export default LoginTwoFactorVerification
