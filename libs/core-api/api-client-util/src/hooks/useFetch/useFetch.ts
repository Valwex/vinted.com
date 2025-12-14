'use client'

import { useRef, useState } from 'react'
import { useIsMounted } from 'usehooks-ts'

import { ResponseError } from '../../types'
import { isResponseError } from '../../utils/api'

type ResolvedResponse<Response, TransformedData> = {
  error: ResponseError | undefined
  data: Response | undefined
  transformedData: TransformedData | undefined
}

type Options = {
  clearDataOnFetch?: boolean
}

const useFetch = <Response, TransformedData, Args extends Array<any>>(
  apiHandler: (...args: Args) => Promise<Response | ResponseError>,
  transformer?: (response: Response) => TransformedData,
  options?: Options,
) => {
  const isMounted = useIsMounted()
  const [data, setData] = useState<Response>()
  const [transformedData, setTransformedData] = useState<TransformedData>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ResponseError>()

  const fetch = async (...args: Args): Promise<ResolvedResponse<Response, TransformedData>> => {
    if (options?.clearDataOnFetch) {
      setTransformedData(undefined)
      setData(undefined)
    }
    setError(undefined)
    setIsLoading(true)

    const response = await apiHandler(...args)

    if (!isMounted()) return { error: undefined, data: undefined, transformedData: undefined }

    if (isResponseError(response)) {
      setError(response)
      setIsLoading(false)

      return { error: response, data: undefined, transformedData: undefined }
    }

    let transformedResponse: TransformedData | undefined

    if (transformer) {
      transformedResponse = transformer(response)
      setTransformedData(transformedResponse)
    }
    setData(response)
    setIsLoading(false)

    return { error: undefined, data: response, transformedData: transformedResponse }
  }

  const fetchRef = useRef(fetch)

  return { data, transformedData, isLoading, error, fetch: fetchRef.current }
}

export default useFetch
