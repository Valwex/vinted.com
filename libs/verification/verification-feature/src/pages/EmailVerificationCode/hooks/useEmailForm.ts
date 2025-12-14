import { useContext } from 'react'
import { useForm } from 'react-hook-form'

import { Submit } from '../NotReceiveEmail/types'
import { validateEmail } from '../utils'
import Context from '../EmailVerificationCodeContext'

type FormData = {
  email: string
}

const useEmailForm = () => {
  const { email: userEmail, sendEmailCode } = useContext(Context)
  const {
    register,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      email: userEmail || '',
    },
  })

  const handleSubmit = ({ useOldEmail }: Submit = {}) => {
    let { email } = getValues()

    if (useOldEmail && userEmail) {
      email = userEmail
    }

    sendEmailCode(email)
  }

  return {
    register: register('email', {
      required: true,
      validate: validateEmail,
    }),
    getValues,
    handleSubmit,
    errors,
  }
}

export default useEmailForm
