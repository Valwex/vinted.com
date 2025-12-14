import { useContext } from 'react'

import SavedSearchesContext from './SavedSearchesContext'

const useSavedSearchesContext = () => useContext(SavedSearchesContext)

export default useSavedSearchesContext
