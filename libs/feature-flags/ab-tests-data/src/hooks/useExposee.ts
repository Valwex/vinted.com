import { useMemo } from 'react'

import { useSession } from '@marketplace-web/shared/session-data'
import { useSystemConfiguration } from '@marketplace-web/shared/system-configuration-data'

import { Exposee } from '../types/exposee'

const useExposee = () => {
  const session = useSession()
  const systemConfiguration = useSystemConfiguration()

  return useMemo(
    (): Exposee => ({
      anonId: session.anonId || '',
      userId: session.user?.id || null,
      countryCode: systemConfiguration?.userCountry || '',
    }),
    [session.anonId, session.user?.id, systemConfiguration?.userCountry],
  )
}

export default useExposee
