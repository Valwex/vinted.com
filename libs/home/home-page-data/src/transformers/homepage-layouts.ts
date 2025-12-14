import { transformBannersBlockElements } from '@marketplace-web/banners/banners-data'

import {
  BannersBlockDto,
  LayoutElementDto,
  ThumbnailsBlockDto,
} from '../types/dtos/homepage-layouts'
import {
  BannersBlockModel,
  LayoutElementModel,
  ThumbnailsBlockModel,
} from '../types/models/homepage-layouts'

export const transformLayoutElement = (
  thumbnails: Array<LayoutElementDto>,
): Array<LayoutElementModel> => {
  if (!thumbnails) return []

  return thumbnails.map(thumbnail => ({
    id: thumbnail.id,
    title: thumbnail.title,
    photo: {
      url: thumbnail.photo.url,
    },
    contentSource: thumbnail.content_source,
    cta: {
      uri: thumbnail.cta.uri,
      url: thumbnail.cta.url,
      accessibilityLabel: thumbnail.cta.accessibility_label,
      title: thumbnail.cta.title,
    },
  }))
}

export const transformThumbnailsBlock = (block: ThumbnailsBlockDto): ThumbnailsBlockModel => ({
  id: block.id,
  title: block.title,
  name: block.name,
  style: block.style,
  subtitle: block.subtitle,
  elements: transformLayoutElement(block.elements),
})

export const transformBannersBlock = (block: BannersBlockDto): BannersBlockModel => ({
  id: block.id,
  name: block.name,
  elements: transformBannersBlockElements(block.elements),
})
