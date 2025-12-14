export enum AdPage {
  Feed = 'feed',
  Catalog = 'catalog',
  Messages = 'messages',
  NewMessage = 'new_message',
  ReplyMessage = 'reply_message',
  Item = 'item',
  FavoriteItems = 'favorite_items',
  Notifications = 'notifications',
  Unknown = 'unknown',
}

export enum AdKind {
  Rtb = 'rtb',
  Van = 'van',
}

export enum AdPlatform {
  Mobile = 'mobile',
  Web = 'web',
}

export enum AdShape {
  Leaderboard = 'leaderboard',
  Rectangle = 'rectangle',
  Skyscraper = 'skyscraper',
  Inbetween = 'inbetween',
}

export enum VanFallbackReason {
  NoFill = 'no_fill',
  NetworkError = 'load_error',
}

export enum VanAdLoggingType {
  AdLoad = 'van_ad_load',
  AdAssetLoad = 'van_ad_asset_load',
}
