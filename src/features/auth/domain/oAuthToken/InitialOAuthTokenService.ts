import IOAuthTokenRefresher from "./IOAuthTokenRefresher"
import IOAuthTokenRepository from "./IOAuthTokenRepository"

interface IRefreshTokenReader {
  getRefreshToken(userId: string): Promise<string>
}

type InitialOAuthTokenServiceConfig = {
  readonly refreshTokenReader: IRefreshTokenReader
  readonly oAuthTokenRefresher: IOAuthTokenRefresher
  readonly oAuthTokenRepository: IOAuthTokenRepository
}

export default class InitialOAuthTokenService {
  private readonly config: InitialOAuthTokenServiceConfig
  
  constructor(config: InitialOAuthTokenServiceConfig) {
    this.config = config
  }
  
  async fetchInitialAuthTokenForUser(userId: string): Promise<void> {
    const refreshToken = await this.config.refreshTokenReader.getRefreshToken(userId)
    const authToken = await this.config.oAuthTokenRefresher.refreshOAuthToken(refreshToken)
    this.config.oAuthTokenRepository.set(userId, authToken)
  }
}