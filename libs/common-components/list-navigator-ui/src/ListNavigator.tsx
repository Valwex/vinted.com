'use client'

import { Dispatch, KeyboardEvent, ReactNode, SetStateAction } from 'react'

import { KeyboardKey } from '@marketplace-web/vendor-abstractions/web-ui-util'

export type RenderProps = {
  highlightedResultIndex: number | null
  handleKeyNavigation: (event: KeyboardEvent) => void
}

type Props = {
  highlightedResultIndex: number | null
  setHighlightedResultIndex: Dispatch<SetStateAction<number | null>>
  itemCount: number
  onSelect?: (selectedIndex: number, event: KeyboardEvent) => void
  children: (props: RenderProps) => ReactNode
  onHighlightedResultChange?: (highlightedResultIndex: number | null) => void
  resetOnUnknownKey?: boolean
}

const LOWER_LIMIT = 0

const ListNavigator = ({
  highlightedResultIndex,
  setHighlightedResultIndex,
  itemCount,
  onSelect,
  children,
  onHighlightedResultChange,
  resetOnUnknownKey = true,
}: Props) => {
  const resetHighlightedResult = () => {
    setHighlightedResultIndex(null)
  }

  const setHighlightedSearchResult = (
    isValueInRange: boolean,
    modifier: number,
    nullModifier: number,
    callback?: (index: number | null) => void,
  ) => {
    if (isValueInRange) {
      setHighlightedResultIndex(prevState => {
        const newIndex = prevState === null ? nullModifier : prevState + modifier
        callback?.(newIndex)

        return newIndex
      })
    } else {
      resetHighlightedResult()
    }
  }

  const handleKeyNavigation = (event: KeyboardEvent) => {
    const { key } = event
    const upperLimit = itemCount - 1

    if (!itemCount) return

    switch (key) {
      case KeyboardKey.ArrowDown:
        event.preventDefault()

        setHighlightedSearchResult(
          (highlightedResultIndex ?? LOWER_LIMIT - 1) < upperLimit,
          1,
          LOWER_LIMIT,
          onHighlightedResultChange,
        )
        break

      case KeyboardKey.ArrowUp:
        event.preventDefault()

        setHighlightedSearchResult(
          (highlightedResultIndex ?? upperLimit + 1) > LOWER_LIMIT,
          -1,
          upperLimit,
          onHighlightedResultChange,
        )
        break

      case KeyboardKey.Enter:
        if (highlightedResultIndex === null) break

        event.preventDefault()

        if (onSelect) onSelect(highlightedResultIndex, event)
        break

      default:
        if (!resetOnUnknownKey) return

        resetHighlightedResult()
    }
  }

  const renderChildrenWithProps = children({
    highlightedResultIndex,
    handleKeyNavigation,
  })

  return renderChildrenWithProps
}

export default ListNavigator
