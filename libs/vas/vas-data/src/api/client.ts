import { api } from '@marketplace-web/core-api/core-api-client-util'
import { ApiClient } from '@marketplace-web/core-api/api-client-util'

import { ClosetPromoPerfrmanceResponse } from '../types/closet-promo-performance'
import {
  GetClosetPromotionArgs,
  PromotedClosetsListResp,
  PromotedClosetsListRespSvcVas,
} from '../types/closet-promotions'
import { ClosetPromotionPricingResp } from '../types/closet-promotion-pricing'
import { getClosetPromotionsArgsToParams } from '../transformers/closet-promotions'
import {
  PromotedClosetOrderResp,
  PromotedClosetOrderRespSvcVas,
} from '../types/closet-promotion-order'
import { GetVasEntryPointsArgs, GetVasEntryPointsResp } from '../types/vas-entry-points'
import { ItemBumpStatsResponse, ItemPerformanceResponse } from '../types/item-performance'
import { PrepareBumpOrderResp, PrepareBumpOrderRespSvcVas } from '../types/bump-order'
import { BumpOptionResp, BumpOptionsRespSvcVas, GetBumpOptionsArgs } from '../types/bump-options'
import { BumpMinimumPriceResp } from '../types/bump-minimum-price'
import {
  GetBumpableItemsArgs,
  GetBumpableItemsResp,
  GetBumpableItemsRespSvcVas,
} from '../types/bumpable-items'
import { GetBumpsItemsSelectionBannerResp } from '../types/bumps-item-selection-banner'
import { BumpAgainSuggestionResp } from '../types/bump-again-suggestion'

const moneyObjectHeader = {
  'X-Money-Object': 'true',
}

const vasApiClient = new ApiClient({
  baseURL: '/web/api/vas',
  headers: { platform: 'web' },
})

export const getClosetPromotionPerformance = () =>
  api.get<ClosetPromoPerfrmanceResponse>('promoted_closets/performances')

export const getClosetPromotions = (args: GetClosetPromotionArgs) =>
  api.get<PromotedClosetsListResp>('/promoted_closets', {
    params: getClosetPromotionsArgsToParams(args),
    headers: moneyObjectHeader,
  })

export const prepareClosetPromotionOrder = () =>
  api.post<PromotedClosetOrderResp>('/promoted_closets/orders/prepare', undefined, {
    headers: moneyObjectHeader,
  })

export const getItemPerformance = (itemId: number) =>
  api.get<ItemPerformanceResponse>(`items/${itemId}/performance`)

export const prepareBumpOrder = (
  itemIds: Array<number>,
  effectiveDays: number,
  international?: boolean,
) =>
  api.post<PrepareBumpOrderResp>(
    '/push_ups/orders',
    {
      item_ids: itemIds,
      effective_days: effectiveDays,
      international,
    },
    { headers: moneyObjectHeader },
  )

export const getBumpOptions = ({ itemIds }: GetBumpOptionsArgs) =>
  api.get<BumpOptionResp>('/push_ups/options', {
    params: { item_ids: itemIds },
    headers: moneyObjectHeader,
  })

export const getBumpableItems = ({ currentPage, perPage }: GetBumpableItemsArgs) =>
  api.get<GetBumpableItemsResp>('/bumps/bumpable_items', {
    params: { per_page: perPage, page: currentPage },
  })

export const getBumpsItemsSelectionBanner = () =>
  api.get<GetBumpsItemsSelectionBannerResp>('/bumps/items_selection_banner')

export const getVasEntryPoints = ({ bannerNames }: GetVasEntryPointsArgs) =>
  vasApiClient.get<GetVasEntryPointsResp>('/entry_points', {
    params: { names: bannerNames },
    paramsSerializer: { indexes: null },
  })

export const getBumpMinimumPrice = (itemPrice?: number) =>
  vasApiClient.get<BumpMinimumPriceResp>('/bumps/minimum_price', {
    params: { item_price: itemPrice },
    headers: moneyObjectHeader,
  })

export const getBumpAgainSuggestion = () =>
  vasApiClient.get<BumpAgainSuggestionResp>('/bumps/bump_again_suggestion')

export const getClosetPromotionPricing = () =>
  vasApiClient.get<ClosetPromotionPricingResp>('/promoted_closets/pricing')

export const getItemBumpStatsSvcVas = (itemId: number) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  return vasApiClient.get<ItemBumpStatsResponse>(`/items/${itemId}/bumps/stats`, {
    headers: {
      'Device-Timezone': timezone,
    },
  })
}

export const getBumpOptionsSvcVas = ({ itemIds }: GetBumpOptionsArgs) =>
  vasApiClient.get<BumpOptionsRespSvcVas>('/bumps/options', {
    params: { item_ids: itemIds.join(',') },
    headers: moneyObjectHeader,
  })

export const prepareClosetPromotionOrderSvcVas = () =>
  vasApiClient.post<PromotedClosetOrderRespSvcVas>('/promoted_closets/orders')

export const prepareBumpOrderSvcVas = (
  itemIds: Array<number>,
  effectiveDays: number,
  international: boolean,
) =>
  vasApiClient.post<PrepareBumpOrderRespSvcVas>('/bumps/orders', {
    item_ids: itemIds,
    effective_days: effectiveDays,
    international,
  })

export const getClosetPromotionsSvcVas = (args: GetClosetPromotionArgs) =>
  vasApiClient.get<PromotedClosetsListRespSvcVas>('/promoted_closets', {
    params: getClosetPromotionsArgsToParams(args),
    headers: moneyObjectHeader,
  })

export const getBumpableItemsSvcVas = ({ currentPage, perPage }: GetBumpableItemsArgs) =>
  vasApiClient.get<GetBumpableItemsRespSvcVas>('/bumps/bumpable_items', {
    params: { per_page: perPage, page: currentPage },
  })
