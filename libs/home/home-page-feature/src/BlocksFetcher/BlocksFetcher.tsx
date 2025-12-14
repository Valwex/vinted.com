'use client'

import BlocksObserver from './components/BlocksObserver'
import LoadMoreButton from './components/LoadMoreButton'

type Props = {
  fetchMoreBlocks(): void
  showLoadMoreButton: boolean
}

const BlocksFetcher = (props: Props) => {
  if (props.showLoadMoreButton) {
    return <LoadMoreButton onClick={props.fetchMoreBlocks} />
  }

  return <BlocksObserver onPageEnd={props.fetchMoreBlocks} />
}

export default BlocksFetcher
