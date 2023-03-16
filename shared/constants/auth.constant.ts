export enum AuthGuardType {
  Jwt = 'jwt',
  JwtRefresh = 'jwt-refresh',
  LocalAdmin = 'local.admin',
  LocalUser = 'local.organization',
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
