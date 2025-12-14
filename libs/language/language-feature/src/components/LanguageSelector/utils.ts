import { removeParamsFromQuery } from '@marketplace-web/browser/url-util'

export const removeLocaleUrlParam = (relativeUrl: string, urlQuery: string) =>
  removeParamsFromQuery(relativeUrl, urlQuery, ['locale'])
