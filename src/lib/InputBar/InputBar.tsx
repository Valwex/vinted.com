'use client'

import {
  ComponentProps,
  ReactNode,
  ChangeEvent,
  FormEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  AriaAttributes,
  forwardRef,
  ReactElement,
  useState,
  useEffect,
  useCallback,
  ForwardedRef,
} from 'react'

import classNames from 'classnames/bind'

import OriginalTextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize'

import { X16 } from '@vinted/monochrome-icons'

import Icon from '../Icon'
import type { IconProps } from '../Icon/Icon'
import Button from '../Button'

import { formatString } from '../../utils/formatString'
import { getTestId } from '../../utils/testId'
import { deprecationWarning } from '../../utils/warning'

import styles from './InputBar.scss'
import { noop } from '../../utils/noop'
import { idFromName, computeId } from '../../utils/html'

// Explicitly cast to a JSX-compatible function component
const TextareaAutosize = OriginalTextareaAutosize as unknown as (
  props: TextareaAutosizeProps,
) => JSX.Element

export type InputBarProps = {
  name: string
  /** Optionally override the generated id (must be unique in the DOM). */
  id?: string
  value?: string | number | null
  /** @deprecated Use minLength field instead */
  min?: number | string
  /** @deprecated Use maxLength field instead */
  max?: number | string
  minLength?: number
  maxLength?: number
  placeholder: string
  suffix?: ReactNode
  prefix?: ReactNode
  icon?: ReactElement<IconProps>
  iconName?: ComponentProps<typeof Icon>['name'] | null
  /**
   * Formats the input value according to the specified type.
   * Supports two types: `ccNumber` and `ccExpiry`.
   */
  format?: string
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
  onKeyDown?: (event: KeyboardEvent) => void
  onKeyUp?: (event: KeyboardEvent) => void
  onValueClear?: (event: MouseEvent) => void
  onInputClick?: (event: MouseEvent<HTMLInputElement>) => void
  onChange?: (event: ChangeEvent<HTMLInputElement> | FormEvent<HTMLTextAreaElement>) => void
  forwardedRef?: ForwardedRef<HTMLInputElement>
  uncontrolled?: boolean
  disabled?: boolean
  isLoading?: boolean
  isMultiline?: boolean

  /**
   * Accepts an object of valid ARIA attributes and sets them on an input.
   */
  inputAria?: AriaAttributes
  clearButtonAria?: AriaAttributes
  /**
   * Adds data-testid attribute to parent and children components.
   * When used, --input, --icon and --clear-button suffixes applied accordingly.
   */
  testId?: string
  /**
   * Controls how many rows should be displayed.
   * If the content is longer, text component expands to accomodate it.
   * `isMultiline` must be set to `true` for this property to take effect.
   */
  rows?: number
  /**
   * Controls the maximum number of rows that can be displayed.
   * If the text is longer, the content becomes scrollable.
   * `isMultiline` must be set to `true` for this property to take effect.
   */
  maxRows?: number
}

const cssClasses = classNames.bind(styles)

const InputBar = ({
  name,
  id: idProp,
  value,
  placeholder,
  minLength,
  maxLength,
  suffix,
  prefix,
  icon,
  iconName,
  format,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
  onValueClear,
  onInputClick,
  onChange = noop,
  forwardedRef,
  uncontrolled,
  disabled,
  isLoading,
  isMultiline,
  inputAria,
  clearButtonAria,
  testId,
  rows = 1,
  maxRows = 5,
}: InputBarProps) => {
  const formatValue = useCallback(
    (newValue: string | number | null | undefined) => {
      if (!newValue) return ''

      return format ? formatString(format, newValue.toString()) : newValue
    },
    [format],
  )

  const [inputValue, setInputValue] = useState<string | number>(formatValue(value) || '')

  useEffect(() => {
    setInputValue(formatValue(value))
  }, [value, formatValue])

  const baseId = idFromName(name)

  const handleChange = (event: ChangeEvent<HTMLInputElement> | FormEvent<HTMLTextAreaElement>) => {
    if (!uncontrolled) {
      const newValue = formatValue(event.currentTarget.value)
      setInputValue(newValue || '')
    }

    onChange(event)
  }

  const clearInputValue = (event: MouseEvent) => {
    if (isLoading) return
    if (onValueClear) onValueClear(event)

    setInputValue('')
  }

  const renderSuffix = () => {
    if (suffix) return suffix
    if (!inputValue) return null

    return (
      <Button
        iconName={X16}
        styling="flat"
        size="medium"
        onClick={clearInputValue}
        testId={getTestId(testId, 'clear-button')}
        isLoading={isLoading}
        {...clearButtonAria}
      />
    )
  }

  const renderInputIcon = () => {
    if (!icon && !iconName) return null

    return (
      <div className={styles.icon}>
        {icon || (iconName && <Icon name={iconName} testId={getTestId(testId, 'icon')} />)}
      </div>
    )
  }

  const renderInputValue = () => {
    const computedId = computeId(idProp, baseId)

    const inputProps = {
      id: computedId,
      name,
      value: uncontrolled ? undefined : inputValue,
      placeholder,
      'data-testid': getTestId(testId, 'input'),
      className: cssClasses(styles.value),
      onChange: handleChange,
      onBlur,
      onFocus,
      onClick: onInputClick,
      onKeyUp,
      onKeyDown,
      ref: forwardedRef,
      autoComplete: 'off',
      disabled,
      maxLength,
      minLength,
      ...inputAria,
    }

    if (isMultiline) {
      return (
        <TextareaAutosize
          {...(inputProps as TextareaAutosizeProps)}
          minRows={rows}
          maxRows={maxRows}
        />
      )
    }

    return <input {...inputProps} />
  }

  return (
    <div className={cssClasses('input-bar')} data-testid={testId}>
      {prefix ? <div className={cssClasses(styles.prefix)}>{prefix}</div> : null}

      <div className={cssClasses(styles.input)}>
        {renderInputIcon()}
        {renderInputValue()}
      </div>

      <div className={cssClasses(styles.suffix)}>{renderSuffix()}</div>
    </div>
  )
}

// BUG: default exports do not auto-generate storybook ArgsTable
// https://github.com/storybookjs/storybook/issues/9511
// remove export when resolved
export const InputBarWithForwardedRef = forwardRef<HTMLInputElement, InputBarProps>(
  (props, ref) => {
    const forwardedProps = { ...props }

    if (forwardedProps.min) {
      forwardedProps.minLength = forwardedProps.minLength || Number(forwardedProps.min)

      deprecationWarning(
        'Propert min of InputBar component has been deprecated. Use propery minLength instead',
      )
    }

    if (forwardedProps.max) {
      forwardedProps.maxLength = forwardedProps.maxLength || Number(forwardedProps.max)

      deprecationWarning(
        'Property max of InputBar component has been deprecated. Use property maxLength instead',
      )
    }

    return <InputBar forwardedRef={ref} {...forwardedProps} />
  },
)

InputBarWithForwardedRef.displayName = InputBar.name

export default InputBarWithForwardedRef
