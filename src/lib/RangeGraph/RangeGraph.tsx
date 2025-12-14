'use client'

import { ReactNode } from 'react'

import Tooltip from '../Tooltip/Tooltip'
import type { TooltipPlacement } from '../Tooltip/Tooltip'
import styles from './RangeGraph.scss'

/* ---------- String-union sources of truth ---------- */
export const RANGE_GRAPH_POSITION_VALUES = ['high', 'low', 'typical'] as const
export type RangeGraphPosition = (typeof RANGE_GRAPH_POSITION_VALUES)[number]

/* ---------- Back-compat shim (deprecated) ---------- */
export const RANGE_GRAPH_POSITION = {
  High: 'high',
  Low: 'low',
  Typical: 'typical',
} as const satisfies Record<string, RangeGraphPosition>

export type RangeGraphProps = {
  lower: ReactNode
  upper: ReactNode
  showLabel: boolean
  label: ReactNode
  position: RangeGraphPosition
}

const positionToPlacement = {
  low: 'top-start',
  high: 'top-end',
  typical: 'top',
} as const satisfies Record<RangeGraphPosition, TooltipPlacement>

const RangeGraphBase = ({ lower, upper, label, position, showLabel }: RangeGraphProps) => (
  <div className={styles.container}>
    <Tooltip
      placement={positionToPlacement[position]}
      hover={false}
      show={showLabel}
      content={<div className="u-text-left">{label}</div>}
    >
      <div className={styles.slider}>
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </div>
      <div className={styles.label}>
        {lower}
        {upper}
      </div>
    </Tooltip>
  </div>
)

/** The public component type: a React component value that also has deprecated statics */
export type RangeGraphComponent = typeof RangeGraphBase & {
  /** @deprecated Use string literals instead: 'high' | 'low' | 'typical' */
  Position: typeof RANGE_GRAPH_POSITION
}

/** Exported component: arrow fn + statics, deprecations intact, docgen-friendly */
export const RangeGraph: RangeGraphComponent = Object.assign(RangeGraphBase, {
  /** @deprecated Use string literals instead: 'high' | 'low' | 'typical' */
  Position: RANGE_GRAPH_POSITION,
})

export default RangeGraph
