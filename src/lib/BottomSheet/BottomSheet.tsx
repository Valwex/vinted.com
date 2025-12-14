'use client'

import {
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react'
import ReactModal from 'react-modal'
import classNames from 'classnames/bind'

import { X24 } from '@vinted/monochrome-icons'

import { useEvent, useTouchDrag } from '../../hooks'
import { OnDragCallback } from '../../hooks/useDrag/type'
import { getTestId } from '../../utils/testId'
import Button from '../Button'
import Divider from '../Divider'
import Icon from '../Icon'
import Navigation from '../Navigation'
import Handle from './Handle'
import { CloseTarget } from '../../constants/portal'

import styles from './BottomSheet.scss'
import { noop } from '../../utils/noop'

const MIN_CONTENT_HEIGHT = 80

export const BOTTOM_SHEET_HEIGHT_VALUES = [1, 0.5] as const

export type BottomSheetHeight = (typeof BOTTOM_SHEET_HEIGHT_VALUES)[number]

/* ---------- Back-compat shims (public API) ---------- */
export const BOTTOM_SHEET_HEIGHT = {
  FullHeight: 1,
  HalfHeight: 0.5,
} as const satisfies Record<string, BottomSheetHeight>

export type BottomSheetProps = {
  isVisible: boolean
  children: ReactNode
  title?: ReactNode
  closeButtonEnabled?: boolean
  initialHeight?: BottomSheetHeight
  /**
   * Overrides initial height.
   */
  customHeight?: number
  /**
   * Fires `onClose` when clicking on overlay.
   */
  closeOnOverlayClick?: boolean
  onClose: (target: CloseTarget | `${CloseTarget}`) => void
  onAfterOpen?: () => void
  /**
   * Adds data-testid attribute to parent and children components.
   * When used, --navigation, --close-button, --content suffixes applied accordingly.
   */
  testId?: string
  a11yCloseIconTitle?: string
}

const cssClasses = classNames.bind(styles)

const BottomSheetBase = ({
  isVisible,
  title,
  onClose = noop,
  closeButtonEnabled,
  initialHeight = 0.5,
  customHeight,
  closeOnOverlayClick = true,
  onAfterOpen = noop,
  children,
  testId,
  a11yCloseIconTitle,
}: BottomSheetProps) => {
  const bottomSheetRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [maxHeight, setMaxHeight] = useState(0)
  const [isDirty, setIsDirty] = useState(false)

  const resetHeight = useCallback(() => {
    if (isDirty) return

    const targetHeight = window.innerHeight * Number(initialHeight)
    const maxAllowed = window.innerHeight * 0.85

    setMaxHeight(Math.min(targetHeight, maxAllowed))
  }, [initialHeight, isDirty])

  useEffect(resetHeight, [resetHeight, children])
  useEvent('resize', resetHeight)

  const handleBottomSheetHeight = useCallback<OnDragCallback>(
    ({ verticalChange }, event) => {
      if (!contentRef.current || !bottomSheetRef.current) return

      setIsDirty(true)
      const bottomSheetHeight = bottomSheetRef.current.clientHeight
      const freeSpaceAtTop = window.innerHeight - bottomSheetHeight
      const freeScrollSpace = contentRef.current.scrollHeight - contentRef.current.clientHeight
      let hasScrollContent = false

      if (verticalChange < 0) {
        // Grow only if it's possible to scroll down and there's free space at the top
        if (freeSpaceAtTop <= 0) hasScrollContent = true
        if (event instanceof WheelEvent && freeScrollSpace <= 0) hasScrollContent = true
      } else if (
        event.target instanceof Element &&
        contentRef.current.contains(event.target) &&
        contentRef.current.scrollTop
      ) {
        // Check if it's impossible to scroll up anymore
        hasScrollContent = true
      }

      if (hasScrollContent) {
        contentRef.current.scrollTop -= verticalChange

        return
      }

      if (event.cancelable) event.preventDefault()

      const maxAllowed = window.innerHeight * 0.85

      // handle content srolling behaviour once max height is reached
      if (bottomSheetHeight >= maxAllowed && verticalChange < 0) {
        contentRef.current.scrollTop -= verticalChange

        return
      }

      // limit height increase to available space above or scroll area
      const heightChange = Math.min(-verticalChange, freeScrollSpace, freeSpaceAtTop)
      const newContentHeight = heightChange + contentRef.current.clientHeight

      if (!closeOnOverlayClick && newContentHeight < MIN_CONTENT_HEIGHT) {
        return
      }

      const newMaxHeight = bottomSheetHeight + heightChange
      setMaxHeight(Math.min(newMaxHeight, maxAllowed))

      if (verticalChange > 0 && newContentHeight < MIN_CONTENT_HEIGHT) {
        onClose(CloseTarget.SwipeDown)
      }
    },
    [bottomSheetRef, closeOnOverlayClick, contentRef, onClose],
  )

  const handleWheel = useCallback(
    (event: WheelEvent) =>
      handleBottomSheetHeight(
        // Inverting delta values to match dragging
        { verticalChange: -event.deltaY, horizontalChange: -event.deltaX },
        event,
      ),
    [handleBottomSheetHeight],
  )

  useEvent('wheel', handleWheel, contentRef, { passive: false })
  useTouchDrag(bottomSheetRef, handleBottomSheetHeight)

  const handleOverlayClose = (event: MouseEvent | KeyboardEvent) => {
    if (event.type === 'click') {
      onClose(CloseTarget.Overlay)
    } else {
      onClose(CloseTarget.EscapeButton)
    }
  }

  const handleCloseIconClick = () => {
    onClose(CloseTarget.CloseIcon)
  }

  function renderHeader() {
    if (!closeButtonEnabled && !title) return null

    return (
      <>
        <Navigation
          theme="transparent"
          body={title}
          right={
            <Button
              styling="flat"
              icon={<Icon name={X24} title={a11yCloseIconTitle} />}
              onClick={handleCloseIconClick}
              testId={getTestId(testId, 'close-button')}
            />
          }
          testId={getTestId(testId, 'navigation')}
        />
        <Divider />
      </>
    )
  }

  return (
    <ReactModal
      isOpen={isVisible}
      onRequestClose={handleOverlayClose}
      onAfterOpen={onAfterOpen}
      portalClassName={cssClasses('portal')}
      overlayClassName={cssClasses('overlay')}
      bodyOpenClassName={cssClasses('modal-open')}
      htmlOpenClassName={cssClasses('modal-open')}
      className={{
        base: cssClasses('bottom-sheet'),
        afterOpen: cssClasses('after-open'),
        beforeClose: cssClasses('before-close'),
      }}
      shouldCloseOnOverlayClick={closeOnOverlayClick}
      closeTimeoutMS={Number(styles['bottom-sheet-animation-speed'])}
      style={{
        content: { ...(customHeight ? { maxHeight: customHeight } : { maxHeight }) },
      }}
      // Disables warning that tries to hide main app when modal is shown
      ariaHideApp={false}
      contentRef={element => {
        if (bottomSheetRef.current !== element) {
          bottomSheetRef.current = element
        }
      }}
      testId={testId}
    >
      <Handle onDrag={handleBottomSheetHeight} />
      <div className={cssClasses('container')}>
        {renderHeader()}
        <div
          className={cssClasses('content')}
          ref={contentRef}
          data-testid={getTestId(testId, 'content')}
        >
          {children}
        </div>
      </div>
    </ReactModal>
  )
}

/** The public component type: a React component value that also has deprecated statics */
export type BottomSheetComponent = typeof BottomSheetBase & {
  /**
   * @deprecated Use numeric literals instead: 1 | 0.5
   */
  Height: typeof BOTTOM_SHEET_HEIGHT
  /**
   * @deprecated Use CloseTarget constants directly
   */
  CloseTarget: typeof CloseTarget
}

/** Exported component: arrow fn + statics, deprecations intact, docgen-friendly */
export const BottomSheet: BottomSheetComponent = Object.assign(BottomSheetBase, {
  /**
   * @deprecated Use numeric literals instead: 1 | 0.5
   */
  Height: BOTTOM_SHEET_HEIGHT,
  /**
   * @deprecated Use CloseTarget constants directly
   */
  CloseTarget,
})

export default BottomSheet
