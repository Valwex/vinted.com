'use client'

import { X24 } from '@vinted/monochrome-icons'
import {
  Button,
  Cell,
  Dialog,
  InputText,
  Navigation,
  Spacer,
  Text,
  Validation,
} from '@vinted/web-ui'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { useTracking } from '@marketplace-web/observability/event-tracker-data'
import { useTranslate } from '@marketplace-web/i18n/i18n-feature'
import { useFormValidationMessage } from '@marketplace-web/vendor-abstractions/react-hook-form-feature'

import { addUserAddressesMissingInfo } from '@marketplace-web/address/address-data'
import { useAbTest, useTrackAbTestCallback } from '@marketplace-web/feature-flags/ab-tests-data'
import {
  zipCodeScreenSuccessEvent,
  zipCodeScreenViewEvent,
} from '@marketplace-web/shipping/zip-code-data'

import { isValueInObject } from '../../utils/object'

enum Field {
  PostalCode = 'postal_code',
}

const MAX_LENGTH = 5
const TRANSLATE_PREFIX = 'item_upload.missing_zip_code.dialog'

type FormModel = {
  [Field.PostalCode]: number
}

type Props = {
  isOpen: boolean
  isItemUpload: boolean
  onClose: () => void
  onContinue: () => void
}

const MissingZipCodeDialog = ({ isOpen, isItemUpload, onClose, onContinue }: Props) => {
  const {
    register,
    setError,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormModel>({
    mode: 'onBlur',
  })

  const validationMessage = useFormValidationMessage(errors, `${TRANSLATE_PREFIX}.fields`)
  const translate = useTranslate(TRANSLATE_PREFIX)
  const { track } = useTracking()

  const usZipCollectionUploadItemUpdateUiAbTest = useAbTest(
    'us_zip_collection_upload_item_update_ui',
  )

  const trackAbTest = useTrackAbTestCallback()

  useEffect(() => {
    if (!isOpen || !isItemUpload) return

    trackAbTest(usZipCollectionUploadItemUpdateUiAbTest)
  }, [isItemUpload, isOpen, trackAbTest, usZipCollectionUploadItemUpdateUiAbTest])

  useEffect(() => {
    if (!isOpen) return

    track(
      zipCodeScreenViewEvent({
        screen: isItemUpload ? 'fill_zip_code_after_listing' : 'home_feed_zip_banner',
      }),
    )
  }, [isItemUpload, isOpen, track])

  const handleSubmitClick = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (!isSubmitting) return

    event.preventDefault()
  }

  const handleFormClose = () => {
    reset()
    onClose()
  }

  const handleFormSubmit = async (data: FormModel) => {
    const response = await addUserAddressesMissingInfo(data)

    if ('errors' in response) {
      response.errors.forEach(({ field, value }) => {
        if (isValueInObject(field, Field)) {
          setError(field, { type: 'manual', message: value })
        }
      })

      return
    }

    track(
      zipCodeScreenSuccessEvent({
        screen: isItemUpload ? 'fill_zip_code_after_listing' : 'home_feed_zip_banner',
      }),
    )

    onContinue()
    onClose()
  }

  const renderNavigation = () => {
    return (
      <Navigation
        theme="transparent"
        right={
          <Button
            styling="flat"
            inline
            disabled={isSubmitting}
            isLoading={isSubmitting}
            onClick={handleFormClose}
            iconName={X24}
            testId="missing-postal-code-close-icon"
          />
        }
      />
    )
  }

  const renderDescription = () => {
    return (
      <>
        <Text type="heading" text={translate('title')} as="h2" />
        <Spacer size="large" />
        <Text as="span" type="body" text={translate('body')} />
      </>
    )
  }

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Spacer size="large" />
        <InputText
          {...register(Field.PostalCode, {
            required: true,
          })}
          maxLength={MAX_LENGTH}
          title={translate('fields.postal_code.title')}
          placeholder={translate('fields.postal_code.placeholder')}
          styling="tight"
          validation={<Validation text={validationMessage(Field.PostalCode)} theme="warning" />}
        />
        <Spacer size="x2-large" />
        <Button
          type="submit"
          styling="filled"
          text={translate('actions.submit')}
          disabled={isSubmitting}
          isLoading={isSubmitting}
          onClick={handleSubmitClick}
        />
      </form>
    )
  }

  return (
    <Dialog show={isOpen} defaultCallback={handleFormClose} closeOnOverlay hasScrollableContent>
      <div className="u-position-relative u-overflow-auto">
        {renderNavigation()}
        <Cell>
          {renderDescription()}
          {renderForm()}
        </Cell>
      </div>
    </Dialog>
  )
}

export default MissingZipCodeDialog
