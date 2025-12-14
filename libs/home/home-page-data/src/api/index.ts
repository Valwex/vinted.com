import { api } from '@marketplace-web/core-api/core-api-client-util'

import { HomepageTabResp } from '../types/homepage-blocks'
import { HomepageBlockResp } from '../types/api/response/homepage-block-resp'

type GetHomepageTabPageArgs = {
  tabName: string
  nextPageToken: string | null
  homepageSessionId: string
  columnCount: number
}

export const getHomepageTab = (args: GetHomepageTabPageArgs) =>
  api.get<HomepageTabResp>(`/homepage/${args.tabName}`, {
    params: {
      next_page_token: args.nextPageToken,
      homepage_session_id: args.homepageSessionId,
      column_count: args.columnCount,
      version: 4,
    },
  })

export const postHomepageAction = (args: { blockName: string; payload?: Array<string> }) =>
  api.post('/homepage/action', {
    block_name: args.blockName,
    payload: args.payload,
  })

type GetHomepageBlockArgs = {
  next_page_token: number | null
  [key: string]: string | number | null
}

export const getHomepageBlock = (params: GetHomepageBlockArgs) =>
  api.get<HomepageBlockResp>('/homepage/block', {
    params: {
      ...params,
      version: 4,
    },
  })
