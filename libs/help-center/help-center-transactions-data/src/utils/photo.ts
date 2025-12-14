enum UserThumbnailSize {
  Small = 'thumb20',
  Medium = 'thumb30',
  Default = 'thumb50',
  Large = 'thumb70',
  XLarge = 'thumb90',
  X2Large = 'thumb100',
  X3Large = 'thumb140',
  X4Large = 'thumb150',
  X5Large = 'thumb175',
  X6Large = 'thumb310',
}
type Thumbnails<T extends string> =
  | null
  | undefined
  | { thumbnails: Array<{ type: T; url: string }> }

export const findThumbnail = <T extends string>(
  photo: Thumbnails<T>,
  size: UserThumbnailSize | T = UserThumbnailSize.Default,
): string | null => {
  return photo?.thumbnails.find(({ type }) => type === size)?.url || null
}
