'use client'

import { ReactNode, MouseEvent, useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft16, ChevronRight16 } from '@vinted/monochrome-icons'
import { Icon } from '@vinted/web-ui'
import classNames from 'classnames'
import { InView } from 'react-intersection-observer'

import Item from './Item'

const SCROLL_FRAME_DELAY = 5
const SCROLL_FRAME_DISTANCE = 10

export enum ControlScrollType {
  // Scrolls till the end of the horizontal area
  Full = 'full',
  // Scrolls by a single iteration which is the width of HorizontalScrollArea (until current items are not visible)
  Partial = 'partial',
}

type Props = {
  children?: ReactNode
  showControls?: boolean
  allowVerticalOverflow?: boolean
  disableIosSmoothScroll?: boolean
  controlsScrollType?: ControlScrollType
  itemsFullWidthAlignment?: boolean
  arrowLeftText: string
  arrowRightText: string
}

// TODO: move to Bloom repository, like in Android and iOS
const HorizontalScrollArea = ({
  children,
  showControls = true,
  allowVerticalOverflow,
  disableIosSmoothScroll,
  controlsScrollType = ControlScrollType.Full,
  itemsFullWidthAlignment = false,
  arrowLeftText,
  arrowRightText,
}: Props) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const areControlsVisible = showControls && (showLeftArrow || showRightArrow)

  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const fullContentWidth = scrollAreaRef.current?.scrollWidth
  const visibleAreaWidth = scrollAreaRef.current?.clientWidth
  const isStartPosition = scrollAreaRef.current?.scrollLeft === 0

  const adjustControlsVisibility = useCallback(() => {
    const domNode = scrollAreaRef.current

    if (!domNode) return

    setShowLeftArrow(domNode.scrollLeft > 0)
    setShowRightArrow(domNode.scrollWidth > domNode.clientWidth + domNode.scrollLeft + 1) // 1 is added to compensate uneven distance per frame distribution.
    // triggers controls visibility adjustment when outside action changes content width or visible area
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullContentWidth, visibleAreaWidth, isStartPosition])

  useEffect(() => {
    adjustControlsVisibility()
  }, [adjustControlsVisibility])

  const smoothScrollTo = (targetPos: number, reverse?: boolean, currentPos?: number) => {
    const domNode = scrollAreaRef.current
    if (!domNode) return

    const position = currentPos || domNode.scrollLeft

    const diff = reverse ? targetPos - position : targetPos - position - domNode.clientWidth
    if (!diff) return

    const frameDistance = Math.min(SCROLL_FRAME_DISTANCE, Math.abs(diff))
    const nextPos = diff > 0 ? position + frameDistance : position - frameDistance

    domNode.scrollTo(nextPos, 0)

    setTimeout(smoothScrollTo.bind(null, targetPos, reverse, nextPos), SCROLL_FRAME_DELAY)
  }

  const scrollLeft = (event: MouseEvent) => {
    event.preventDefault()

    if (!scrollAreaRef.current) return

    const targetPos =
      controlsScrollType === ControlScrollType.Full
        ? 0
        : scrollAreaRef.current.scrollLeft - scrollAreaRef.current.clientWidth

    smoothScrollTo(targetPos, true)
  }

  const scrollRight = (event: MouseEvent) => {
    event.preventDefault()

    if (!scrollAreaRef.current) return

    const targetPos =
      controlsScrollType === ControlScrollType.Full
        ? scrollAreaRef.current.scrollWidth + 1 // 1 is added to compensate uneven distance per frame distribution.
        : scrollAreaRef.current.clientWidth * 2 + scrollAreaRef.current.scrollLeft

    smoothScrollTo(targetPos)
  }

  const parentClassNames = classNames('u-position-relative', {
    'u-overflow-hidden': !allowVerticalOverflow,
  })

  const contentClassNames = classNames('horizontal-scroll__content', {
    // TODO: revise and remove smooth scroll if it does not lead to regressions
    'horizontal-scroll__content--ios-smooth-scroll': !disableIosSmoothScroll,
    'horizontal-scroll__content--full-width-alignment': itemsFullWidthAlignment,
  })

  function renderLeftArrow() {
    if (!showLeftArrow) return null

    return (
      <button
        type="button"
        className="horizontal-scroll__handle horizontal-scroll__left-handle"
        onClick={scrollLeft}
      >
        <Icon title={arrowLeftText} name={ChevronLeft16} color="greyscale-level-1" />
      </button>
    )
  }

  function renderRightArrow() {
    if (!showRightArrow) return null

    return (
      <button
        type="button"
        className="horizontal-scroll__handle horizontal-scroll__right-handle"
        onClick={scrollRight}
      >
        <Icon title={arrowRightText} name={ChevronRight16} color="greyscale-level-1" />
      </button>
    )
  }

  return (
    <div className={parentClassNames}>
      <div className={contentClassNames} ref={scrollAreaRef} onScroll={adjustControlsVisibility}>
        <div className="horizontal-scroll__rail">
          {children}
          {areControlsVisible && (
            <InView className="horizontal-scroll__controls">
              {renderLeftArrow()}
              {renderRightArrow()}
            </InView>
          )}
        </div>
      </div>
    </div>
  )
}

HorizontalScrollArea.Item = Item
HorizontalScrollArea.ControlScrollType = ControlScrollType

export default HorizontalScrollArea
