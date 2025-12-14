'use client'

import {
  ReactNode,
  AriaAttributes,
  MouseEvent,
  KeyboardEvent,
  useState,
  useRef,
  useEffect,
} from 'react'
import classNames from 'classnames/bind'
import { arrow, offset, shift, inline, Middleware, limitShift } from '@floating-ui/react-dom'

import { onA11yKeyDown } from '../../utils/a11y/onA11yKeyDown'
import { getTestId } from '../../utils/testId'
import { KeyboardKey } from '../../constants/keyboard'
import { spacing } from '../../constants/spacing'
import useFloating from '../../hooks/useFloating'

import styles from './Tooltip.scss'

/* ---------- String-union sources of truth ---------- */
export const TOOLTIP_PLACEMENT_VALUES = [
  'top',
  'top-start',
  'top-end',
  'left',
  'right',
  'bottom',
  'bottom-start',
  'bottom-end',
] as const

export type TooltipPlacement = (typeof TOOLTIP_PLACEMENT_VALUES)[number]

/* ---------- Back-compat shim (deprecated) ---------- */
export const TOOLTIP_PLACEMENT = {
  Top: 'top',
  TopLeft: 'top-start',
  TopRight: 'top-end',
  Left: 'left',
  Right: 'right',
  Bottom: 'bottom',
  BottomLeft: 'bottom-start',
  BottomRight: 'bottom-end',
} as const satisfies Record<string, TooltipPlacement>

type SidePlacement = 'bottom' | 'left' | 'top' | 'right'

type ShiftOptions = {
  mainAxis?: boolean
  crossAxis?: boolean
}

export type TooltipProps = {
  children: ReactNode
  content: JSX.Element | string
  placement?: TooltipPlacement
  /**
   * Control if tooltip should be shown on hover
   */
  hover?: boolean
  /**
   * Use show prop when you want to control
   * tooltip visibility yourself
   */
  show?: boolean
  /**
   * Duration is used together with onClick property
   * when show and hover properties are false. It specifies
   * how long tooltip should be visible after a click.
   */
  duration?: number
  onClick?: (event: MouseEvent<HTMLDivElement>) => void
  id?: string
  aria?: AriaAttributes
  /**
   * Adds data-testid attribute to parent and children components.
   * When used, --content suffix is applied accordingly.
   */
  testId?: string
  /**
   * Controls display style of div that wraps children
   */
  display?: 'inline' | 'block'
  /**
   * It is used to set a CSS position strategy. Absolute is set by default.
   * Fixed can make it top-layer on the UI if it was hidden by absolute.
   */
  strategy?: 'absolute' | 'fixed'
  /**
   * It triggers tooltip's position to be automatically updated on window or element resize.
   */
  shouldAutoUpdate?: boolean
  /**
   * Moves the tooltip along the specified axes in order to keep it in view.
   * Refer to https://floating-ui.com/docs/shift for more info
   */
  shiftOptions?: ShiftOptions
}

const cssClasses = classNames.bind(styles)

const TooltipBase = ({
  children,
  placement = 'top',
  content,
  hover = true,
  show,
  duration = 1000,
  onClick = () => undefined,
  id,
  aria,
  testId,
  display = 'block',
  strategy = 'absolute',
  shiftOptions,
  shouldAutoUpdate = false,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)

  const arrowRef = useRef(null)

  const isInline = display === 'inline'

  const isShowOnHoverDisabled = show || !hover
  const isShowOnClickDisabled = show || hover

  const middleware = [
    isInline ? inline() : undefined,
    offset(spacing.medium),
    shiftOptions
      ? shift({
          mainAxis: shiftOptions.mainAxis ?? true,
          crossAxis: shiftOptions.crossAxis ?? true,
          padding: spacing.small,
          limiter: limitShift(),
          rootBoundary: 'viewport',
          elementContext: 'floating',
          altBoundary: false,
        })
      : undefined,
    arrow({ element: arrowRef, padding: spacing.large }),
  ].filter((mware: Middleware | undefined): mware is Middleware => !!mware)

  const {
    triggerRef,
    floaterRef,
    floaterStyle,
    middlewareData: { arrow: { x: arrowLeft, y: arrowTop } = {} },
  } = useFloating({
    placement,
    middleware,
    shouldAutoUpdate,
    strategy,
  })

  useEffect(() => {
    if (!duration || isShowOnClickDisabled || !isVisible) {
      return undefined
    }

    const timeoutId = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => clearTimeout(timeoutId)
  }, [duration, isShowOnClickDisabled, isVisible])

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!isShowOnClickDisabled) {
      setIsVisible(!isVisible)
    }

    onClick(event)
  }

  const handleBlur = () => {
    if (isShowOnHoverDisabled) return

    setIsVisible(false)
  }

  const handleFocus = () => {
    if (isShowOnHoverDisabled) return

    setIsVisible(true)
  }

  const handleKeyDown = (event: KeyboardEvent) =>
    onA11yKeyDown(event, { keys: KeyboardKey.Escape }, handleBlur)

  const containerClass = cssClasses(styles.container, {
    hoverable: hover,
    inline: isInline,
  })

  const tooltipClass = cssClasses(styles.tooltip, {
    'is-shown': show ?? isVisible,
  })

  const staticSidePlacements: { [x: string]: SidePlacement } = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }

  const staticSide: SidePlacement | undefined = staticSidePlacements[placement.split('-')[0]]

  const arrowStaticSidePosition = '-4px'
  const arrowPosition = {
    left: arrowLeft == null ? '' : `${arrowLeft}px`,
    top: arrowTop == null ? '' : `${arrowTop}px`,
    [staticSide]: arrowStaticSidePosition,
  }

  return (
    <>
      <div
        role="presentation"
        className={containerClass}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-testid={testId}
        ref={triggerRef}
        {...aria}
      >
        {children}
      </div>
      <div
        role="tooltip"
        id={id}
        className={tooltipClass}
        data-testid={getTestId(testId, 'content')}
        ref={floaterRef}
        style={floaterStyle}
        {...(!(show ?? isVisible) && { 'aria-hidden': true })}
      >
        {content}
        <div className={styles.arrow} ref={arrowRef} style={arrowPosition} />
      </div>
    </>
  )
}

/** The public component type: a React component value that also has deprecated statics */
export type TooltipComponent = typeof TooltipBase & {
  /**
   * @deprecated Use string literals instead: 'top' | 'top-start' | 'top-end' | 'left' | 'right' | 'bottom' | 'bottom-start' | 'bottom-end'
   */
  Placement: typeof TOOLTIP_PLACEMENT
}

/** Exported component: arrow fn + statics, deprecations intact, docgen-friendly */
export const Tooltip: TooltipComponent = Object.assign(TooltipBase, {
  /**
   * @deprecated Use string literals instead: 'top' | 'top-start' | 'top-end' | 'left' | 'right' | 'bottom' | 'bottom-start' | 'bottom-end'
   */
  Placement: TOOLTIP_PLACEMENT,
})

export default Tooltip
