'use client'

import { DragEvent as ReactDragEvent, useCallback, useRef, useState } from 'react'

import classNames from 'classnames'
import { includes } from 'lodash'

import { useEvent } from '@vinted/web-ui'

import DefaultText from './DefaultText'

type Props = {
  onDrop?: (files: Array<File>) => void
  overlayDescription: string
  background?: 'default' | 'primary'
}

const INITIAL_DRAG_STATE = {
  dragEnter: 0,
  dragLeave: 0,
}

const Dropzone = ({
  onDrop,
  overlayDescription,
  children,
  background = 'default',
}: React.PropsWithChildren<Props>) => {
  const dropzoneRef = useRef<HTMLDivElement>(null)

  const [isDragging, setIsDragging] = useState(false)

  const dragEventCache = useRef({ ...INITIAL_DRAG_STATE })

  const validateDraggedItem = useCallback((event: DragEvent) => {
    const includesFiles =
      event.dataTransfer?.types &&
      event.dataTransfer.types.length > 0 &&
      includes(event.dataTransfer.types, 'Files')

    if (!includesFiles) {
      return false
    }

    return includesFiles
  }, [])

  const onDragEnter = useCallback(
    (event: DragEvent) => {
      dragEventCache.current.dragEnter += 1

      if (isDragging) return

      if (validateDraggedItem(event)) {
        setIsDragging(true)
      }
    },
    [isDragging, validateDraggedItem],
  )

  const onDragLeave = useCallback((event: DragEvent) => {
    dragEventCache.current.dragLeave += 1

    event.preventDefault()
    event.stopPropagation()

    // Safari doesnt pass relatedTarget to the dragleave event,
    // so instead we'll keep track of the number of dragEnter and dragLeave events
    // and if they are equal, we'll know the user has left the window.
    if (dragEventCache.current.dragEnter === dragEventCache.current.dragLeave) {
      setIsDragging(false)
    }
  }, [])

  const onDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (event: ReactDragEvent) => {
      event.preventDefault()
      event.stopPropagation()

      const targetNode = event.target

      if (!(targetNode instanceof Node)) return

      const domNode = dropzoneRef.current
      const files = event.dataTransfer?.files

      if (files && domNode?.contains(targetNode)) {
        if (onDrop) onDrop(Array.from(files))
      }

      dragEventCache.current = {
        ...INITIAL_DRAG_STATE,
      }

      setIsDragging(false)
    },
    [onDrop],
  )

  const handleDragOver = useCallback((event: ReactDragEvent) => {
    event.preventDefault()
  }, [])

  useEvent('dragenter', onDragEnter)
  useEvent('dragend', onDragEnd)
  useEvent('dragleave', onDragLeave)

  return (
    <div
      className={classNames('dropzone', {
        'dropzone-border-background-color-primary': background === 'primary',
        'dropzone-border-default': background === 'default',
      })}
      data-testid="dropzone"
    >
      <div
        data-testid="dropzone-overlay"
        className={classNames(
          'dropzone__overlay',
          { 'dropzone__overlay-dragging': isDragging },
          {
            'dropzone__overlay-background-color-primary': background === 'primary',
            'dropzone__overlay-background-color-default': background === 'default',
          },
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        ref={dropzoneRef}
      >
        <div className="dropzone__overlay-description">
          <DefaultText text={overlayDescription} />
        </div>
      </div>

      {children}
    </div>
  )
}

export default Dropzone
