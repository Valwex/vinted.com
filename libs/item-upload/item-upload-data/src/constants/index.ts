export const MODEL_OTHER_ID = 2
export const UPLOADED_ITEM_ID = 'uploaded_item_id'
export const UPLOAD_SESSION_ID = 'upload_session_id'
export const UPLOADED_ITEM_PROMOTIONS = 'uploaded_item_promotions'

export enum PromotionStorageKeys {
  ShowBumped = 'pushed_up_promotion',
  ShowFeedback = 'feedback_promotion',
  ShowUploadAnotherItemTip = 'upload_another_item_tip_promotion',
}

export enum ItemAfterUploadActions {
  ShowUploadAnotherItemTip = 'show_upload_another_item_tip',
  ShowEVSModal = 'show_electronics_verification_modal',
  ShowIVSModal = 'show_item_verification_modal',
  ShowBumpsCheckout = 'show_bumps_checkout',
}

export const REQUEST_DELAY = 500

export enum ISBNRecordsStatus {
  Initial = 'initial',
  Found = 'found',
  NotFound = 'not found',
}

export enum SelectionSource {
  Default = 'default',
  Suggestion = 'suggestion',
  Prefill = 'prefill',
  Search = 'search',
}

export enum ItemUploadFailReason {
  ValidationError = 'validation_error',
  ServerError = 'server_error',
  Other = 'other',
}

export enum ItemUploadFieldName {
  Category = 'category',
  Photos = 'photos',
  Root = 'root',
  Size = 'size',
  Isbn = 'isbn',
  Author = 'author',
  BookTitle = 'book_title',
  Color = 'color',
  Unisex = 'unisex',
  Brand = 'brand',
  VideoGamePlatform = 'video_game_platform',
  Condition = 'condition',
  Model = 'model',
  Price = 'price',
  VideoGameRating = 'video_game_rating',
  Measurements = 'measurements',
  MeasurementWidth = 'measurement_width',
  MeasurementLength = 'measurement_length',
  Bump = 'bump',
  Title = 'title',
  Description = 'description',
  Manufacturer = 'manufacturer',
  ManufacturerLabel = 'manufacturer_labelling',
  PackageSize = 'package_size',
  ParcelHeight = 'parcel_dimensions_height',
  ParcelWidth = 'parcel_dimensions_width',
  ParcelLength = 'parcel_dimensions_length',
  ParcelWeight = 'parcel_weight',
  DomesticShipmentPrice = 'shipment_prices.domestic',
  InternationalShipmentPrice = 'shipment_prices.international',
}

export enum ItemStatus {
  New = 'upload_item',
  Edit = 'edit_item',
  DraftEdit = 'edit_draft',
}

export const WITHOUT_BRAND_ID = 1 // Should match Brand::ID_EMPTY (from backend)

export const MULTIPLE_SIZE_GROUPS_HEADER = {
  'X-Enable-Multiple-Size-Groups': 'true',
}

export const BRAND_MINIMIZED_HEADER = {
  'Mda-Brand': 'true',
}

export enum Measurements {
  Imperial = 'imperial',
  Metric = 'metric',
}

export const COLOR_SUGGESTIONS_BASED_ON_PHOTOS_AB_TEST = 'color_classifier_llm_item_upload'
export const LLM_BRAND_SUGGESTIONS_AB_TEST = 'brand_classifier_llm_item_upload'
