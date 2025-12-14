'use client'

import { HomepageBlocksModel } from '@marketplace-web/home/home-page-data'

import BlocksFetcher from '../BlocksFetcher'
import HomeBlocks from '../HomeBlocks'
import HomeLoader from '../common/HomeLoader'
import useFetchHomepageBlocks from '../hooks/useFetchHomepageBlocksNew'
import HomeSkeleton from '../common/HomeSkeleton'
import ErrorState from '../common/ErrorState'

type Props = {
  initialData: HomepageBlocksModel
}

const HomeContent = ({ initialData }: Props) => {
  const { blocks, areBlocksLoading, fetchMoreBlocks, error } = useFetchHomepageBlocks({
    initialData,
  })

  const hasNextPage = !!blocks?.nextPageToken
  const showLoader = (hasNextPage && !blocks?.showLoadMoreButton) || areBlocksLoading

  if (error) return <ErrorState />
  if (!blocks && areBlocksLoading) return <HomeSkeleton />

  return (
    <>
      {/* TODO move children to `HomeContent` folder */}
      {blocks && <HomeBlocks blocks={blocks} />}
      {hasNextPage && !areBlocksLoading && (
        <BlocksFetcher
          fetchMoreBlocks={fetchMoreBlocks}
          showLoadMoreButton={blocks.showLoadMoreButton}
        />
      )}
      {showLoader && <HomeLoader />}
    </>
  )
}

export default HomeContent
