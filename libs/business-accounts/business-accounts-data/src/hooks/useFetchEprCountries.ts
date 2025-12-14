'use client'

import { useEffect } from 'react'

import { useFetch } from '@marketplace-web/core-api/api-client-util'

import { getEprCountries } from '../api/epr'
import { transformCountriesDto } from '../transformers/epr'

const useFetchEprCountries = () => {
  const {
    fetch: fetchEprCountries,
    isLoading,
    transformedData: countries,
    error,
  } = useFetch(getEprCountries, transformCountriesDto)

  useEffect(() => {
    fetchEprCountries()
  }, [fetchEprCountries])

  return {
    countries,
    isLoading,
    error,
  }
}

export default useFetchEprCountries
