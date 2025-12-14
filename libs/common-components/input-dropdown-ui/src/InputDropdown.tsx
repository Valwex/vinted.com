'use client'

import { Search24, X24 } from '@vinted/monochrome-icons'
import { Button, Cell, Dialog, Divider, InputBar, Navigation, Spacer } from '@vinted/web-ui'
import classNames from 'classnames'
import { includes, noop } from 'lodash'
import {
  AriaAttributes,
  ChangeEvent,
  FocusEvent,
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  idFromName,
  KeyboardKey,
  onA11yKeyDown,
} from '@marketplace-web/vendor-abstractions/web-ui-util'

import Dropdown from './Dropdown'
import DropdownState from './DropdownState'
import Loader from './Loader'
import { formatValue, testIdAttribute } from './utils'
import WrappedContent from './WrappedContent'
import useRunAfterRerender from './hooks/useRunAfterRerender'
import DisabledWrapper from './DisabledWrapper'

export type InputDropdownRenderProps = {
  inputValue: string | null
  isOpen: boolean
  isSaveEnabled: boolean
  setIsSaveEnabled: (isSaveEnabled: boolean) => void
  closeDropdown: () => void
}

type Props = {
  name: string
  testId?: string
  validation?: ReactNode
  title?: JSX.Element | string
  value?: string | null
  isDirectionUp?: boolean
  disabled?: boolean
  required?: boolean
  readOnly?: boolean
  placeholder?: string
  styling?: 'narrow' | 'wide' | 'tight'
  isScrollable?: boolean
  isLoading?: boolean
  isSaveButtonShown?: boolean
  isBackgroundTransparent?: boolean
  closeOnGlobalClick?: boolean
  closeOnDropdownBlur?: boolean
  maxLength?: number
  aria?: AriaAttributes
  render: (props: InputDropdownRenderProps) => ReactNode
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onCancel?: () => void
  onSave?: (inputValue: string | null) => void
  onOpen?: () => void
  onClose?: () => void
  onClear?: () => void
  isPhone: boolean
  textSave: string
  inputPrefix?: JSX.Element
}

const InputDropdown = ({
  name,
  testId,
  validation,
  title,
  value,
  isDirectionUp,
  disabled = false,
  required,
  readOnly = false,
  placeholder,
  styling = 'wide',
  isScrollable = true,
  isLoading = false,
  isSaveButtonShown = true,
  isBackgroundTransparent,
  closeOnGlobalClick = true,
  closeOnDropdownBlur,
  maxLength,
  aria,
  render,
  onChange = noop,
  onCancel = noop,
  onSave = noop,
  onOpen = noop,
  onClose = noop,
  onClear = noop,
  isPhone,
  textSave,
  inputPrefix,
}: Props) => {
  const [inputValue, setInputValue] = useState(formatValue(value))
  const [isOpen, setIsOpen] = useState(false)
  const [isSaveEnabled, setIsSaveEnabled] = useState(false)

  const runAfterRerender = useRunAfterRerender()
  const hasEvents = isOpen && !isPhone && !isLoading

  const nodeRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const valueRef = useRef(value)
  valueRef.current = value
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const handleCancel = () => {
    setIsOpen(false)
    setInputValue(formatValue(value))
    onCancel()
  }

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setInputValue(formatValue(valueRef.current))
    runAfterRerender(onCloseRef.current)
  }, [runAfterRerender])

  const handleGlobalClick = useCallback(
    (event: MouseEvent) => {
      if (!hasEvents) return
      if (!closeOnGlobalClick) return
      if (nodeRef.current?.contains(event.target as HTMLElement)) return

      handleClose()
    },
    [closeOnGlobalClick, handleClose, hasEvents],
  )

  const handleEscKey = useCallback(
    (event: KeyboardEvent) => {
      if (!hasEvents) return
      if (event.code !== KeyboardKey.Escape) return

      handleClose()
      inputRef.current?.focus()
    },
    [handleClose, hasEvents],
  )

  useEffect(() => {
    setInputValue(formatValue(value))
  }, [value])

  useEffect(() => {
    if (isOpen) return

    setIsSaveEnabled(false)
  }, [isOpen])

  useEffect(() => {
    if (!hasEvents) return undefined

    document.addEventListener('mousedown', handleGlobalClick)
    document.addEventListener('keydown', handleEscKey)

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick)
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [handleEscKey, handleGlobalClick, hasEvents])

  const handleSave = () => {
    setIsOpen(false)
    onSave(inputValue)
  }

  const showDropdown = () => {
    if (isOpen || isLoading) return

    setIsOpen(true)
    setInputValue(prevValue => (isPhone ? '' : prevValue))
    runAfterRerender(onOpen)
  }

  const toggleDropdown = () => (isOpen ? handleClose() : showDropdown())

  const handleKeyDown = (event: ReactKeyboardEvent) => {
    const isEditableInput = !readOnly
    if (isEditableInput && event.code === KeyboardKey.Spacebar) return

    if (includes([KeyboardKey.Enter, KeyboardKey.Spacebar, KeyboardKey.Space], event.code)) {
      event.preventDefault()
    }

    onA11yKeyDown(
      event,
      { keys: [KeyboardKey.Enter, KeyboardKey.Spacebar, KeyboardKey.Space] },
      toggleDropdown,
    )
  }

  const handleModalInputClear = () => {
    setInputValue('')

    onClear()
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!(isOpen || isPhone)) showDropdown()

    setInputValue(formatValue(event.target.value))

    onChange(event)
  }

  const handleModalInputChange = (
    event: ChangeEvent<HTMLInputElement> | FormEvent<HTMLTextAreaElement>,
  ) => {
    handleInputChange(event as ChangeEvent<HTMLInputElement>)
  }

  const handleDropdownBlur = (event: FocusEvent) => {
    if (!closeOnDropdownBlur) return
    if (event.currentTarget.contains(event.relatedTarget)) return
    if (event.relatedTarget === event.currentTarget) return

    handleClose()
  }

  const renderContent = () =>
    render({
      inputValue,
      isOpen,
      isSaveEnabled,
      setIsSaveEnabled,
      closeDropdown: () => {
        handleClose()
      },
    })

  const renderModalInput = () => {
    if (readOnly) return null

    return (
      <>
        <Cell>
          <InputBar
            name={`${name}-input-modal`}
            placeholder={placeholder || ''}
            iconName={Search24}
            disabled={disabled}
            value={inputValue === null ? '' : inputValue}
            onChange={handleModalInputChange}
            onValueClear={handleModalInputClear}
            testId={`${name}-input-modal`}
          />
        </Cell>
        <Divider />
        <Spacer size="x-small" />
      </>
    )
  }

  const renderModal = () => (
    <Dialog show={isOpen}>
      <Navigation
        body={title}
        right={
          <Button
            styling="flat"
            onClick={handleCancel}
            iconName={X24}
            testId={testIdAttribute(testId, 'close-button')}
          />
        }
      />
      {renderModalInput()}
      <WrappedContent isScrollable={isScrollable}>{renderContent()}</WrappedContent>
      {isSaveButtonShown && (
        <>
          <Divider />
          <Cell>
            <Button
              text={<span>{textSave}</span>}
              onClick={handleSave}
              styling="filled"
              disabled={!isSaveEnabled}
              size="medium"
              testId="input-dropdown-save-button"
            />
          </Cell>
        </>
      )}
    </Dialog>
  )

  const renderPropsHandler = () => {
    if (isPhone) return renderModal()
    if (!isOpen) return null

    return (
      <Dropdown testId={testId} isDirectionUp={isDirectionUp} onBlur={handleDropdownBlur}>
        <WrappedContent isScrollable={isScrollable}>{renderContent()}</WrappedContent>
      </Dropdown>
    )
  }

  const renderFooter = () => {
    if (isLoading) return <Loader testId={`${testId}--loader`} />
    if (disabled) return null

    return <DropdownState isOpen={isOpen} testId={testId} toggleDropdown={toggleDropdown} />
  }

  const inputDropdownClass = classNames(
    'c-input',
    { [`c-input--${String(styling)}`]: styling !== undefined },
    { 'c-input--transparent': isBackgroundTransparent },
  )

  const inputClass = classNames('c-input__value', 'c-input__value--with-suffix', {
    'u-cursor-pointer': readOnly,
  })

  const renderInput = () => (
    <input
      ref={inputRef}
      data-testid={testIdAttribute(testId, 'input')}
      autoComplete="off"
      className={inputClass}
      name={name}
      id={idFromName(name)}
      value={inputValue === null ? '' : inputValue}
      readOnly={readOnly || isPhone}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      onChange={handleInputChange}
      onClick={showDropdown}
      onKeyDown={handleKeyDown}
      maxLength={maxLength}
      {...aria}
    />
  )

  return (
    <div className={inputDropdownClass}>
      {title && (
        <label htmlFor={name} className="c-input__title">
          {title}
          {!!inputPrefix && isPhone && inputPrefix}
        </label>
      )}
      <div className="c-input__content" ref={nodeRef}>
        {!!inputPrefix && !isPhone && <div className="c-input__prefix">{inputPrefix}</div>}
        <DisabledWrapper isDisabled={disabled}>{renderInput()}</DisabledWrapper>
        {renderPropsHandler()}
        {renderFooter()}
      </div>

      {validation && <div className="c-input__note">{validation}</div>}
    </div>
  )
}

export default InputDropdown
