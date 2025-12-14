'use client'

import {
  ReactNode,
  Ref,
  FocusEvent,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  ForwardRefExoticComponent,
  RefAttributes,
  forwardRef,
  AriaAttributes,
} from 'react'

import classNames from 'classnames/bind'
import TextareaAutosize from 'react-textarea-autosize'

import { noop } from '../../../utils/noop'

import styles from '../Input.scss'
import { getTestId } from '../../../utils/testId'
import { deprecationWarning } from '../../../utils/warning'
import { idFromName, computeId } from '../../../utils/html'

const cssClasses = classNames.bind(styles)

/* ---------- String-union sources of truth ---------- */
export const INPUT_TEXTAREA_STYLING_VALUES = ['tight', 'narrow', 'wide'] as const
export type InputTextareaStyling = (typeof INPUT_TEXTAREA_STYLING_VALUES)[number]

export const INPUT_TEXTAREA_THEME_VALUES = ['primary'] as const
export type InputTextareaTheme = (typeof INPUT_TEXTAREA_THEME_VALUES)[number]

/* ---------- Back-compat shim (deprecated) ---------- */
export const INPUT_TEXTAREA_STYLING = {
  Tight: 'tight',
  Narrow: 'narrow',
  Wide: 'wide',
} as const satisfies Record<string, InputTextareaStyling>

export const INPUT_TEXTAREA_THEME = {
  Primary: 'primary',
} as const satisfies Record<string, InputTextareaTheme>

/* ---------- Type definitions ---------- */
export type InputTextareaProps = {
  name: string
  /** Optionally override the generated id (must be unique in the DOM). */
  id?: string
  validation?: ReactNode
  title?: string | JSX.Element
  value?: string | number | null
  defaultValue?: string | number | null
  /** @deprecated Use minLength field instead */
  min?: string | number
  /** @deprecated Use maxLength field instead */
  max?: string | number
  minLength?: number
  maxLength?: number
  /** @deprecated Use suffix field instead */
  deprecatedIcon?: ReactNode
  suffix?: ReactNode
  placeholder?: string
  styling?: InputTextareaStyling
  theme?: InputTextareaTheme
  /**
   * Controls how many rows should be displayed.
   * If the content is longer, text component expands to accomodate it.
   */
  rows?: number
  /**
   * Controls the maximum number of rows that can be displayed.
   * If the text is longer, the content becomes scrollable.
   */
  maxRows?: number
  forwardedRef?: Ref<HTMLTextAreaElement>
  uncontrolled?: boolean
  required?: boolean
  disabled?: boolean
  spellCheck?: boolean
  aria?: AriaAttributes
  /**
   * Adds data-testid attribute to parent and children components.
   * When used, --title and --input suffixes applied accordingly.
   */
  testId?: string
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
  onFocus?: (event: FocusEvent<HTMLTextAreaElement>) => void
  onBlur?: (event: FocusEvent<HTMLTextAreaElement>) => void
  onKeyPress?: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  onInputClick?: (event: MouseEvent<HTMLTextAreaElement>) => void
}

const InputTextareaBase = ({
  name,
  id: idProp,
  validation,
  title,
  required,
  disabled,
  minLength,
  maxLength,
  suffix,
  placeholder,
  spellCheck,
  styling,
  theme,
  maxRows,
  forwardedRef,
  uncontrolled,
  value,
  defaultValue,
  rows = 5,
  testId,
  aria,
  onChange = noop,
  onFocus = noop,
  onBlur = noop,
  onKeyPress = noop,
  onKeyDown = noop,
  onInputClick = noop,
}: InputTextareaProps) => {
  const inputClass = cssClasses(styles.input, styling, theme)

  const inputValue = (uncontrolled ? defaultValue : value) ?? undefined
  const AccessibleWrapper = title ? 'label' : 'div'

  const baseId = idFromName(name)

  const computedId = computeId(idProp, baseId)

  return (
    <AccessibleWrapper htmlFor={computedId} className={inputClass} data-testid={testId}>
      {title ? (
        <div className={styles.title} data-testid={getTestId(testId, 'title')}>
          {title}
        </div>
      ) : null}
      <div className={styles.content}>
        <TextareaAutosize
          className={styles.value}
          name={name}
          id={computedId}
          value={uncontrolled ? undefined : inputValue}
          defaultValue={uncontrolled ? inputValue : undefined}
          required={required}
          disabled={disabled}
          minLength={minLength}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyPress={onKeyPress}
          onKeyDown={onKeyDown}
          onClick={onInputClick}
          ref={forwardedRef}
          minRows={rows}
          maxRows={maxRows}
          spellCheck={spellCheck}
          data-testid={getTestId(testId, 'input')}
          {...aria}
        />
        {suffix ? <div className={styles.suffix}>{suffix}</div> : null}
      </div>

      {validation ? <div className={styles.note}>{validation}</div> : null}
    </AccessibleWrapper>
  )
}

/** The public component type: a React component value that also has deprecated statics */
export type RefComponent = ForwardRefExoticComponent<
  InputTextareaProps & RefAttributes<HTMLTextAreaElement>
> & {
  /** @deprecated Use string unions, e.g. styling="narrow" */
  Styling: typeof INPUT_TEXTAREA_STYLING
  /** @deprecated Use string unions, e.g. theme="primary" */
  Theme: typeof INPUT_TEXTAREA_THEME
}

const InputTextarea = InputTextareaBase

const InputTextareaWithForwardedRefBase = forwardRef<HTMLTextAreaElement, InputTextareaProps>(
  (props, ref) => {
    const forwardedProps = { ...props }

    if (forwardedProps.min) {
      forwardedProps.minLength = forwardedProps.minLength || Number(forwardedProps.min)

      deprecationWarning(
        'Property min on InputTextarea component has been deprecated. Use property minLength instead',
      )
    }

    if (forwardedProps.max) {
      forwardedProps.maxLength = forwardedProps.maxLength || Number(forwardedProps.max)

      deprecationWarning(
        'Property max on InputTextarea component has been deprecated. Use property maxLength instead',
      )
    }

    if (forwardedProps.deprecatedIcon) {
      forwardedProps.suffix = forwardedProps.suffix || forwardedProps.deprecatedIcon

      deprecationWarning(
        'Property icon on InputTextarea component has been deprecated. Use property suffix instead',
      )
    }

    return <InputTextarea forwardedRef={ref} {...forwardedProps} />
  },
)

InputTextareaWithForwardedRefBase.displayName = InputTextarea.name

/** Exported component: arrow fn + statics, deprecations intact, docgen-friendly */
export const InputTextareaWithForwardedRef: RefComponent = Object.assign(
  InputTextareaWithForwardedRefBase,
  {
    /** @deprecated Use string unions, e.g. styling="narrow" */
    Styling: INPUT_TEXTAREA_STYLING,
    /** @deprecated Use string unions, e.g. theme="primary" */
    Theme: INPUT_TEXTAREA_THEME,
  },
)

export default InputTextareaWithForwardedRef
