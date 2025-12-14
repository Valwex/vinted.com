export enum AuthenticateGrantType {
  Password = 'password',
  Assertion = 'assertion',
  RefreshToken = 'refresh_token',
}

export enum AuthenticationScope {
  User = 'user',
  Public = 'public',
  PublicUser = 'public user',
  PublicUserAdmin = 'public user admin',
}

export enum AuthenticationTokenType {
  Bearer = 'bearer',
}

export enum AuthenticateProvider {
  Facebook = 'facebook',
  Google = 'google',
  Apple = 'apple',
  CrossPortal = 'cross_portal',
  Vinted = 'vinted',
}

export const CLIENT_ID = 'web'
