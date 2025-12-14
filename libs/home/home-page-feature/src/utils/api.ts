import {
  isResponseError,
  ResponseError,
  ResponseCode,
} from '@marketplace-web/core-api/api-client-util'
import { getHomepageTab, HomepageTabResp } from '@marketplace-web/home/home-page-data'

import { FetchHomepageBlocksOptions } from '../types'

export const EMPTY_RESPONSE_ERROR = {
  status: 200,
  code: ResponseCode.Ok,
  message: 'empty',
  errors: [],
  exception: null,
} as const satisfies ResponseError

export const getHomepageBlocks = async ({
  tab,
  ...options
}: FetchHomepageBlocksOptions): Promise<HomepageTabResp | ResponseError> => {
  const tabResponse = await getHomepageTab({ tabName: tab.name, ...options })

  if (isResponseError(tabResponse)) return tabResponse

  if (tabResponse.blocks.length === 0) return EMPTY_RESPONSE_ERROR

  return tabResponse
}
