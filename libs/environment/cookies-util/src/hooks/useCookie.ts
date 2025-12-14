import { useContext } from 'react'

import { CookieManagerContext } from '../context/cookie-manager-context'

const useCookie = () => {
  const cookieManagerContext = useContext(CookieManagerContext)

  if (!cookieManagerContext) {
    throw new Error('Missing cookie manager provider')
  }

  return cookieManagerContext
}

export default useCookie
