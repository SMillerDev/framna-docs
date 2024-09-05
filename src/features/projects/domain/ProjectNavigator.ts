import * as NProgress from "nprogress"
import Project from "./Project"

interface IPathnameReader {
  readonly pathname: string
}

export interface IRouter {
  push(path: string): void
  replace(path: string): void
}

export default class ProjectNavigator {
  private readonly pathnameReader: IPathnameReader
  private readonly router: IRouter
  
  constructor(config: { pathnameReader: IPathnameReader, router: IRouter }) {
    this.pathnameReader = config.pathnameReader
    this.router = config.router
  }
  
  navigateToVersion(
    project: Project,
    versionId: string,
    preferredSpecificationName: string
  ) {
    // Let's see if we can find a specification with the same name.
    const newVersion = project.versions.find(e => {
      return e.id == versionId
    })
    if (!newVersion) {
      return
    }
    const candidateSpecification = newVersion.specifications.find(e => {
      return e.name == preferredSpecificationName
    })
    NProgress.start()
    if (candidateSpecification) {
      this.router.push(`/${project.owner}/${project.name}/${newVersion.id}/${candidateSpecification.id}`)
    } else {
      const firstSpecification = newVersion.specifications[0]
      this.router.push(`/${project.owner}/${project.name}/${newVersion.id}/${firstSpecification.id}`)
    }
  }
  
  navigate(
    projectOwner: string,
    projectName: string,
    versionId: string,
    specificationId: string
  ) {
    NProgress.start()
    this.router.push(`/${projectOwner}/${projectName}/${versionId}/${specificationId}`)
  }
  
  navigateIfNeeded(selection: {
    projectOwner?: string
    projectName?: string
    versionId?: string
    specificationId?: string
  }) {
    if (!selection.projectOwner || !selection.projectName || !selection.versionId || !selection.specificationId) {
      return
    }
    const path = `/${selection.projectOwner}/${selection.projectName}/${selection.versionId}/${selection.specificationId}`
    if (path !== this.pathnameReader.pathname) {
      this.router.replace(path)
    }
  }
}
