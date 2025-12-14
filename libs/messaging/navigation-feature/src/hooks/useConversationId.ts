import { useMatch } from 'react-router-dom'

import { ID_REGEX, INBOX_FULL_ROUTE_PATHS } from '../routes'

const PATHNAME_ID_MAP = new Map<string, string | undefined>()

function getIdFromPathname(pathname: string) {
  if (PATHNAME_ID_MAP.has(pathname)) return PATHNAME_ID_MAP.get(pathname)

  const [, id] = pathname.match(ID_REGEX) ?? [undefined, undefined]

  PATHNAME_ID_MAP.set(pathname, id)

  return id
}

export default function useConversationId() {
  try {
    const detailsRouteMatch = useMatch(INBOX_FULL_ROUTE_PATHS.CONVERSATION_DETAILS)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const conversationRouteMatch = useMatch(INBOX_FULL_ROUTE_PATHS.CONVERSATION)

    return detailsRouteMatch?.params.id ?? conversationRouteMatch?.params.id
  } catch {
    if (typeof window === 'undefined') return undefined

    return getIdFromPathname(window.location.pathname)
  }
}
