'use client'

import { useEffect, useState } from 'react'
import { Dialog } from '@vinted/web-ui'

import {
  TWO_FA_CANCELLED_EVENT,
  TWO_FA_COMPLETED_EVENT,
} from '@marketplace-web/verification/verification-interceptors-util'

import GlobalTwoFA from './GlobalTwoFA'

const Global2FAModal = () => {
  const [entityId, setEntityId] = useState<string | null>(null)

  useEffect(() => {
    const handleTwoFARequired = (event: CustomEvent) => {
      setEntityId(event.detail)
    }

    window.addEventListener('twoFARequired', handleTwoFARequired)

    return () => {
      window.removeEventListener('twoFARequired', handleTwoFARequired)
    }
  }, [])

  const handleCodeSent = () => {
    setEntityId(null)

    window.dispatchEvent(new Event(TWO_FA_COMPLETED_EVENT))
  }

  const handleModalClose = () => {
    setEntityId(null)
    window.dispatchEvent(new Event(TWO_FA_CANCELLED_EVENT))
  }

  const handleError = () => {
    setEntityId(null)
  }

  if (!entityId) {
    return null
  }

  return (
    <Dialog
      show={!!entityId}
      closeOnOverlay
      defaultCallback={handleModalClose}
      testId="global-2fa-modal"
    >
      <GlobalTwoFA entityId={entityId} onCodeSent={handleCodeSent} onError={handleError} />
    </Dialog>
  )
}

export default Global2FAModal
