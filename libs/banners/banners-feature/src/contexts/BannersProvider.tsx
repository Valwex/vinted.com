'use client'

import { createContext, ReactNode, useCallback, useMemo, useState } from 'react'
import { noop } from 'lodash'

import { cookiesDataByName, useCookie } from '@marketplace-web/environment/cookies-util'
import { UiState, useLatestCallback } from '@marketplace-web/shared/ui-state-util'
import {
  BannersModel,
  transformBanners,
  BannersDto,
  setBannerAsSeen,
  getBanners,
  GetBannersArgs,
} from '@marketplace-web/banners/banners-data'

export type BannersContextType = {
  fetchBanners: () => void
  setSeenBannerTypeToCookies: (value: string) => void
  banners: BannersModel
  onBannerSeen: ({ type, name }: OnBannerSeen) => void
  uiState: UiState
}

type BannersProviderProps = {
  children: ReactNode
}

export const initialValues: BannersContextType = {
  fetchBanners: noop,
  setSeenBannerTypeToCookies: noop,
  banners: transformBanners({}),
  onBannerSeen: noop,
  uiState: UiState.Idle,
}

type OnBannerSeen = {
  type: keyof BannersDto
  name?: string
}

export const BannersContext = createContext<BannersContextType>(initialValues)

const BannersProvider = ({ children }: BannersProviderProps) => {
  const [uiState, setUiState] = useState(UiState.Idle)
  const [banners, setBanners] = useState<BannersModel>(transformBanners({}))
  const cookies = useCookie()

  const getSeenBannerTypesFromCookies = useCallback((): Array<string> => {
    return cookies.get(cookiesDataByName.seen_banners)?.split(',') || []
  }, [cookies])

  const setSeenBannerTypeToCookies = useCallback(
    (type: string) =>
      cookies.set(
        cookiesDataByName.seen_banners,
        [...getSeenBannerTypesFromCookies(), type].join(','),
      ),
    [getSeenBannerTypesFromCookies, cookies],
  )

  const removeSeenBannersFromResponse = useCallback(
    (response: BannersDto) => {
      const seenBannerTypes = getSeenBannerTypesFromCookies()

      return Object.keys(response).reduce((acc, key) => {
        if (!seenBannerTypes.includes(key)) {
          return { ...acc, [key]: response[key] }
        }

        return acc
      }, {})
    },
    [getSeenBannerTypesFromCookies],
  )

  const fetchBanners = useLatestCallback(async ({ disableCache = false }: GetBannersArgs = {}) => {
    if ([UiState.Success, UiState.Pending].includes(uiState)) return

    setUiState(UiState.Pending)
    cookies.set(cookiesDataByName.banners_ui_state, UiState.Pending)

    const response = await getBanners({ disableCache })

    if ('errors' in response) {
      setUiState(UiState.Failure)
      cookies.set(cookiesDataByName.banners_ui_state, UiState.Failure)

      return
    }

    const transformedBanners = transformBanners(removeSeenBannersFromResponse(response.banners))

    setBanners(transformedBanners)
    setUiState(UiState.Success)
    cookies.set(cookiesDataByName.banners_ui_state, UiState.Success)
  })

  const onBannerSeen = useCallback(
    ({ type, name }: OnBannerSeen) => {
      setBannerAsSeen({ type, name })
      setSeenBannerTypeToCookies(type)
    },
    [setSeenBannerTypeToCookies],
  )

  const value = useMemo(
    () => ({
      fetchBanners,
      onBannerSeen,
      setSeenBannerTypeToCookies,
      banners,
      uiState,
    }),
    [fetchBanners, onBannerSeen, banners, uiState, setSeenBannerTypeToCookies],
  )

  return <BannersContext.Provider value={value}>{children}</BannersContext.Provider>
}

export default BannersProvider
