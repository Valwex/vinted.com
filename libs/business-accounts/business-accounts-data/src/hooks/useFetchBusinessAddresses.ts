'use client'

import { useCallback, useEffect, useState } from 'react'

import { useFetch } from '@marketplace-web/core-api/api-client-util'

import { getBusinessAccountAddresses } from '../api/business-address'
import { transformBusinessAccountAddressesResponse } from '../transformers/business-address'
import { businessAccountFromUserDto } from '../utils/business-account'
import { getCurrentUser } from '../api/current-user'

type Props = {
  businessAccount: unknown
}

const useFetchBusinessAddresses = ({ businessAccount }: Props) => {
  const businessAccountId = businessAccountFromUserDto({ business_account: businessAccount })?.id

  const [businessAccountIdState, setBusinessAccountIdState] = useState<number>()
  const [isUserFetchLoading, setIsUserFetchLoading] = useState(false)
  const [userError, setUserError] = useState<Error>()

  const fetchCurrentUser = useCallback(async () => {
    const response = await getCurrentUser()

    if ('errors' in response) {
      setUserError(new Error(response.errors[0]!.value))
      setIsUserFetchLoading(false)

      return
    }

    setBusinessAccountIdState(businessAccountFromUserDto(response?.user)?.id)
  }, [setUserError, setBusinessAccountIdState])

  const {
    fetch: fetchBusinessAddresses,
    data: businessAddressesInitialResponse,
    transformedData: businessAddressesResponse,
    isLoading: isAddressFetchLoading,
    error: addressError,
  } = useFetch(getBusinessAccountAddresses, transformBusinessAccountAddressesResponse)

  useEffect(() => {
    if (!businessAccountId) {
      setIsUserFetchLoading(true)
      fetchCurrentUser()
      if (businessAccountIdState) {
        setIsUserFetchLoading(false)
        fetchBusinessAddresses({ businessAccountId: businessAccountIdState })
      }

      return
    }
    fetchBusinessAddresses({ businessAccountId })
  }, [fetchBusinessAddresses, businessAccountId, businessAccountIdState, fetchCurrentUser])

  return {
    businessAddressesResponse,
    businessAddressesInitialResponse,
    businessAccountId: businessAccountId || businessAccountIdState,
    isLoading: isAddressFetchLoading || isUserFetchLoading,
    error: addressError || userError,
  }
}

export default useFetchBusinessAddresses
