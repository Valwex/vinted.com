import { useCallback, useMemo } from 'react'

import { CONVERSATION_URL } from '../routes'
import useIsomorphicNavigate from './useIsomorphicNavigate'
import { createConversationNavigationStartMark } from '../tracking'

const createUrl = CONVERSATION_URL
const createNavigationStartMark = createConversationNavigationStartMark

type NavigateOptions = {
  navigationStartMark?: ReturnType<typeof createNavigationStartMark>
}

function useConversationNavigator() {
  const isomorphicNavigate = useIsomorphicNavigate()

  const navigate = useCallback(
    (
      id: number | string,
      { navigationStartMark = createNavigationStartMark() }: NavigateOptions = {},
    ) => {
      isomorphicNavigate(createUrl(id))
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

export default useConversationNavigator
