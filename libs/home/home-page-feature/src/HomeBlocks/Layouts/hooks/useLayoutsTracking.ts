import { useRef } from 'react'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import {
  LayoutElementModel,
  userClickHomepageElement,
  userViewHomepageElement,
} from '@marketplace-web/home/home-page-data'

interface Props {
  name: string
  homepageSessionId: string
}

const useLayoutsTracking = ({ name, homepageSessionId }: Props) => {
  const { track } = useTracking()

  const seenThumbnails = useRef<Array<string>>([])

  const handleItemView = (thumbnail: LayoutElementModel, index: number) => (inView: boolean) => {
    if (!inView) return

    const seenThumbnail = thumbnail.id || thumbnail.title
    if (seenThumbnails.current.includes(seenThumbnail)) return

    seenThumbnails.current.push(seenThumbnail)

    track(
      userViewHomepageElement({
        blockName: name,
        position: index + 1,
        contentSource: thumbnail.contentSource,
        contentSourceLabel: thumbnail.title,
        contentSourceId: thumbnail.id,
        homepageSessionId,
        screen: 'news_feed',
      }),
    )
  }

  const handleItemClick = (thumbnail: LayoutElementModel, index: number) => () => {
    track(
      userClickHomepageElement({
        blockName: name,
        position: index + 1,
        contentSource: thumbnail.contentSource,
        contentSourceLabel: thumbnail.title,
        contentSourceId: thumbnail.id,
        homepageSessionId,
        screen: 'news_feed',
      }),
    )
  }

  return {
    handleItemClick,
    handleItemView,
  }
}

export default useLayoutsTracking
