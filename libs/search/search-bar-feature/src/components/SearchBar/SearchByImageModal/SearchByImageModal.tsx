'use client'

import { X16, AiCamera16 } from '@vinted/monochrome-icons'
import { AiImage96 } from '@vinted/multichrome-icons'
import { Button, Cell, Dialog, EmptyState, Icon, Loader, Text } from '@vinted/web-ui'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useEventListener } from 'usehooks-ts'

import { useBrowserNavigation } from '@marketplace-web/browser/browser-navigation-util'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { Dropzone } from '@marketplace-web/common-components/dropzone-ui'
import { urlWithParams } from '@marketplace-web/browser/url-util'
import { useBreakpoint } from '@marketplace-web/breakpoints/breakpoints-feature'
import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { clickEvent } from '@marketplace-web/search/search-bar-data'

import SearchByImageCta from './SeachByImageCta'
import { uploadImage } from '../../../utils/search-by-image'

const SearchByImageModal = () => {
  const translate = useTranslate('searchbar.search_by_image.modal')
  const translateA11y = useTranslate('common.a11y')
  const { track } = useTracking()

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const breakpoint = useBreakpoint()

  const { urlParams } = useBrowserNavigation()
  const searchByImageUuid = urlParams.search_by_image_uuid
  const searchByImageUuidPrevRef = useRef('')

  useEffect(() => {
    if (!searchByImageUuidPrevRef.current) {
      searchByImageUuidPrevRef.current = searchByImageUuid ? String(searchByImageUuid) : ''

      return undefined
    }

    if (!searchByImageUuid) {
      track(clickEvent({ target: 'cancel', screen: 'catalog' }))
      searchByImageUuidPrevRef.current = ''
    }

    return undefined
  }, [searchByImageUuid, track])

  const handleOpen = () => {
    track(clickEvent({ target: 'search_by_image' }))
    setIsOpen(true)
  }

  const handleClose = () => {
    track(clickEvent({ target: 'cancel', screen: 'search_by_image_camera' }))
    setIsOpen(false)
  }

  const upload = async (files: Array<File>) => {
    const file = files[0]
    if (!file) return

    setIsLoading(true)
    const uuid = await uploadImage(file)
    if (!uuid) {
      setIsLoading(false)

      return
    }

    window.location.href = urlWithParams('/catalog', {
      search_by_image_uuid: uuid,
    })
  }

  const handleDrop = (files: Array<File>) => {
    // TakePhoto target is used for drag n drop, not a typo
    track(clickEvent({ target: 'take_photo', screen: 'search_by_image_camera' }))

    return upload(files)
  }

  const handleChangeInput = (ev: ChangeEvent<HTMLInputElement>) => {
    if (!ev.target.files) return
    upload(Array.from(ev.target.files))
  }

  const handleClickUpload = () => {
    track(clickEvent({ target: 'open_photo_gallery', screen: 'search_by_image_camera' }))
    inputRef.current?.click()
  }

  useEventListener('paste', async event => {
    if (!isOpen) return

    const items = event.clipboardData?.items
    if (!items) return

    const itemArray = Array.from(items)

    // eslint-disable-next-line no-restricted-syntax
    for (const item of itemArray) {
      const file = item.getAsFile()
      if (file && file.type.startsWith('image')) {
        // eslint-disable-next-line no-await-in-loop
        await upload([file])

        return
      }
    }
  })

  const renderEmptyStateDefault = () => {
    return (
      <div className="search-by-image-empty-state">
        <EmptyState
          image={<AiImage96 />}
          body={
            <div className="u-gap-medium u-flexbox u-flex-direction-column u-align-items-center u-justify-content-center">
              <Button
                isLoading={isLoading}
                text={translate('upload')}
                inline
                onClick={handleClickUpload}
                styling="filled"
              />

              <Text type="body" as="p" text={translate('body')} />

              <input
                className="u-hidden"
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleChangeInput}
              />
            </div>
          }
        />
      </div>
    )
  }

  const renderEmptyStateLoading = () => {
    return (
      <div className="u-position-relative">
        <div className="u-visibility-hidden">{renderEmptyStateDefault()}</div>
        <div className="u-position-absolute u-fill-height u-fill-width u-top search-by-image-modal-loading-bg">
          <EmptyState
            animation={<Loader size="x-large" />}
            body={<Text type="body" as="p" text={translate('dropzone_uploading')} />}
          />
        </div>
      </div>
    )
  }

  const renderEmptyState = () => {
    if (isLoading) {
      return renderEmptyStateLoading()
    }

    return renderEmptyStateDefault()
  }

  const renderIconButton = () => (
    <Button
      title={translate('title')}
      testId="search-by-image-button"
      onClick={handleOpen}
      size="small"
      styling="flat"
      icon={<Icon name={AiCamera16} />}
    />
  )

  if (!breakpoint.desktops) return null

  return (
    <>
      <div className="u-flexbox u-justify-content-center u-align-items-center u-fill-height">
        <SearchByImageCta>{renderIconButton()}</SearchByImageCta>
      </div>
      <Dialog
        show={isOpen}
        closeOnOverlay
        defaultCallback={handleClose}
        contentDimensions={{
          width: '680px',
        }}
      >
        <Cell
          body={
            <div className="u-fill-width u-flexbox u-justify-content-center u-align-items-center u-margin-left-large">
              <Text as="h3" text={translate('title')} type="section-heading" />
            </div>
          }
          suffix={
            <Button
              onClick={handleClose}
              title={translateA11y('actions.dialog_close')}
              styling="flat"
              size="small"
              iconName={X16}
              inline
              theme="amplified"
            />
          }
        />

        <div className="u-padding-bottom-large u-padding-left-large u-padding-right-large">
          <Dropzone
            overlayDescription={translate('dropzone_hovering')}
            onDrop={handleDrop}
            background="primary"
          >
            {renderEmptyState()}
          </Dropzone>
        </div>
      </Dialog>
    </>
  )
}

export default SearchByImageModal
