import { throttle } from 'lodash'

export async function requestContentCardsRefresh() {
  const { requestContentCardsRefresh: brazeRequestContentCardsRefresh } = await import(
    '@braze/web-sdk'
  )

  return new Promise<void>((resolve, reject) => {
    brazeRequestContentCardsRefresh(resolve, reject)
  })
}

const CONTENT_CARDS_REFRESH_THROTTLE_INTERVAL = 10_000

export const requestContentCardsRefreshThrottled = throttle(
  requestContentCardsRefresh,
  CONTENT_CARDS_REFRESH_THROTTLE_INTERVAL,
  {
    leading: true,
    trailing: false,
  },
)

export async function disableBraze() {
  const { disableSDK } = await import('@braze/web-sdk')

  disableSDK()
}

export async function enableBraze() {
  const { enableSDK } = await import('@braze/web-sdk')

  enableSDK()
}

export async function flushBraze() {
  const { requestImmediateDataFlush } = await import('@braze/web-sdk')

  return new Promise<boolean>(resolve => {
    requestImmediateDataFlush(resolve)
  })
}

export async function getBrazeUserId() {
  const { getUser } = await import('@braze/web-sdk')

  const brazeUser = getUser()
  if (!brazeUser) return null

  return brazeUser.getUserId()
}

export async function setBrazeUserCustomAttribute(key: string, value: any): Promise<void> {
  const { getUser } = await import('@braze/web-sdk')

  const brazeUser = getUser()

  brazeUser?.setCustomUserAttribute(key, value)
}
