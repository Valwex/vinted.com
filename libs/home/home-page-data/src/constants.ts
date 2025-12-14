export enum ItemBlockCtaType {
  Header = 'header',
  Item = 'item',
}

export enum BlockEntityType {
  ItemBoxBlock = 'item_box_block',
  ThumbnailsBlock = 'thumbnails_block',
  ExposureBlock = 'exposure_block',
  BannersBlock = 'banners_block',
  Header = 'header',
  AdOrCloset = 'ad_or_closet',
  Item = 'item',
  ListerActivationBanner = 'lister_activation_banner',
  BrazePromobox = 'braze_promobox',
  ClickableListCards = 'clickable_list_cards',
  CtaWidget = 'cta_widget',
  AcceptedOfferWidget = 'accepted_offer_widget',
}

export enum ThumbnailsBlockStyle {
  SmallImage = 'small_image',
  BigImage = 'big_image',
  TwoHorizontalRows = 'two_horizontal_rows',
  SmallRoundImage = 'small_round_image',
  Icons = 'icons',
}

export const SINGLE_SLOT_BLOCKS = [BlockEntityType.Item, BlockEntityType.BrazePromobox]
export const TWO_SLOT_BLOCKS = [BlockEntityType.AcceptedOfferWidget]

export enum ItemThumbnailSize {
  Small = 'thumb70x100',
  Medium = 'thumb150x210',
  Large = 'thumb310x430',
  XLarge = 'thumb364x428',
  X2Large = 'thumb624x428',
}
