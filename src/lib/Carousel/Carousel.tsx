'use client'

import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'
import classNames from 'classnames/bind'

import { noop } from '../../utils/noop'
import { useDrag } from '../../hooks'

import CarouselNavigation, { CarouselNavigationStyling } from './CarouselNavigation'

import styles from './Carousel.scss'
import CarouselArrow from './CarouselArrow'
import { nextIndex, previousIndex } from './utils'
import { KeyboardKey } from '../../constants/keyboard'

/* ---------- String-union sources of truth ---------- */
export const CAROUSEL_STYLING_VALUES = ['floating'] as const
export type CarouselStyling = (typeof CAROUSEL_STYLING_VALUES)[number]

export const CAROUSEL_ARROWS_VALUES = ['inside', 'outside', 'hidden'] as const
export type CarouselArrows = (typeof CAROUSEL_ARROWS_VALUES)[number]

/* ---------- Back-compat shim (deprecated) ---------- */
export const CAROUSEL_STYLING = {
  Floating: 'floating',
} as const satisfies Record<string, CarouselStyling>

export const CAROUSEL_ARROWS = {
  Inside: 'inside',
  Outside: 'outside',
  Hidden: 'hidden',
} as const satisfies Record<string, CarouselArrows>

/* ---------- Type definitions ---------- */
export type CarouselRef = {
  scrollToSlide: (index: number, behavior?: 'auto' | 'smooth') => void
  nextSlide: () => void
  previousSlide: () => void
}

const CONTENT_DRAG_THRESHOLD = 0.2

const carouselStylingMapToNavigation: Record<CarouselStyling, CarouselNavigationStyling> = {
  floating: 'floating',
}

export type CarouselProps = {
  /**
   * If it's passed, then slides are controlled externally and show only passed index
   */
  index?: number
  slides: Array<ReactNode>
  /**
   * Does scrolling right on the last item puts you back to the first item
   */
  isInfinite?: boolean
  hideNavigation?: boolean
  navigationWithKeyboard?: boolean
  /**
   * Default - Navigation is positioned on top of content<br />
   * Floating - Navigation is positioned below content<br />
   */
  styling?: CarouselStyling | `${CarouselStyling}`
  /**
   * @default 'inside'
   */
  arrows?: CarouselArrows | `${CarouselArrows}`
  onSlideInteract?: (index: number) => void
  testId?: string
  isArrowsWideExperimental?: boolean
}

const cssClasses = classNames.bind(styles)

// scroll-behavior: 'smooth' is supported but broken in Safari 15.4+
// when parent container has overflow: hidden
// The polyfills are not an option, because Safari has scroll-behaviour, just broken
// https://developer.apple.com/forums/thread/703294
// https://bugs.webkit.org/show_bug.cgi?id=238497
const isSafari =
  typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

const CarouselBase = forwardRef<CarouselRef, CarouselProps>(
  (
    {
      index: externalIndex,
      slides,
      isInfinite = false,
      hideNavigation,
      styling,
      arrows = CAROUSEL_ARROWS.Inside,
      onSlideInteract = noop,
      testId,
      navigationWithKeyboard,
      isArrowsWideExperimental,
    },
    ref,
  ) => {
    const [internalIndex, setInternalIndex] = useState(0)
    const carouselContent = useRef<HTMLUListElement | null>(null)

    const isFirstRender = useRef(true)
    const dragStartPosition = useRef<number | undefined>(undefined)
    const onSlideInteractRef = useRef(onSlideInteract)
    onSlideInteractRef.current = onSlideInteract

    const carouselClass = cssClasses(styles.carousel, styling, {
      outside: arrows === CAROUSEL_ARROWS.Outside,
      'outside-wide': isArrowsWideExperimental,
    })
    const activeIndex = externalIndex ?? internalIndex
    const isInternalControlled = externalIndex === undefined

    const isDragging = useDrag(
      carouselContent,
      useCallback(({ horizontalChange }) => {
        if (!carouselContent.current) return

        carouselContent.current.scrollBy({ left: -horizontalChange })
      }, []),
    )

    const handleSlideChange = useCallback(
      (newIndex: number) => {
        if (isInternalControlled) setInternalIndex(newIndex)

        onSlideInteractRef.current(newIndex)
      },
      [isInternalControlled],
    )

    const scrollToSlide = useCallback(
      (slideIndex: number, scrollType: 'auto' | 'smooth' = 'smooth') => {
        const container = carouselContent.current
        if (!container) return

        const slideWidth = container.getBoundingClientRect().width
        const target = slideWidth * slideIndex
        const maxScroll = container.scrollWidth - container.clientWidth

        container.scrollTo({
          left: Math.min(target, maxScroll),
          behavior: isSafari ? 'auto' : scrollType,
        })
      },
      [],
    )

    const nextSlide = useCallback(() => {
      let newIndex = activeIndex

      if (activeIndex < slides.length - 1) {
        newIndex = activeIndex + 1
      } else if (isInfinite) {
        newIndex = 0
      }

      handleSlideChange(newIndex)
    }, [activeIndex, slides.length, isInfinite, handleSlideChange])

    const previousSlide = useCallback(() => {
      let newIndex = activeIndex

      if (activeIndex > 0) {
        newIndex = activeIndex - 1
      } else if (isInfinite) {
        newIndex = slides.length - 1
      }

      handleSlideChange(newIndex)
    }, [activeIndex, slides.length, isInfinite, handleSlideChange])

    useImperativeHandle(ref, () => ({
      scrollToSlide,
      nextSlide,
      previousSlide,
    }))

    useEffect(() => {
      if (!carouselContent.current) return

      const { clientWidth, scrollLeft } = carouselContent.current

      if (isDragging) {
        dragStartPosition.current = scrollLeft

        return
      }

      if (dragStartPosition.current === undefined || !clientWidth) return

      const scrollPosition = scrollLeft / clientWidth
      const newSlideIndex =
        scrollLeft > dragStartPosition.current
          ? Math.ceil(scrollPosition - CONTENT_DRAG_THRESHOLD)
          : Math.floor(scrollPosition + CONTENT_DRAG_THRESHOLD)

      dragStartPosition.current = undefined
      handleSlideChange(newSlideIndex)
      scrollToSlide(newSlideIndex)
    }, [isDragging, handleSlideChange, scrollToSlide, slides.length])

    useEffect(() => {
      const scrollType = isFirstRender.current ? 'auto' : 'smooth'

      if (!carouselContent.current) return

      isFirstRender.current = false

      scrollToSlide(activeIndex, scrollType)
    }, [activeIndex, scrollToSlide])

    const handleLeftArrowClick = useCallback(() => {
      handleSlideChange(previousIndex(activeIndex, slides.length, isInfinite))
    }, [activeIndex, handleSlideChange, isInfinite, slides.length])

    const handleRightArrowClick = useCallback(() => {
      handleSlideChange(nextIndex(activeIndex, slides.length, isInfinite))
    }, [activeIndex, handleSlideChange, isInfinite, slides.length])

    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        switch (event.key) {
          case KeyboardKey.Left:
          case KeyboardKey.ArrowLeft:
            event.preventDefault()
            handleLeftArrowClick()
            break
          case KeyboardKey.Right:
          case KeyboardKey.ArrowRight:
            event.preventDefault()
            handleRightArrowClick()
            break
          default:
            break
        }
      },
      [handleLeftArrowClick, handleRightArrowClick],
    )

    useEffect(() => {
      if (!navigationWithKeyboard) return undefined

      document.addEventListener('keydown', handleKeyDown)

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }, [handleKeyDown, navigationWithKeyboard])

    function renderSlide(slide: ReactNode, index: number) {
      return (
        <li key={index} className={styles.content}>
          {slide}
        </li>
      )
    }

    return (
      <section className={carouselClass} data-testid={testId}>
        <ul ref={carouselContent} className={styles['content-container']}>
          {slides.map(renderSlide)}
        </ul>
        {arrows !== 'hidden' && (
          <div role="menu">
            <CarouselArrow side="left" onClick={handleLeftArrowClick} />
            <CarouselArrow side="right" onClick={handleRightArrowClick} />
          </div>
        )}
        {!hideNavigation && (
          <div className={styles['navigation-container']}>
            <CarouselNavigation
              styling={styling ? carouselStylingMapToNavigation[styling] : undefined}
              activeSlide={activeIndex}
              slidesCount={slides.length}
              isInfinite={isInfinite}
              onBulletSelect={handleSlideChange}
            />
          </div>
        )}
      </section>
    )
  },
)

/** The public component type: a React component value that also has deprecated statics */
export type CarouselComponent = typeof CarouselBase & {
  /** @deprecated Use string unions, e.g. styling="floating" */
  Styling: typeof CAROUSEL_STYLING
  /** @deprecated Use string unions, e.g. arrows="inside" */
  Arrows: typeof CAROUSEL_ARROWS
  Navigation: typeof CarouselNavigation
}

/** Exported component: arrow fn + statics, deprecations intact, docgen-friendly */
export const ForwardedCarousel: CarouselComponent = Object.assign(CarouselBase, {
  displayName: 'Carousel',
  /** @deprecated Use string unions, e.g. styling="floating" */
  Styling: CAROUSEL_STYLING,
  /** @deprecated Use string unions, e.g. arrows="inside" */
  Arrows: CAROUSEL_ARROWS,
  Navigation: CarouselNavigation,
})

export default ForwardedCarousel
