'use client'

import { useContext, useEffect } from 'react'

import BrazeContext from './BrazeContext'

type Props = {
  userExternalId: string | null | undefined
}

export const BrazeExternalIdSetter = ({ userExternalId }: Props) => {
  const { dispatch } = useContext(BrazeContext)

  useEffect(() => {
    if (userExternalId === undefined) dispatch({ type: 'set_failure' })

    if (userExternalId) dispatch({ type: 'set_success', value: userExternalId })
  }, [userExternalId, dispatch])

  return null
}
