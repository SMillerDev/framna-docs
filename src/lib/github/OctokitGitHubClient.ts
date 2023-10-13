import { IGitHubBranch } from "./IGitHubBranch"
import { IGitHubClient } from "./IGitHubClient"
import { IGitHubContentItem } from "./IGitHubContentItem"
import { IGitHubRepository } from "./IGitHubRepository"
import { IGitHubTag } from "./IGitHubTag"
import { Octokit } from "octokit"

type GitHubItem = {name: string, path: string, download_url: string}

export class OctokitGitHubClient implements IGitHubClient {
  private organizationName: string
  private octokit: Octokit
  
  constructor(organizationName: string, accessToken: string) {
    this.organizationName = organizationName
    this.octokit = new Octokit({ auth: accessToken })
  }
  
  async getRepositories(suffix: string): Promise<IGitHubRepository[]> {
    let repositories: IGitHubRepository[] = []
    for await (const response of this.octokit.paginate.iterator(
      this.octokit.rest.search.repos,
      {
        q: "org:" + this.organizationName + " " + suffix + " in:name"
      }
    )) {
      repositories = repositories.concat(response.data
        .filter(e => {
          return e.name.endsWith(suffix)
        })
        .filter(e => e.owner != null )
        .map(e => {
          return {
            name: e.name,
            owner: e.owner!.login,
            defaultBranch: e.default_branch
          }
        })
      )
    }
    return repositories
  }
  
  async getBranches(owner: string, repository: string): Promise<IGitHubBranch[]> {
    let branches: IGitHubBranch[] = []
    for await (const response of this.octokit.paginate.iterator(
      this.octokit.rest.repos.listBranches,
      {
        owner,
        repo: repository
      }
    )) {
      branches = branches.concat(response.data.map(e => {
        return { name: e.name }
      }))
    }
    return branches
  }
  
  async getTags(owner: string, repository: string): Promise<IGitHubTag[]> {
    let tags: IGitHubTag[] = []
    for await (const response of this.octokit.paginate.iterator(
      this.octokit.rest.repos.listBranches,
      {
        owner,
        repo: repository
      }
    )) {
      tags = tags.concat(response.data.map(e => {
        return { name: e.name }
      }))
    }
    return tags
  }
  
  async getContent(
    owner: string,
    repository: string,
    ref?: string,
    path?: string
  ): Promise<IGitHubContentItem[]> {
    const response = await this.octokit.rest.repos.getContent({
      owner: owner,
      repo: repository,
      path: path || '',
      ref: ref
    })
    let items: GitHubItem[] = []
    if (Array.isArray(response.data)) {
      items = response.data as GitHubItem[]
    } else {
      items = [response.data as GitHubItem]
    }
    return items
      .map(e => {
        return {
          name: e.name,
          path: e.path,
          url: e.download_url
        }
      })
  }
}
