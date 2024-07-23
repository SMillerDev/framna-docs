import { Octokit } from "octokit"
import { createAppAuth } from "@octokit/auth-app"
import IGitHubClient, {
  GraphQLQueryRequest,
  GraphQlQueryResponse,
  GetRepositoryContentRequest,
  GetPullRequestCommentsRequest,
  GetPullRequestFilesRequest,
  AddCommentToPullRequestRequest,
  UpdatePullRequestCommentRequest,
  RepositoryContent,
  PullRequestComment,
  PullRequestFile
} from "./IGitHubClient"

interface IGitHubOAuthTokenDataSource {
  getOAuthToken(): Promise<{ accessToken: string }>
}

type GitHubContentItem = {download_url: string}

type InstallationAuthenticator = (installationId: number) => Promise<{token: string}>

export default class GitHubClient implements IGitHubClient {
  private readonly oauthTokenDataSource: IGitHubOAuthTokenDataSource
  private readonly installationAuthenticator: InstallationAuthenticator
  
  constructor(config: {
    appId: string
    clientId: string
    clientSecret: string
    privateKey: string
    oauthTokenDataSource: IGitHubOAuthTokenDataSource
  }) {
    this.oauthTokenDataSource = config.oauthTokenDataSource
    const appAuth = createAppAuth({
      appId: config.appId,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      privateKey: config.privateKey
    })
    this.installationAuthenticator = async (installationId: number) => {
      return await appAuth({ type: "installation", installationId })
    }
  }
  
  async graphql(request: GraphQLQueryRequest): Promise<GraphQlQueryResponse> {
    const oauthToken = await this.oauthTokenDataSource.getOAuthToken()
    const octokit = new Octokit({ auth: oauthToken.accessToken })
    return await octokit.graphql(request.query, request.variables)
  }
  
  async getRepositoryContent(request: GetRepositoryContentRequest): Promise<RepositoryContent> {
    const oauthToken = await this.oauthTokenDataSource.getOAuthToken()
    const octokit = new Octokit({ auth: oauthToken.accessToken })
    const response = await octokit.rest.repos.getContent({
      owner: request.repositoryOwner,
      repo: request.repositoryName,
      path: request.path,
      ref: request.ref
    })
    const item = response.data as GitHubContentItem
    return { downloadURL: item.download_url }
  }
  
  async getPullRequestFiles(request: GetPullRequestFilesRequest): Promise<PullRequestFile[]> {
    const auth = await this.installationAuthenticator(request.appInstallationId)
    const octokit = new Octokit({ auth: auth.token })
    const files = await octokit.paginate(octokit.rest.pulls.listFiles, {
      owner: request.repositoryOwner,
      repo: request.repositoryName,
      pull_number: request.pullRequestNumber,
    })
    return files.map(file => {
      return { filename: file.filename, status: file.status }
    })
  }
  
  async getPullRequestComments(request: GetPullRequestCommentsRequest): Promise<PullRequestComment[]> {
    const auth = await this.installationAuthenticator(request.appInstallationId)
    const octokit = new Octokit({ auth: auth.token })
    const comments = await octokit.paginate(octokit.rest.issues.listComments, {
      owner: request.repositoryOwner,
      repo: request.repositoryName,
      issue_number: request.pullRequestNumber,
    })
    const result: PullRequestComment[] = []
    for await (const comment of comments) {
      const id = comment.id
      const body = comment.body
      const isFromBot = comment.user?.type == "Bot"
      let gitHubApp: { id: string } | undefined
      if (comment.performed_via_github_app) {
        gitHubApp = { id: comment.performed_via_github_app.id.toString() }
      }
      result.push({ id, body, isFromBot, gitHubApp })
    }
    return result
  }
  
  async addCommentToPullRequest(request: AddCommentToPullRequestRequest): Promise<void> {
    const auth = await this.installationAuthenticator(request.appInstallationId)
    const octokit = new Octokit({ auth: auth.token })
    await octokit.rest.issues.createComment({
      owner: request.repositoryOwner,
      repo: request.repositoryName,
      issue_number: request.pullRequestNumber,
      body: request.body
    })
  }
  
  async updatePullRequestComment(request: UpdatePullRequestCommentRequest): Promise<void> {
    const auth = await this.installationAuthenticator(request.appInstallationId)
    const octokit = new Octokit({ auth: auth.token })
    await octokit.rest.issues.updateComment({
      comment_id: request.commentId,
      owner: request.repositoryOwner,
      repo: request.repositoryName,
      body: request.body
    })
  }
}
