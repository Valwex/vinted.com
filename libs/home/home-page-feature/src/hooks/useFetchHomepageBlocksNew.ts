import { useEffect, useReducer } from 'react'

import {
  transformHomepageBlockResponse,
  HomepageBlocksModel,
} from '@marketplace-web/home/home-page-data'
import { isResponseError } from '@marketplace-web/core-api/api-client-util'
import { useLatestCallback } from '@marketplace-web/shared/ui-state-util'

import { logHomeError, logHomeMessage, observeFetchDuration } from '../utils/client-observability'
import { useHomeContext } from '../HomeProvider'
import { EMPTY_RESPONSE_ERROR, getHomepageBlocks } from '../utils/api'
import { blocksReducer } from '../utils/blocks-reducer'
import useColumnCount from './useColumnCount'
import useTabs from './useTabs'

type Props = {
  initialData: HomepageBlocksModel
}

const useFetchHomepageBlocks = (props: Props) => {
  const { currentTab } = useTabs()
  const { homepageSessionId, setFetchTab } = useHomeContext()
  const columnCount = useColumnCount()

  const [state, dispatch] = useReducer(blocksReducer, {
    isLoading: false,
    error: props.initialData.blocks.length === 0 ? EMPTY_RESPONSE_ERROR : null,
    blocks: props.initialData,
  })

  const fetchNewTab = useLatestCallback(async (tab: typeof currentTab) => {
    dispatch({ type: 'loading' })

    const start = performance.now()
    const response = await getHomepageBlocks({
      homepageSessionId,
      nextPageToken: null,
      columnCount,
      tab,
    })

    const isError = isResponseError(response)
    observeFetchDuration(performance.now() - start, { isFirstPage: true, isError })

    if (isError) {
      logHomeMessage(`Failed to fetch first page. ${response.message}`, `tab: ${tab.name}`)
      dispatch({ type: 'error', payload: response })
    } else {
      dispatch({ type: 'success', payload: transformHomepageBlockResponse(response, logHomeError) })
    }
  })

  useEffect(() => {
    setFetchTab(() => fetchNewTab)
  }, [fetchNewTab, setFetchTab])

  const fetchMoreBlocks = async () => {
    const nextPageToken = state.blocks?.nextPageToken
    if (!nextPageToken) return

    dispatch({ type: 'more-blocks-loading' })

    const start = performance.now()
    const response = await getHomepageBlocks({
      tab: currentTab,
      homepageSessionId,
      nextPageToken,
      columnCount,
    })

    const isError = isResponseError(response)
    observeFetchDuration(performance.now() - start, { isError })

    if (isError) {
      dispatch({ type: 'more-blocks-failure' })
      logHomeMessage(`Failed to fetch more. ${response.message}`, `tab: ${currentTab.name}`)

      return
    }

    dispatch({
      type: 'more-blocks-success',
      payload: transformHomepageBlockResponse(response, logHomeError),
    })
  }

  return {
    blocks: state.blocks,
    areBlocksLoading: state.isLoading,
    error: state.error,
    fetchMoreBlocks,
  }
}

export default useFetchHomepageBlocks
