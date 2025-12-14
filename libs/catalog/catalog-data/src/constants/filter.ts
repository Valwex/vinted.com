export const SELECT_DROPDOWN_MAX_HEIGHT = 320
export const SELECT_DROPDOWN_MIN_WIDTH = 300
export const SELECT_LARGER_DROPDOWN_MAX_HEIGHT = 368
export const SELECT_LARGER_DROPDOWN_MIN_WIDTH = 340
export const GRID_FILTER_DROPDOWN_MIN_WIDTH = 328
export const GRID_FILTER_DROPDOWN_MAX_HEIGHT = 388
export const ROOT_CATALOG_ALL_CODE = '_ALL_ROOT' as const

export enum SortByOption {
  Relevance = 'relevance',
  PriceHighToLow = 'price_high_to_low',
  PriceLowToHigh = 'price_low_to_high',
  NewestFirst = 'newest_first',
}

export enum Filter {
  Sort = 'sort',
  Category = 'category',
  Size = 'size',
  Brand = 'brand',
  Status = 'condition',
  Color = 'colour',
  Price = 'price',
  Country = 'country',
  Location = 'location',
  Material = 'material',
  VideoGameRating = 'video_game_rating',
  Dynamic = 'dynamic',
}
