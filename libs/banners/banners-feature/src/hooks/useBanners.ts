import { useContext } from 'react'

import { BannersContext } from '../contexts/BannersProvider'

const useBanners = () => {
  const bannersProps = useContext(BannersContext)

  if (!bannersProps) throw new Error('Missing banners provider')

  return bannersProps
}

export default useBanners
