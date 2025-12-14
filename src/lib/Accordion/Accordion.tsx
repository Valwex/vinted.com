'use client'

import classNames from 'classnames/bind'
import { FC } from 'react'

import { ChevronDown24, ChevronUp24 } from '@vinted/monochrome-icons'

import Cell from '../Cell'
import Icon from '../Icon'

import { getTestId } from '../../utils/testId'

import styles from './Accordion.scss'
import { noop } from '../../utils/noop'
import { randomId } from '../../utils/randomId'

/* ---------- String-union sources of truth ---------- */
export const ACCORDION_STYLING_VALUES = ['regular', 'narrow', 'wide', 'tight-experimental'] as const
export type AccordionStyling = (typeof ACCORDION_STYLING_VALUES)[number]

/* ---------- Back-compat shims (public API) ---------- */
export const ACCORDION_STYLING = {
  Regular: 'regular',
  Narrow: 'narrow',
  Wide: 'wide',
  TightExperimental: 'tight-experimental',
} as const satisfies Record<string, AccordionStyling>

/* ---------- Type definitions ---------- */
type CellStylingType = (typeof Cell.Styling)[keyof typeof Cell.Styling]

const ACCORDION_CELL_STYLE_MAP: Record<AccordionStyling, CellStylingType | undefined> = {
  regular: undefined,
  narrow: 'narrow',
  wide: 'wide',
  'tight-experimental': 'tight',
}

export type AccordionProps = {
  /**
   * Styling that gets passed to `Cell` components wrapping title and content.
   * @default 'regular'
   */
  styling?: AccordionStyling
  /**
   * Title of the component that is visible when the accordion is closed.
   * Additional content is revealed when the title is clicked.
   */
  title: React.ReactNode | string
  /**
   * Sets suffix that is displayed when the component is not expanded.
   */
  content: React.ReactNode | string
  /**
   * Sets suffix that is displayed when the component is expanded.
   */
  closedSuffix?: JSX.Element | string | null
  /**
   * Sets prefix that is displayed when the component is not expanded.
   */
  expandedSuffix?: JSX.Element | string | null
  /**
   * Sets prefix that is displayed when the component is expanded.
   */
  closedPrefix?: JSX.Element | string | null
  /**
   * Sets prefix that is displayed when the component is expanded.
   */
  expandedPrefix?: JSX.Element | string | null
  /**
   * Controls the expanded/closed state | default value false.
   */
  isExpanded: boolean
  headerId?: string
  bodyId?: string
  onToggle: (isExpanded: boolean) => void
  /**
   * Experimental property which inverts colors.
   */
  inverseExperimental?: boolean
  /**
   * Adds data-testid attribute to children components.
   * When used, --header and --content suffixes are applied accordingly
   */
  testId?: string
}

const cssClasses = classNames.bind(styles)

const AccordionBase = ({
  styling = 'regular',
  title,
  content,
  closedSuffix = <Icon name={ChevronDown24} color="greyscale-level-2" display="block" />,
  expandedSuffix = <Icon name={ChevronUp24} color="greyscale-level-2" display="block" />,
  closedPrefix,
  expandedPrefix,
  isExpanded = false,
  headerId: initialHeaderId = `accordion-header${randomId()}`,
  bodyId: initialBodyId = `accordion-body${randomId()}`,
  onToggle = noop,
  inverseExperimental,
  testId,
}: AccordionProps) => {
  const handleTitleClick = () => {
    onToggle(!isExpanded)
  }

  const renderHeader = () => {
    const suffix = isExpanded ? expandedSuffix : closedSuffix
    const prefix = isExpanded ? expandedPrefix : closedPrefix

    return (
      <Cell
        id={initialHeaderId}
        theme={inverseExperimental ? 'inverseExperimental' : undefined}
        styling={ACCORDION_CELL_STYLE_MAP[styling]}
        suffix={suffix}
        prefix={prefix}
        type="navigating"
        title={title}
        onClick={handleTitleClick}
        role="button"
        aria={{
          'aria-expanded': isExpanded,
          'aria-controls': initialBodyId,
        }}
        testId={getTestId(testId, 'header')}
      />
    )
  }

  const renderBody = () => {
    const bodyClass = cssClasses(styles.body, { expanded: isExpanded })
    const contentClass = cssClasses(styling)

    return (
      <div
        hidden={!isExpanded}
        aria-hidden={!isExpanded}
        className={bodyClass}
        data-testid={getTestId(testId, 'body')}
      >
        <Cell
          id={initialBodyId}
          styling="tight"
          theme={inverseExperimental ? 'inverseExperimental' : undefined}
          body={<div className={contentClass}>{content}</div>}
          role="region"
          aria={{
            'aria-labelledby': initialHeaderId,
          }}
          testId={getTestId(testId, 'content')}
        />
      </div>
    )
  }

  return (
    <div data-testid={testId}>
      {renderHeader()}
      {renderBody()}
    </div>
  )
}

/** The public component type: a React component value that also has deprecated statics */
export type AccordionComponent = FC<AccordionProps> & {
  /** @deprecated Use string unions, e.g. styling="narrow" */
  Styling: typeof ACCORDION_STYLING
}

/** Exported component: arrow fn + statics, deprecations intact, docgen-friendly */
export const Accordion: AccordionComponent = Object.assign(AccordionBase, {
  /** @deprecated Use string unions, e.g. styling="narrow" */
  Styling: ACCORDION_STYLING,
})

export default Accordion
