import { ContentSource } from '@marketplace-web/vas/vas-data'

export function getPromotedClosetContentSource(contentSource?: ContentSource) {
  switch (contentSource) {
    case 'search':
      return 'search_promoted_closets'
    case 'catalog':
      return 'catalog_promoted_closets'
    default:
      return 'promoted_closets'
  }
}
