import { debounce } from 'lodash'

import { isEmailValid } from '@marketplace-web/registration/email-validation-feature'

import { validateUser, ValidateUserArgs } from '@marketplace-web/registration/registration-data'

import { isLoginValid } from '../../utils/login'
import { isFullNameValid } from '../../utils/fullName'

const DEBOUNCE_DELAY = 500

function asyncDebounce<Args extends Array<unknown>, ReturnType>(
  func: (...args: Args) => Promise<ReturnType>,
  wait: number,
) {
  const debounced = debounce(
    (resolve: (value: ReturnType) => void, args: Args) => {
      func(...args).then(resolve)
    },
    wait,
    { leading: true },
  )

  return (...args: Args) =>
    new Promise<ReturnType>(resolve => {
      debounced(resolve, args)
    })
}

const validateAsync = async (field: keyof ValidateUserArgs['user'], value: string | undefined) => {
  const response = await validateUser({ user: { [field]: value } })

  if ('errors' in response) {
    return response.errors.find(error => error.field === field)?.value ?? true
  }

  return true
}

export const validateLoginAsync = asyncDebounce(
  (value: string | undefined) => validateAsync('login', value),
  DEBOUNCE_DELAY,
)

export const validateRealNameAsync = asyncDebounce(
  (value: string | undefined) => validateAsync('real_name', value),
  DEBOUNCE_DELAY,
)

export const validatePasswordAsync = asyncDebounce(
  (value: string | undefined) => validateAsync('password', value),
  DEBOUNCE_DELAY,
)

export const validateZipCodeAsync = asyncDebounce(
  (value: string) => validateAsync('zip_code', value),
  DEBOUNCE_DELAY,
)

export const validateRealName = (value: string) =>
  isFullNameValid(value) && validateRealNameAsync(value)

export const validateEmail = (value: string) => isEmailValid(value)

export const validateLogin = (value: string) => isLoginValid(value) && validateLoginAsync(value)
