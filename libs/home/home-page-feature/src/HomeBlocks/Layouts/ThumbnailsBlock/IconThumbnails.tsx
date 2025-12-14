'use client'

import { InView } from 'react-intersection-observer'
import { Cell, Text, Image, Spacer } from '@vinted/web-ui'

import { LayoutElementModel, ThumbnailsBlockStyle } from '@marketplace-web/home/home-page-data'
import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'

import HomepageBlockLayout from '../HomepageBlockLayout'
import ScrollableContentBody from '../ScrollableContentBody'
import useLayoutsTracking from '../hooks/useLayoutsTracking'

type Props = {
  elements: Array<LayoutElementModel>
  title: string
  name: string
  position: number
  homepageSessionId: string
  id: string
  style: ThumbnailsBlockStyle
  subtitle: string | null
}

const IconThumbnails = (props: Props) => {
  const { handleItemClick, handleItemView } = useLayoutsTracking(props)
  const breakpoints = useBreakpoint()

  const renderThumbnail = (thumbnail: LayoutElementModel, index: number) => (
    <InView
      as="article"
      key={index}
      onChange={handleItemView(thumbnail, index)}
      className="single-thumbnail-container single-thumbnail-container--icon"
    >
      <Cell
        styling="tight"
        clickable
        url={thumbnail.cta.url}
        onClick={handleItemClick(thumbnail, index)}
        testId="homepage-layouts-thumbnail"
        aria={{ 'aria-label': thumbnail.cta.accessibilityLabel || '' }}
        body={
          <div className="single-thumbnail-container-body">
            <div className="thumbnail-image--icon">
              <Image src={thumbnail.photo.url} scaling="cover" size="regular" />
            </div>
            <Spacer />
            <div className="thumbnail-title-wrapper homepage-layouts-text-truncation">
              <Text
                width="parent"
                type={breakpoints.desktops ? 'subtitle' : 'caption'}
                text={thumbnail.title}
                alignment="center"
                theme="amplified"
                as="h3"
              />
            </div>
          </div>
        }
      />
    </InView>
  )

  return (
    <HomepageBlockLayout
      {...props}
      headerProps={props}
      body={
        <ScrollableContentBody className="thumbnails-layout-container">
          {props.elements.map(renderThumbnail)}
        </ScrollableContentBody>
      }
    />
  )
}

export default IconThumbnails
