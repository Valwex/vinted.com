'use client'

import { useMemo } from 'react'
import classNames from 'classnames/bind'

import { Theme, VintedTheme } from '../types'

import Card from '../Card'
import Cell from '../Cell'

import styles from './Loader.scss'

/* ---------- String-union sources of truth ---------- */
export const LOADER_SIZE_VALUES = [
  'small',
  'medium',
  'default',
  'large',
  'x-large',
  'x2-large',
  'x3-large',
] as const
export type LoaderSize = (typeof LOADER_SIZE_VALUES)[number]

export const LOADER_STYLING_VALUES = ['lifted'] as const
export type LoaderStyling = (typeof LOADER_STYLING_VALUES)[number]

export const LOADER_STATE_VALUES = ['success', 'fail'] as const
export type LoaderState = (typeof LOADER_STATE_VALUES)[number]

export const LOADER_THEME_VALUES = [
  'primary',
  'amplified',
  'muted',
  'success',
  'warning',
  'expose',
  'transparent',
] as const satisfies ReadonlyArray<VintedTheme>

export type LoaderTheme = Theme<(typeof LOADER_THEME_VALUES)[number]> | null

/* ---------- Back-compat shim (deprecated) ---------- */
export const LOADER_SIZE = {
  Small: 'small',
  Medium: 'medium',
  Default: 'default',
  Large: 'large',
  XLarge: 'x-large',
  X2Large: 'x2-large',
  X3Large: 'x3-large',
} as const satisfies Record<string, LoaderSize>

export const LOADER_STYLING = {
  Lifted: 'lifted',
} as const satisfies Record<string, LoaderStyling>

export const LOADER_STATE = {
  Success: 'success',
  Fail: 'fail',
} as const satisfies Record<string, LoaderState>

export type LoaderProps = {
  size?: LoaderSize
  state?: LoaderState
  styling?: LoaderStyling | null
  theme?: LoaderTheme
  testId?: string
}

// eslint-disable-next-line id-length
const circleProps = (offset: number, radius: number) => ({ cx: offset, cy: offset, r: radius })

const LOADER_CIRCLE_SIZE_MAP: Record<LoaderSize, { cx: number; cy: number; r: number }> = {
  small: circleProps(5, 4),
  medium: circleProps(7, 6),
  default: circleProps(10, 9),
  large: circleProps(14, 12.5),
  'x-large': circleProps(20, 18),
  'x2-large': circleProps(30, 27),
  'x3-large': circleProps(40, 36),
}

const cssClasses = classNames.bind(styles)

const LoaderBase = ({
  size = 'default',
  state,
  styling,
  theme = 'primary',
  testId,
}: LoaderProps) => {
  const renderedLoader = useMemo(() => {
    const loaderSize = LOADER_CIRCLE_SIZE_MAP[size]
    const loaderClass = cssClasses(styles.loader, size, state, styling, theme)

    return (
      <div className={loaderClass} data-testid={testId} role="progressbar">
        <svg className={cssClasses('loader-svg')}>
          <circle className={cssClasses('circle')} {...loaderSize} />
        </svg>
      </div>
    )
  }, [size, state, styling, theme, testId])

  if (styling !== 'lifted') return renderedLoader

  return (
    <div className={cssClasses('container')}>
      <Card styling="elevated">
        <div className={cssClasses('wrapper')}>
          <Cell>{renderedLoader}</Cell>
        </div>
      </Card>
    </div>
  )
}

/** The public component type: a React component value that also has deprecated statics */
export type LoaderComponent = React.FC<LoaderProps> & {
  /** @deprecated Use string unions, e.g. <Loader size="small" /> */
  Size: typeof LOADER_SIZE
  /** @deprecated Use string unions, e.g. <Loader styling="lifted" /> */
  Styling: typeof LOADER_STYLING
  /** @deprecated Use string unions, e.g. <Loader state="success" /> */
  State: typeof LOADER_STATE
}

/** Exported component: arrow fn + statics, deprecations intact, docgen-friendly */
export const Loader: LoaderComponent = Object.assign(LoaderBase, {
  /** @deprecated Use string unions, e.g. <Loader size="small" /> */
  Size: LOADER_SIZE,
  /** @deprecated Use string unions, e.g. <Loader styling="lifted" /> */
  Styling: LOADER_STYLING,
  /** @deprecated Use string unions, e.g. <Loader state="success" /> */
  State: LOADER_STATE,
})

export default Loader
