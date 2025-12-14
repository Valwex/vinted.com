import { useNavigate } from 'react-router-dom'

import serverNavigate from './server-navigate'

function useIsomorphicNavigate() {
  try {
    return useNavigate()
  } catch {
    return serverNavigate
  }
}

export default useIsomorphicNavigate
