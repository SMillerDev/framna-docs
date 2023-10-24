import OAuthToken from "./OAuthToken"

export default interface IUserDataOAuthTokenRepository {
  getOAuthToken(userId: string): Promise<OAuthToken>
  storeOAuthToken(userId: string, token: OAuthToken): Promise<void>
  deleteOAuthToken(userId: string): Promise<void>
}
