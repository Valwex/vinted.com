'use client'

import classNames from 'classnames'
import { Cell, Text, Image } from '@vinted/web-ui'
import { InView } from 'react-intersection-observer'

import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'
import { LayoutElementModel, ThumbnailsBlockStyle } from '@marketplace-web/home/home-page-data'

import HomepageBlockLayout from '../HomepageBlockLayout'
import ScrollableContentBody from '../ScrollableContentBody'
import useLayoutsTracking from '../hooks/useLayoutsTracking'
import IconThumbnails from './IconThumbnails'

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

type ThumbnailProps = {
  imageSrc: string
  title: string
  ctaUrl: string
  style: ThumbnailsBlockStyle
  accessibilityLabel: string | null
  handleItemClick(): void
}

const Thumbnail = (props: ThumbnailProps) => {
  const breakpoints = useBreakpoint()

  const { imageSrc, title, ctaUrl, handleItemClick, style, accessibilityLabel } = props
  const bigImageStyle = style === ThumbnailsBlockStyle.BigImage
  const smallRoundImageStyle = style === ThumbnailsBlockStyle.SmallRoundImage

  const isDisabled = bigImageStyle ? breakpoints.tabletsUp : breakpoints.wide
  const desktopImageSize = smallRoundImageStyle ? 'x2-large' : undefined

  const getMobileImageSize = () => {
    if (bigImageStyle) return 'x4-large'
    if (smallRoundImageStyle) return 'x2-large'

    return 'x3-large'
  }

  return (
    <article className="single-thumbnail-container">
      <Cell
        styling="tight"
        clickable
        url={ctaUrl}
        onClick={handleItemClick}
        testId="homepage-layouts-thumbnail"
        aria={{
          'aria-label': accessibilityLabel || '',
        }}
        body={
          <div className="single-thumbnail-container-body">
            <div
              className={classNames('thumbnail-image', {
                'thumbnail-image--small-round': smallRoundImageStyle,
              })}
            >
              <Image
                scaling="cover"
                ratio="square"
                src={imageSrc}
                size={isDisabled ? desktopImageSize : getMobileImageSize()}
                styling={smallRoundImageStyle ? 'circle' : 'rounded'}
              />
            </div>
            <Cell styling={smallRoundImageStyle ? 'narrow' : 'tight'}>
              <div
                className={classNames(
                  'thumbnail-title-wrapper',
                  'homepage-layouts-text-truncation',
                  {
                    'big-thumbnail-title': bigImageStyle,
                    'small-round-thumbnail-title': smallRoundImageStyle,
                    'u-ui-padding-top-small': !smallRoundImageStyle,
                  },
                )}
              >
                <Text
                  width="parent"
                  type="title"
                  text={title}
                  alignment={smallRoundImageStyle ? 'center' : 'left'}
                  as="h3"
                />
              </div>
            </Cell>
          </div>
        }
      />
    </article>
  )
}

const ThumbnailsBlock = (props: Props) => {
  const { elements, title, name, homepageSessionId, style, subtitle } = props
  const { handleItemClick, handleItemView } = useLayoutsTracking({ name, homepageSessionId })
  const breakpoints = useBreakpoint()

  if (style === ThumbnailsBlockStyle.Icons) return <IconThumbnails {...props} />

  const renderThumbnails = () =>
    elements.map((thumbnail, index) => (
      <InView key={index} onChange={handleItemView(thumbnail, index)} className="u-fill-width">
        <Thumbnail
          title={thumbnail.title}
          imageSrc={thumbnail.photo.url}
          ctaUrl={thumbnail.cta.url}
          handleItemClick={handleItemClick(thumbnail, index)}
          style={style}
          accessibilityLabel={thumbnail.cta.accessibilityLabel}
        />
      </InView>
    ))

  const isContentJustified =
    style === ThumbnailsBlockStyle.BigImage ? breakpoints.tabletsUp : breakpoints.wide

  return (
    <HomepageBlockLayout
      {...props}
      headerProps={{ title, subtitle }}
      body={
        <ScrollableContentBody
          className={classNames('thumbnails-layout-container', {
            'u-justify-content-between': isContentJustified,
          })}
        >
          {renderThumbnails()}
        </ScrollableContentBody>
      }
    />
  )
}

export default ThumbnailsBlock
