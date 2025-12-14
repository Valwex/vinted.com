import { useContext } from 'react'

import CatalogContext from './CatalogContext'

const useCatalogContext = () => {
  const context = useContext(CatalogContext)

  if (!context) {
    throw new Error('useCatalogContext must be used within a CatalogProvider')
  }

  return context
}

export default useCatalogContext
