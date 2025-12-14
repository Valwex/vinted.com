import { useContext } from 'react'

import { EnvsContext } from '../EnvsProvider'
import type { UniversalEnvs } from '../variables'

const useEnvs = (env: keyof UniversalEnvs) => {
  const envs = useContext(EnvsContext)

  if (!envs) throw new Error('useEnvs must be used within an EnvsProvider')

  return envs[env]
}

export default useEnvs
