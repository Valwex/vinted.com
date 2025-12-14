import { api } from '@marketplace-web/core-api/core-api-client-util'
import { ApiResponse } from '@marketplace-web/core-api/api-client-util'

import {
  GetRoktTransactionAttributesArgs,
  GetRoktTransactionAttributesResp,
} from '../types/rokt-transaction-attributes'
import { PostAdvertisingLeadFormArgs } from '../types/advertising-lead-form'
import { postAdvertisingLeadFormArgsToParams } from '../transformers/advertising-lead-form'
import { TrackVanRealTimeImpressionArgs } from '../types/van-real-time-impressions'
import {
  GetAdEligibilityForTransactionResp,
  GetVanAdPlacementArgs,
  GetVanAdPlacementResp,
  GetVanMultiAdPlacementsArgs,
  GetVanMultiAdPlacementsResp,
} from '../types/van-ad-placement'

export const getRoktTransactionsAttributes = ({
  transactionId,
}: GetRoktTransactionAttributesArgs) =>
  api.get<GetRoktTransactionAttributesResp>(
    `/ads/rokt?transaction_id=${transactionId}&cart_items=true`,
  )

export const postAdvertisingLeadForm = (args: PostAdvertisingLeadFormArgs) =>
  api.post('/ads/lead', postAdvertisingLeadFormArgsToParams(args))

export const getVanAdPlacement = ({
  consentStatus,
  page,
  placementId,
  correlationId,
  purchaseId,
}: GetVanAdPlacementArgs) =>
  api.get<GetVanAdPlacementResp>(`van/${placementId}`, {
    params: {
      screen: page,
      personalize: consentStatus,
      purchase_id: purchaseId,
    },
    headers: {
      'correlation-id': correlationId,
    },
  })

export const getAdEligibilityForTransaction = (transactionId: number, purchaseId?: string | null) =>
  api.get<GetAdEligibilityForTransactionResp>('ads/offers', {
    params: {
      transaction_id: transactionId,
      ...(purchaseId ? { purchase_id: purchaseId } : {}),
    },
  })

export const getVanMultiAdPlacements = ({
  consentStatus,
  page,
  placementId,
  correlationId,
  purchaseId,
}: GetVanMultiAdPlacementsArgs) =>
  api.get<GetVanMultiAdPlacementsResp>(`van/multi-offer/${placementId}`, {
    params: {
      screen: page,
      personalize: consentStatus,
      purchase_id: purchaseId,
    },
    headers: {
      'correlation-id': correlationId,
    },
  })

export const trackVanRealTimeImpression = (args: TrackVanRealTimeImpressionArgs) =>
  api.post<ApiResponse>(
    '/van/impression',
    {
      screen: args.screen,
      placement_id: args.placementId,
      campaign_id: args.campaignId,
      country_code: args.countryCode,
      price_reference: args.priceReference,
    },
    {
      headers: {
        'correlation-id': args.correlationId,
      },
    },
  )
