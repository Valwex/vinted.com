'use client'

/* eslint-disable no-param-reassign */

import { ReactNode, useContext, useLayoutEffect, useRef } from 'react'

import { FocusContainerContext } from '../FocusContainerContext'

type Container = {
  parent: HTMLDivElement
  child: HTMLDivElement
}

const verticalNegativeTranslate = (value: number) => `translate(0px, -${value}px)`

const setHiddenStyle = ({ parent, child }: Container) => {
  parent.style.height = '0px'
  parent.style.opacity = '0'
  child.style.transform = verticalNegativeTranslate(parent.scrollHeight)
}

const setRevealedStyle = (
  { parent, child }: Container,
  { naturalHeight }: { naturalHeight: number },
) => {
  parent.style.height = `${naturalHeight}px`
  parent.style.opacity = '1'
  child.style.transform = verticalNegativeTranslate(0)
}

const addTransitionClasses = ({ parent, child }: Container) => {
  parent.classList.add('auth__reveal-on-focus-parent--transition')
  child.classList.add('auth__reveal-on-focus-child--transition')
}

const getNaturalHeight = ({ parent }: Container) => {
  parent.style.height = 'auto'
  const naturalHeight = parent.scrollHeight
  parent.style.height = '0px'

  return naturalHeight
}

export const RevealOnFocus = ({ children }: { children: ReactNode }) => {
  const parentRef = useRef<HTMLDivElement>(null)
  const childRef = useRef<HTMLDivElement>(null)
  const isFirstMount = useRef(true)

  const focusContext = useContext(FocusContainerContext)

  if (!focusContext) throw Error('Missing FocusContainerContext')

  const { isFocused } = focusContext

  useLayoutEffect(() => {
    if (!parentRef.current || !childRef.current) throw Error('Missing RevealOnFocus component refs')

    const container = { parent: parentRef.current, child: childRef.current }

    if (isFocused) {
      const naturalHeight = getNaturalHeight(container)

      if (isFirstMount.current) {
        setRevealedStyle(container, { naturalHeight })
      } else {
        requestAnimationFrame(() => setRevealedStyle(container, { naturalHeight }))
      }
    } else {
      setHiddenStyle(container)
    }

    return () => {
      if (!isFirstMount.current) return

      addTransitionClasses(container)

      isFirstMount.current = false
    }
  }, [isFocused])

  return (
    <div className="auth__reveal-on-focus-parent" ref={parentRef}>
      <div ref={childRef}>{children}</div>
    </div>
  )
}
