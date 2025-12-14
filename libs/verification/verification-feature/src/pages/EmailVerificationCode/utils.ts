import { validateUser, ValidateUserArgs } from '@marketplace-web/verification/verification-data'

const validate = async <K extends keyof ValidateUserArgs['user']>(
  field: K,
  value: ValidateUserArgs['user'][K],
) => {
  const response = await validateUser({ user: { [field]: value } })

  if ('errors' in response) {
    return response.errors.find(error => error.field === field)?.value ?? true
  }

  return true
}

export const validateEmail = (value: string) => validate('email', value)

export const numbersOnly = (input?: string) => {
  if (!input) return ''

  return input.replace(/\D+/g, '')
}
