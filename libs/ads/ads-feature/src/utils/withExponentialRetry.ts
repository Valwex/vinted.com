import { Response, ResponseError } from '@marketplace-web/core-api/api-client-util'

type ExponentialRetryOptions = {
  initialDelayMs?: number
  maxDelayMs?: number
  maxTotalDurationMs?: number
}

function shouldRetry<T>(response: Response<T> | ResponseError): boolean {
  const invalidResponseCodes = [429]

  if (response.code === undefined) return true
  if ('errors' in response) return true

  return invalidResponseCodes.includes(response.code)
}

const EXPONENTIAL_RETRY_INITIAL_DELAY_MS = 2000
const EXPONENTIAL_RETRY_MAX_DELAY_MS = 60000
const EXPONENTIAL_RETRY_MAX_TOTAL_DURATION_MS = 60 * 60 * 1000

/**
 * Default exponential retry behavior:
 * - Starts with an initial delay between attempts (`EXPONENTIAL_RETRY_INITIAL_DELAY_MS`)
 * - On each failed attempt, the delay doubles, but never exceeds `EXPONENTIAL_RETRY_MAX_DELAY_MS`
 * - Retries stop after the total wait time passes `EXPONENTIAL_RETRY_MAX_TOTAL_DURATION_MS` (1 hour),
 *   and a final attempt is made and its result is returned.
 */

export function withExponentialRetry<
  R,
  T extends (...args: ReadonlyArray<any>) => Promise<Response<R> | ResponseError>,
>(
  callback: T,
  {
    initialDelayMs = EXPONENTIAL_RETRY_INITIAL_DELAY_MS,
    maxDelayMs = EXPONENTIAL_RETRY_MAX_DELAY_MS,
    maxTotalDurationMs = EXPONENTIAL_RETRY_MAX_TOTAL_DURATION_MS,
  }: ExponentialRetryOptions = {},
) {
  const retry: T = (async (...args) => {
    let delayMs = initialDelayMs
    let totalElapsedMs = 0

    while (totalElapsedMs + delayMs <= maxTotalDurationMs) {
      // Disabled because it cries about the await's in the loops
      // eslint-disable-next-line no-await-in-loop
      const result = await callback(...args)

      if (!shouldRetry(result)) {
        return result
      }

      // eslint-disable-next-line no-await-in-loop, @typescript-eslint/no-loop-func, no-promise-executor-return
      await new Promise(resolve => setTimeout(resolve, delayMs))

      totalElapsedMs += delayMs
      delayMs = Math.min(delayMs * 2, maxDelayMs)
    }

    const finalResult = await callback(args)

    return finalResult || undefined
  }) as T

  return retry
}
