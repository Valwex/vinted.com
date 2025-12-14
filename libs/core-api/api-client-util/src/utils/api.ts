import { Response, ResponseError } from '../types'

export const isResponseSuccessful = <T>(
  result: Response<T> | ResponseError,
): result is Response<T> => !('errors' in result)

type Options<R> = {
  shouldRetry?: (response: Response<R> | ResponseError) => boolean
  timesToRetry?: number
  retryDelay?: number
}

export function withRetry<
  R,
  T extends (...args: ReadonlyArray<any>) => Promise<Response<R> | ResponseError>,
>(
  callback: T,
  {
    shouldRetry = response => 'errors' in response,
    timesToRetry = 1,
    retryDelay = 1_000,
  }: Options<R>,
) {
  let retriesLeft = timesToRetry

  const retry: T = (async (...args) => {
    const response = await callback(...args)

    if (shouldRetry(response) && retriesLeft > 0) {
      retriesLeft -= 1

      return new Promise(resolve => {
        setTimeout(() => {
          resolve(retry(...args))
        }, retryDelay)
      })
    }

    return response
  }) as T

  return retry
}

export function isResponseError(value: unknown): value is ResponseError {
  return typeof value === 'object' && value != null && 'errors' in value
}
