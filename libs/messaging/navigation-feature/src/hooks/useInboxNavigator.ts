import { useCallback, useMemo } from 'react'

import { INBOX_URL } from '../routes'
import useIsomorphicNavigate from './useIsomorphicNavigate'
import { createInboxNavigationStartMark } from '../tracking'

const createUrl = () => INBOX_URL
const createNavigationStartMark = createInboxNavigationStartMark

type NavigateOptions = {
  navigationStartMark?: ReturnType<typeof createNavigationStartMark>
}

function useConversationDetailsNavigator() {
  const isomorphicNavigate = useIsomorphicNavigate()

  const navigate = useCallback(
    ({ navigationStartMark = createNavigationStartMark() }: NavigateOptions = {}) => {
      isomorphicNavigate(createUrl())
      navigationStartMark.store()
    },
    [isomorphicNavigate],
  )

  return useMemo(
    () => ({
      createUrl,
      createNavigationStartMark,
      navigate,
    }),
    [navigate],
  )
}

export default useConversationDetailsNavigator
