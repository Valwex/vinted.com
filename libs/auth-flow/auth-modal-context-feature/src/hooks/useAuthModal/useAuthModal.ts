import { useContext } from 'react'

import { AuthModalContext } from '../../containers/auth-modal/AuthModalContext'

const useAuthModal = () => {
  const authModal = useContext(AuthModalContext)

  if (!authModal) {
    throw new Error('useAuthModal must be used within AuthModalProvider')
  }

  return authModal
}

export default useAuthModal
