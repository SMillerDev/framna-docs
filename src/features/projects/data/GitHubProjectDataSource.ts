import IGitHubClient from "@/common/github/IGitHubClient"
import Project from "../domain/Project"
import IProjectConfig from "../domain/IProjectConfig"
import IProjectDataSource from "../domain/IProjectDataSource"
import Version from "../domain/Version"
import ProjectConfigParser from "../domain/ProjectConfigParser"

type SearchResult = {
  readonly name: string
  readonly owner: {
    readonly login: string
  }
  readonly defaultBranchRef: {
    readonly name: string
  }
  readonly configYml?: {
    readonly text: string
  }
  readonly configYaml?: {
    readonly text: string
  }
  readonly branches: NodesContainer<Ref>
  readonly tags: NodesContainer<Ref>
}

type NodesContainer<T> = {
  readonly nodes: T[]
}

type Ref = {
  readonly name: string
  readonly target: {
    readonly tree: {
      readonly entries: File[]
    }
  }
}

type File = {
  readonly name: string
}

export default class GitHubProjectDataSource implements IProjectDataSource {
  private gitHubClient: IGitHubClient
  private organizationName: string
  
  constructor(gitHubClient: IGitHubClient, organizationName: string) {
    this.gitHubClient = gitHubClient
    this.organizationName = organizationName
  }
  
  async getProjects(): Promise<Project[]> {
    const response = await this.gitHubClient.graphql(`
      query Repositories($searchQuery: String!) {
        search(query: $searchQuery, type: REPOSITORY, first: 100) {
          results: nodes {
            ... on Repository {
              name
              owner {
                login
              }
              defaultBranchRef {
                name
              }
              configYml: object(expression: "HEAD:.shape-docs.yml") {
                ...ConfigParts
              }
              configYaml: object(expression: "HEAD:.shape-docs.yaml") {
                ...ConfigParts
              }
              branches: refs(refPrefix: "refs/heads/", first: 100) {
                ...RefConnectionParts
              }
              tags: refs(refPrefix: "refs/tags/", first: 100) {
                ...RefConnectionParts
              }
            }
          }
        }
      }
      
      fragment RefConnectionParts on RefConnection {
        nodes {
          name
          target {
            ... on Commit {
              tree {
                entries {
                  name
                }
              }
            }
          }
        }
      }
      
      fragment ConfigParts on GitObject {
        ... on Blob {
          text
        }
      }
      `,
      {
        searchQuery: `org:${this.organizationName} openapi in:name`
      }
    )
    return response.search.results.map((searchResult: SearchResult) => {
      return this.mapProject(searchResult)
    })
    .filter((project: Project) => {
      return project.versions.length > 0
    })
    .sort((a: Project, b: Project) => {
      return a.name.localeCompare(b.name)
    })
  }
  
  private mapProject(searchResult: SearchResult): Project {
    const config = this.getConfig(searchResult)
    let imageURL: string | undefined
    if (config && config.image) {
      imageURL = this.getGitHubBlobURL(
        searchResult.owner.login,
        searchResult.name,
        config.image,
        searchResult.defaultBranchRef.name
      )
    }
    const defaultName = searchResult.name.replace(/-openapi$/, "")
    return {
      id: defaultName,
      name: defaultName,
      displayName: config?.name || defaultName,
      versions: this.getVersions(searchResult).filter(version => {
        return version.specifications.length > 0
      }),
      imageURL: imageURL
    }
  }
  
  private getConfig(searchResult: SearchResult): IProjectConfig | null {
    const yml = searchResult.configYml || searchResult.configYaml
    if (!yml || !yml.text || yml.text.length == 0) {
      return null
    }
    const parser = new ProjectConfigParser()
    return parser.parse(yml.text)
  }
  
  private getVersions(searchResult: SearchResult): Version[] {
    const branchVersions = searchResult.branches.nodes.map((ref: Ref) => {
      const isDefaultRef = ref.name == searchResult.defaultBranchRef.name
      return this.mapVersionFromRef(searchResult.owner.login, searchResult.name, ref, isDefaultRef)
    })
    const tagVersions = searchResult.tags.nodes.map((ref: Ref) => {
      return this.mapVersionFromRef(searchResult.owner.login, searchResult.name, ref)
    })
    const defaultBranchName = searchResult.defaultBranchRef.name
    const candidateDefaultBranches = [
      defaultBranchName, "main", "master", "develop", "development"
    ]
    // Reverse them so the top-priority branches end up at the top of the list.
    .reverse()
    const allVersions = branchVersions.concat(tagVersions).sort((a: Version, b: Version) => {
      return a.name.localeCompare(b.name)
    })
    // Move the top-priority branches to the top of the list.
    for (const candidateDefaultBranch of candidateDefaultBranches) {
      const defaultBranchIndex = allVersions.findIndex((version: Version) => {
        return version.name === candidateDefaultBranch
      })
      if (defaultBranchIndex !== -1) {
        const branchVersion = allVersions[defaultBranchIndex]
        allVersions.splice(defaultBranchIndex, 1)
        allVersions.splice(0, 0, branchVersion)
      }
    }
    return allVersions
  }
  
  private mapVersionFromRef(
    owner: string,
    repository: string,
    ref: Ref,
    isDefaultRef: boolean = false
  ): Version {
    const specifications = ref.target.tree.entries.filter(file => {
      return this.isOpenAPISpecification(file.name)
    }).map(file => {
      return {
        id: file.name,
        name: file.name,
        url: this.getGitHubBlobURL(
          owner,
          repository,
          file.name,
          ref.name
        ),
        editURL: `https://github.com/${owner}/${repository}/edit/${ref.name}/${file.name}`
      }
    })
    return {
      id: ref.name,
      name: ref.name,
      specifications: specifications,
      url: `https://github.com/${owner}/${repository}/tree/${ref.name}`,
      isDefault: isDefaultRef
    }
  }

  private isOpenAPISpecification(filename: string) {
    return !filename.startsWith(".") && (
      filename.endsWith(".yml") || filename.endsWith(".yaml")
    )
  }
  
  private getGitHubBlobURL(owner: string, repository: string, path: string, ref: string): string {
    return `/api/github/blob/${owner}/${repository}/${path}?ref=${ref}`
  }
}