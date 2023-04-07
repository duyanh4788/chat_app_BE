export interface IAuthenticatorAppStationDriversRepository {
  createAuthPair(userId: string): Promise<string>;

  pairAuth(userId: string, token: string): Promise<void>;
}
