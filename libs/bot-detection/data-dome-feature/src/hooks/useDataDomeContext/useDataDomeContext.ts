import { useContext } from 'react'

import { DataDomeContext } from '../../containers/DataDomeContext'

const useDataDomeContext = () => {
  const context = useContext(DataDomeContext)

  if (!context) {
    throw new Error('useDataDomeContext must be used within a DataDomeProvider')
  }

  return context
}

export default useDataDomeContext
