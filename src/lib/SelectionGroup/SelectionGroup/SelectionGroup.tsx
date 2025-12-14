'use client'

import {
  ReactElement,
  MouseEvent,
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  ComponentProps,
} from 'react'

import classNames from 'classnames/bind'

import styles from './SelectionGroup.scss'
import { isElementVisible } from '../hooks/useIsElementVisible'
import { scrollToElement } from '../hooks/useScrollToItem'
import { useScrollToPreSelectedItem } from '../hooks/useScrollToPreSelectedItem'
import SelectionItem, { SELECTION_ITEM_CLASS } from '../SelectionItem/SelectionItem'
import { getTestId } from '../../../utils/testId'
import { mergeRefs } from '../../../utils/mutableRefs'

/* ---------- String-union sources of truth ---------- */
export const SELECTION_GROUP_STYLING_VALUES = ['default', 'tight', 'narrow', 'wide'] as const
export type SelectionGroupStyling = (typeof SELECTION_GROUP_STYLING_VALUES)[number]

export const SELECTION_GROUP_DIRECTION_VALUES = ['vertical', 'horizontal'] as const
export type SelectionGroupDirection = (typeof SELECTION_GROUP_DIRECTION_VALUES)[number]

export const SELECTION_GROUP_LAYOUT_VALUES = ['default', 'scroll'] as const
export type SelectionGroupLayout = (typeof SELECTION_GROUP_LAYOUT_VALUES)[number]

/* ---------- Back-compat shim (deprecated) ---------- */
export const SELECTION_GROUP_STYLING = {
  Default: 'default',
  Tight: 'tight',
  Narrow: 'narrow',
  Wide: 'wide',
} as const satisfies Record<string, SelectionGroupStyling>

export const SELECTION_GROUP_DIRECTION = {
  Vertical: 'vertical',
  Horizontal: 'horizontal',
} as const satisfies Record<string, SelectionGroupDirection>

export const SELECTION_GROUP_LAYOUT = {
  Default: 'default',
  Scroll: 'scroll',
} as const satisfies Record<string, SelectionGroupLayout>

/* ---------- Type definitions ---------- */
export type SelectionGroupProps = {
  /**
   * Controls the styling variant of the selection group.
   * @default 'default'
   */
  styling?: SelectionGroupStyling
  children?: Array<ReactElement<ComponentProps<typeof SelectionItem>>>
  /**
   * Controls the direction of the selection group.
   * @default 'vertical'
   */
  direction?: SelectionGroupDirection
  /**
   * Controls the layout behavior of the selection group.
   * @default 'scroll'
   */
  layout?: SelectionGroupLayout
  height?: string
  forwardedRef?: ForwardedRef<HTMLDivElement>
  testId?: string
}

const cssClasses = classNames.bind(styles)

const SelectionGroupBase = ({
  styling = 'default',
  direction = 'vertical',
  layout = 'scroll',
  children,
  height,
  forwardedRef,
  testId,
}: SelectionGroupProps) => {
  const selectionGroupClasses = cssClasses('selection_group', styling, {
    [styles.horizontal]: direction === 'horizontal',
    [styles.vertical]: direction === 'vertical',
    [styles['distribute-evenly']]: layout === 'default',
    [styles.scroll]: layout === 'scroll',
  })

  const containerRef = useScrollToPreSelectedItem(
    children,
    direction === 'vertical' ? 'vertical' : 'horizontal',
    layout,
  )

  const handleClick =
    (callback?: (event: MouseEvent<HTMLDivElement>) => void) =>
    async (event: MouseEvent<HTMLDivElement>) => {
      if (callback) {
        callback(event)
      }

      if (layout !== 'scroll') return

      const clickedElement = event.target instanceof HTMLElement ? event.target : null
      if (!clickedElement || !containerRef.current) return

      const closestElement = clickedElement.closest(`.${SELECTION_ITEM_CLASS}`)
      if (!closestElement) return

      const isVisible = await isElementVisible(closestElement)

      if (!isVisible) {
        if (direction === 'vertical') {
          scrollToElement(containerRef, { current: closestElement as HTMLDivElement }, 'vertical')
        } else {
          scrollToElement(containerRef, { current: closestElement as HTMLDivElement }, 'horizontal')
        }
      }
    }

  const renderItems = () => {
    if (!children) return null

    return (
      <div
        className={selectionGroupClasses}
        {...(layout !== SELECTION_GROUP_LAYOUT.Default && { style: { height, minHeight: height } })}
        data-testid={getTestId(testId, 'main')}
        ref={mergeRefs(forwardedRef, containerRef)}
      >
        {children.map((child, index) => (
          <SelectionItem
            key={index}
            {...child.props}
            className={
              child.props.className
                ? [direction, child.props.className].join('')
                : (direction as string)
            }
            onClick={handleClick(child.props.onClick)}
          />
        ))}
      </div>
    )
  }

  return renderItems()
}

/** The public component type: a React component value that also has deprecated statics */
export type RefComponent = ForwardRefExoticComponent<
  SelectionGroupProps & RefAttributes<HTMLDivElement>
> & {
  /** @deprecated Use string unions, e.g. styling="tight" */
  Styling: typeof SELECTION_GROUP_STYLING
  /** @deprecated Use string unions, e.g. direction="horizontal" */
  Direction: typeof SELECTION_GROUP_DIRECTION
  /** @deprecated Use string unions, e.g. layout="scroll" */
  Layout: typeof SELECTION_GROUP_LAYOUT
  SelectionItem: typeof SelectionItem
}

const SelectionGroup = SelectionGroupBase

// BUG: default exports do not auto-generate storybook ArgsTable
// https://github.com/storybookjs/storybook/issues/9511
// remove export when resolved
const SelectionGroupWithForwardRefBase = forwardRef<HTMLDivElement, SelectionGroupProps>(
  (props, ref) => <SelectionGroup forwardedRef={ref} {...props} />,
)

SelectionGroupWithForwardRefBase.displayName = SelectionGroup.name

/** Exported component: arrow fn + statics, deprecations intact, docgen-friendly */
export const SelectionGroupWithForwardRef: RefComponent = Object.assign(
  SelectionGroupWithForwardRefBase,
  {
    /** @deprecated Use string unions, e.g. styling="tight" */
    Styling: SELECTION_GROUP_STYLING,
    /** @deprecated Use string unions, e.g. direction="horizontal" */
    Direction: SELECTION_GROUP_DIRECTION,
    /** @deprecated Use string unions, e.g. layout="scroll" */
    Layout: SELECTION_GROUP_LAYOUT,
    SelectionItem,
  },
)

export default SelectionGroupWithForwardRef
