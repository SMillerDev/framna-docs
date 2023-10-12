import { IGitHubBranch } from "./IGitHubBranch"
import { IGitHubRepository } from "./IGitHubRepository"
import { IGitHubTag } from "./IGitHubTag"

export interface IGitHubClient {
  getRepositories(suffix: string): Promise<IGitHubRepository[]>
  getBranches(owner: string, repository: string): Promise<IGitHubBranch[]>
  getTags(owner: string, repository: string): Promise<IGitHubTag[]>
}
