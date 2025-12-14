import { useEffect, useState } from 'react'

import { useEnvs } from '@marketplace-web/environment/environment-util'

import { loadGoogleSdk } from '../../utils/google'

const useGoogleAuth2 = () => {
  const [auth2, setAuth2] = useState<gapi.auth2.GoogleAuth>()
  const clientId = useEnvs('GOOGLE_CLIENT_ID')

  useEffect(() => {
    async function initialize() {
      await loadGoogleSdk()

      window.gapi?.load('auth2', () => {
        setAuth2(
          window.gapi.auth2.init({
            client_id: clientId,
          }),
        )
      })
    }

    initialize()
  }, [clientId])

  return auth2
}

export default useGoogleAuth2
