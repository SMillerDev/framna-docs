import { ILogInHandler, IUser, IAccount } from "."
import { IGuestRepository, IUserRepository } from "@/features/admin/domain"
import { IOAuthTokenRepository } from "../oauth-token"
import saneParseInt from "@/common/utils/saneParseInt"

export default class LogInHandler implements ILogInHandler {
  private readonly userRepository: IUserRepository
  private readonly guestRepository: IGuestRepository
  private readonly oauthTokenRepository: IOAuthTokenRepository
  
  constructor(config: {
    userRepository: IUserRepository,
    guestRepository: IGuestRepository,
    oauthTokenRepository: IOAuthTokenRepository
  }) {
    this.userRepository = config.userRepository
    this.guestRepository = config.guestRepository
    this.oauthTokenRepository = config.oauthTokenRepository
  }
  
  async handleLogIn({ user, account }: { user: IUser, account: IAccount | null }) {
    if (!account) {
      return false
    }
    if (account.provider === "github") {
      return await this.handleLogInForGitHubUser({ user, account })
    } else if (account.provider === "nodemailer") {
      return await this.handleLogInForGuestUser(user)
    } else {
      console.error("Unhandled account provider: " + account.provider)
      return false
    }
  }
  
  private async handleLogInForGitHubUser({ user, account }: { user: IUser, account: IAccount }) {
    if (!user.id) {
      return false
    }
    const accessToken = account.access_token
    const refreshToken = account.refresh_token
    if (!accessToken) {
      return false
    }
    if (!refreshToken) {
      return false
    }
    let userId = saneParseInt(user.id)
    if (!userId) {
      // We do not have a valid user ID, meaning this is the first time the user logs in.
      // When logging in for the first time, the user has a temporary ID that we cannot
      // look up in our database, so we rely on Auth.js to persist the access token and 
      // refresh token. This is intended according to Auth.js' documentation:
      // https://authjs.dev/reference/nextjs#signin
      return true
    }
    try {
      await this.oauthTokenRepository.set(`${userId}`, { accessToken, refreshToken })
      return true
    } catch (error) {
      return false
    }
  }
  
  private async handleLogInForGuestUser(user: IUser) {
    if (!user.email) {
      return false
    }
    const existingUser = await this.userRepository.findByEmail(user.email)
    if (existingUser && existingUser.accounts.length > 0) {
      // The user is already authenticated with an identity provider,
      // so we'll ask them to use that instead.
      return "/api/auth/signin?error=OAuthAccountNotLinked"
    }
    const guest = await this.guestRepository.findByEmail(user.email)
    if (!guest) {
      // The e-mail address has not been invited as a guest.
      return false
    }
    return true
  }
}
