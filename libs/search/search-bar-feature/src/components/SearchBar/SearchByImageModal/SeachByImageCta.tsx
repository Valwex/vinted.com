'use client'

import { ReactNode, useEffect, useState } from 'react'
import { Tooltip } from '@vinted/web-ui'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@marketplace-web/browser/browser-storage-util'

const createLocalStorageCounter = (key: string) => {
  return {
    increment() {
      const current = this.get()
      setLocalStorageItem(key, String(current + 1))
    },
    get() {
      return Number(getLocalStorageItem(key) || '0') || 0
    },
  }
}

const interactionCount = createLocalStorageCounter('search_by_image_interacted_count')

const TOOLTIP_DURATION_MS = 6e3

type Props = {
  children: ReactNode
}

const SearchByImageCta = ({ children }: Props) => {
  const translate = useTranslate('searchbar.search_by_image.modal')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(interactionCount.get() === 0)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsOpen(false)
      interactionCount.increment()
    }, TOOLTIP_DURATION_MS)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  const handleClick = () => {
    interactionCount.increment()
    setIsOpen(false)
  }

  const renderOpen = () => (
    <Tooltip
      content={translate('tooltip')}
      show={isOpen}
      hover={false}
      shouldAutoUpdate
      placement="bottom-end"
    >
      <div role="none" onClick={handleClick}>
        {children}
      </div>
    </Tooltip>
  )

  const renderClose = () => (
    <div role="none" onClick={handleClick}>
      {children}
    </div>
  )

  return isOpen ? renderOpen() : renderClose()
}

export default SearchByImageCta
