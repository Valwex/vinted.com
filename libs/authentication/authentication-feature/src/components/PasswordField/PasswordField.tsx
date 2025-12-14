'use client'

import { forwardRef, MouseEvent, Ref, useState } from 'react'
import { InputText, Icon } from '@vinted/web-ui'
import { Eye16, EyeDenied16 } from '@vinted/monochrome-icons'

import { useTranslate } from '@marketplace-web/i18n/i18n-feature'

type Props = Omit<React.ComponentProps<typeof InputText>, 'icon' | 'type'>

const PasswordField = forwardRef((props: Props, ref?: Ref<HTMLInputElement>) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const translateA11y = useTranslate('auth.a11y')

  function togglePasswordVisibility(event: MouseEvent) {
    event.preventDefault()
    setIsPasswordVisible(prevState => !prevState)
  }

  return (
    <InputText
      // InputText union type for some reason asumes that value is not undefined - causes issues with TS
      {...(props as React.ComponentProps<typeof InputText>)}
      ref={ref}
      type={isPasswordVisible ? 'text' : 'password'}
      suffix={
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="u-cursor-pointer"
          data-testid="auth-password-eye-icon"
          aria-label={
            isPasswordVisible ? translateA11y('hide_password') : translateA11y('show_password')
          }
        >
          <Icon name={isPasswordVisible ? Eye16 : EyeDenied16} color="greyscale-level-2" />
        </button>
      }
    />
  )
})

export default PasswordField
