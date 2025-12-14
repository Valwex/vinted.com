'use client'

import { Loader } from '@vinted/web-ui'
import { useEffect, useState } from 'react'
import { useEventListener } from 'usehooks-ts'

import { getFingerprint } from '@marketplace-web/session-management/audit-util'
import { useSession } from '@marketplace-web/shared/session-data'
import {
  transformTwoFactorVerification,
  VerificationType,
  createUser2FA,
  TwoFactorVerificationModel,
  clickCancelVerification,
  VerificationChannel,
} from '@marketplace-web/verification/verification-data'
import { TWO_FA_CANCELLED_EVENT } from '@marketplace-web/verification/verification-interceptors-util'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { ResponseCode } from '@marketplace-web/core-api/api-client-util'

import TwoFactorVerification from '../TwoFactorVerification'
import AddPhoneNumber from '../AddPhoneNumber'

type Props = {
  entityId: string
  onCodeSent: () => void
  onError: () => void
}

const GlobalTwoFA = ({ entityId, onCodeSent, onError }: Props) => {
  const userId = useSession().user?.id
  const { track } = useTracking()
  const [isPhoneNumberFormVisible, setIsPhoneNumberFormVisible] = useState(false)
  const [transformedData, setTransformedData] = useState<TwoFactorVerificationModel | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEventListener(TWO_FA_CANCELLED_EVENT, () => {
    track(
      clickCancelVerification({
        type: transformedData?.channel ?? VerificationChannel.Sms,
        source: '2FA',
        userTwoFactorAuthId: transformedData?.id.toString(),
      }),
    )
  })

  const handleCreateUser2FA = async (args: { userId: number; entityId: string }) => {
    return createUser2FA({
      userId: args.userId,
      entityId: args.entityId,
      entityType: VerificationType.EntityHash,
      fingerprint: await getFingerprint(),
    })
  }

  useEffect(() => {
    if (!userId || !entityId) return

    const fetch = async () => {
      setIsLoading(true)

      const response = await handleCreateUser2FA({ userId, entityId })

      setIsLoading(false)

      if ('errors' in response) {
        if (response.code === ResponseCode.PhoneNumberRequired) {
          setIsPhoneNumberFormVisible(true)

          return
        }

        onError()

        return
      }

      setTransformedData(transformTwoFactorVerification(response))
    }

    fetch()
  }, [userId, entityId, onError])

  const handlePhoneNumberConfirm = (twoFaData: TwoFactorVerificationModel) => {
    if (!userId) return

    setIsPhoneNumberFormVisible(false)
    setTransformedData(twoFaData)
  }

  if (isLoading) {
    return (
      <div className="u-flexbox u-justify-content-center">
        <Loader size="x-large" testId="global-two-FA-loader" />
      </div>
    )
  }

  if (isPhoneNumberFormVisible) {
    return <AddPhoneNumber onConfirm={handlePhoneNumberConfirm} entityId={entityId} />
  }

  if (!transformedData) return null

  return (
    <TwoFactorVerification
      verificationType={VerificationType.EntityHash}
      maskedInfo={transformedData.userMaskedInfo}
      nextResendAvailableIn={transformedData.nextResendAvailableIn}
      showResend={transformedData.showResendOption}
      twoFAId={transformedData.id}
      onCodeSent={onCodeSent}
      channel={transformedData.channel}
    />
  )
}

export default GlobalTwoFA
