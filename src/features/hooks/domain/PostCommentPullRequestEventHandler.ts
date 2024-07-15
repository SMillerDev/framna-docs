import IPullRequestEventHandler, {
  IPullRequestOpenedEvent,
  IPullRequestReopenedEvent,
  IPullRequestSynchronizedEvent
} from "./IPullRequestEventHandler"
import { IGitHubClient, PullRequestFile } from "@/common"

export default class PostCommentPullRequestEventHandler implements IPullRequestEventHandler {
  private readonly domain: string
  private readonly siteName: string
  private readonly repositoryNameSuffix: string
  private readonly projectConfigurationFilename: string
  private readonly gitHubAppId: string
  private readonly gitHubClient: IGitHubClient
  private readonly fileExtensionRegex = /\.ya?ml$/
  
  constructor(config: {
    domain: string
    siteName: string
    repositoryNameSuffix: string
    projectConfigurationFilename: string
    gitHubAppId: string
    gitHubClient: IGitHubClient
  }) {
    this.domain = config.domain
    this.siteName = config.siteName
    this.repositoryNameSuffix = config.repositoryNameSuffix
    this.projectConfigurationFilename = config.projectConfigurationFilename
    this.gitHubAppId = config.gitHubAppId
    this.gitHubClient = config.gitHubClient
  }
  
  async pullRequestOpened(event: IPullRequestOpenedEvent): Promise<void> {
    await this.processEvent(event)
  }
  
  async pullRequestReopened(event: IPullRequestReopenedEvent) {
    await this.processEvent(event)
  }
  
  async pullRequestSynchronized(event: IPullRequestSynchronizedEvent) {
      await this.processEvent(event)
  }
  
  private async processEvent(event: {
    appInstallationId: number
    repositoryOwner: string
    repositoryName: string
    ref: string
    pullRequestNumber: number
  }) {
    const files = await this.getChangedYamlFiles(event)
    if (files.length == 0) {
      // Do nothing if no OpenAPI files were updated.
      return
    }
    const commentBody = this.makeCommentBody({
      files,
      owner: event.repositoryOwner,
      repositoryName: event.repositoryName,
      ref: event.ref
    })
    const existingComment = await this.getExistingComment(event)
    if (existingComment && existingComment.body !== commentBody) {
      await this.gitHubClient.updatePullRequestComment({
        appInstallationId: event.appInstallationId,
        commentId: existingComment.id,
        repositoryOwner: event.repositoryOwner,
        repositoryName: event.repositoryName,
        body: commentBody
      })
    } else if (!existingComment) {
      await this.gitHubClient.addCommentToPullRequest({
        appInstallationId: event.appInstallationId,
        repositoryOwner: event.repositoryOwner,
        repositoryName: event.repositoryName,
        pullRequestNumber: event.pullRequestNumber,
        body: commentBody
      })
    }
  }
  
  private async getChangedYamlFiles(request: {
    appInstallationId: number,
    repositoryOwner: string
    repositoryName: string
    pullRequestNumber: number
  }) {
    const files = await this.gitHubClient.getPullRequestFiles({
      appInstallationId: request.appInstallationId,
      repositoryOwner: request.repositoryOwner,
      repositoryName: request.repositoryName,
      pullRequestNumber: request.pullRequestNumber
    })
    return files
      .filter(file => file.filename.match(this.fileExtensionRegex))
      .filter(file => file.status != "unchanged")
  }
  
  private async getExistingComment(request: {
    appInstallationId: number,
    repositoryOwner: string
    repositoryName: string
    pullRequestNumber: number
  }) {
    const comments = await this.gitHubClient.getPullRequestComments({
      appInstallationId: request.appInstallationId,
      repositoryOwner: request.repositoryOwner,
      repositoryName: request.repositoryName,
      pullRequestNumber: request.pullRequestNumber,
    })
    return comments.find(comment => {
      return comment.isFromBot && comment.gitHubApp?.id == this.gitHubAppId
    })
  }
  
  private makeCommentBody(params: {
    files: PullRequestFile[]
    owner: string
    repositoryName: string
    ref: string
  }): string {
    const { files, owner, repositoryName, ref } = params
    const projectId = repositoryName.replace(new RegExp(this.repositoryNameSuffix + "$"), "")
    let rows: { title: string, status: string, link: string }[] = []
    // Make sure we don't include the project configuration file.
    const baseConfigFilename = this.projectConfigurationFilename.replace(this.fileExtensionRegex, "")
    const changedFiles = files.filter(file => file.filename.replace(this.fileExtensionRegex, "") != baseConfigFilename)
    for (const file of changedFiles) {
      let status = ""
      if (file.status == "added") {
        status += "Added"
      } else if (file.status == "removed") {
        status += "Remvoed"
      } else if (file.status == "renamed") {
        status += "Renamed"
      } else if (file.status == "changed" || file.status == "modified") {
        status += "Changed"
      }
      let link = ""
      if (file.status != "removed") {
        const url = `${this.domain}/${owner}/${projectId}/${ref}/${file.filename}`
        link += ` <a href="${url}">${url}</a>`
      }
      rows.push({ title: file.filename, status, link })
    }
    let result = `### 📖 Documentation Preview`
    result += `\n\n`
    result += `The changes are now ready to previewed on <a href="${this.domain}/${owner}/${projectId}/${ref}">${this.siteName}</a> 🚀`
    if (rows.length > 0) {
      const rowsHTML = rows
      .map(row => `<tr><td><strong>${row.title}</strong></td><td>${row.link}</td><td>${row.status}</td></tr>`)
      .join("\n")
      result = `${result}\n\n<table>${rowsHTML}</table>`
    }
    return result
  }
}
