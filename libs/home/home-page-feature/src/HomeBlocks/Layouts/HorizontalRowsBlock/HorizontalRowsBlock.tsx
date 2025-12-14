'use client'

import { Card, Cell, Image, Text } from '@vinted/web-ui'
import classNames from 'classnames'
import { InView } from 'react-intersection-observer'

import { LayoutElementModel } from '@marketplace-web/home/home-page-data'
import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'

import HomepageBlockLayout from '../HomepageBlockLayout'
import ScrollableContentBody from '../ScrollableContentBody'
import useLayoutsTracking from '../hooks/useLayoutsTracking'

type Props = {
  elements: Array<LayoutElementModel>
  name: string
  position: number
  homepageSessionId: string
  id: string
  title: string
  subtitle: string | null
}

type RowElementProps = {
  name: string
  element: LayoutElementModel
  homepageSessionId: string
  position: number
  accessibilityLabel: string | null
}

const RowElement = ({
  name,
  element,
  homepageSessionId,
  position,
  accessibilityLabel,
}: RowElementProps) => {
  const breakpoints = useBreakpoint()
  const { handleItemClick, handleItemView } = useLayoutsTracking({ name, homepageSessionId })

  return (
    <InView
      className={classNames('single-row-element', `row-element-${position + 1}`, {
        'row-element-mobile': !breakpoints.desktops,
      })}
      onChange={handleItemView(element, position)}
    >
      <Card>
        <Cell
          styling="tight"
          clickable
          url={element.cta.url}
          type="navigating"
          prefix={
            <Image
              scaling="cover"
              ratio="square"
              src={element.photo.url}
              size={breakpoints.desktops ? 'x-large' : 'large'}
            />
          }
          body={
            <div className="homepage-layouts-text-truncation">
              <Text
                width="parent"
                type="subtitle"
                text={element.title}
                alignment="left"
                theme="amplified"
                as="p"
                bold
              />
            </div>
          }
          onClick={handleItemClick(element, position)}
          testId="homepage-layouts-horizontal-rows"
          aria={{
            'aria-label': accessibilityLabel || '',
          }}
        />
      </Card>
    </InView>
  )
}

const HorizontalRowsBlock = ({
  elements,
  name,
  position,
  homepageSessionId,
  id,
  title,
  subtitle,
}: Props) => {
  const breakpoints = useBreakpoint()

  const renderRows = () =>
    elements.map((element, index) => (
      <RowElement
        element={element}
        name={name}
        homepageSessionId={homepageSessionId}
        position={index}
        key={`horizontal-rows-element-${position}-${element.title}`}
        accessibilityLabel={element.cta.accessibilityLabel}
      />
    ))

  return (
    <HomepageBlockLayout
      name={name}
      position={position}
      homepageSessionId={homepageSessionId}
      id={id}
      headerProps={{ title, subtitle }}
      body={
        <ScrollableContentBody
          className={classNames('horizontal-rows-block-container', {
            'horizontal-rows-desktop': breakpoints.desktops,
          })}
        >
          {renderRows()}
        </ScrollableContentBody>
      }
    />
  )
}

export default HorizontalRowsBlock
