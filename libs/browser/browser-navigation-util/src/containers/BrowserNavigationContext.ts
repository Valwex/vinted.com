import { createContext } from 'react'

export type BrowserNavigationContextType = {
  url: string
  serverUrl: string
  urlParams: Record<string, string | Array<string> | undefined>
  back: () => void
  push: (url: string) => void
  routerPush: (url: string) => void
  replace: (url: string) => void
  refreshUrl: () => void
}

const BrowserNavigationContext = createContext<BrowserNavigationContextType | null>(null)

export default BrowserNavigationContext
