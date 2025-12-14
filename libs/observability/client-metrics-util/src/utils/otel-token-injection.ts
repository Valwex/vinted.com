import { serverSide } from '@marketplace-web/environment/environment-util'

declare global {
  interface Window {
    OTEL_TOKEN?: string
  }
}

export function getInjectedOtelToken(): string | null {
  if (serverSide) {
    return null
  }

  return window.OTEL_TOKEN || null
}
