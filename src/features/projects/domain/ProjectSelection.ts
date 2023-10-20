import IProject from "../domain/IProject"
import IVersion from "../domain/IVersion"
import IOpenApiSpecification from "../domain/IOpenApiSpecification"

export enum ProjectSelectionState {
  LOADING,
  ERROR,
  HAS_SELECTION,
  NO_PROJECT_SELECTED,
  PROJECT_NOT_FOUND,
  VERSION_NOT_FOUND,
  SPECIFICATION_NOT_FOUND
}

export type ProjectSelection = {
  readonly state: ProjectSelectionState
  readonly error?: Error
  readonly selection?: {
    readonly project: IProject
    readonly version: IVersion
    readonly specification: IOpenApiSpecification
  }
}

type GetProjectSelectionProps = {
  isLoading?: boolean
  error?: Error
  projects?: IProject[]
  selectedProjectId?: string
  selectedVersionId?: string
  selectedSpecificationId?: string
}

export function getProjectSelection({
  isLoading,
  error,
  projects,
  selectedProjectId,
  selectedVersionId,
  selectedSpecificationId
}: GetProjectSelectionProps): ProjectSelection {
  if (isLoading) {
    return { state: ProjectSelectionState.LOADING }
  }
  if (error) {
    return { state: ProjectSelectionState.ERROR, error }
  }
  if (!selectedProjectId && projects.length == 1) {
    // If no project is selected and the user only has a single project then we select that.
    selectedProjectId = projects[0].id
  }
  if (!selectedProjectId) {
    return { state: ProjectSelectionState.NO_PROJECT_SELECTED }
  }
  const project = projects.find(e => e.id == selectedProjectId)
  if (!project) {
    return { state: ProjectSelectionState.PROJECT_NOT_FOUND }
  }
  // Find selected version or default to first version if none is selected.
  let version: IVersion
  if (selectedVersionId) {
    const selectedVersion = project.versions.find(e => e.id == selectedVersionId)
    if (selectedVersion) {
      version = selectedVersion
    } else {
      return { state: ProjectSelectionState.VERSION_NOT_FOUND }
    }
  } else if (project.versions.length > 0) {
    version = project.versions[0]
  } else {
    return { state: ProjectSelectionState.VERSION_NOT_FOUND }
  }
  // Find selected specification or default to first specification if none is selected.
  let specification: IOpenApiSpecification
  if (selectedSpecificationId) {
    const selectedSpecification = version.specifications.find(e => e.id == selectedSpecificationId)
    if (selectedSpecification) {
      specification = selectedSpecification
    } else {
      return { state: ProjectSelectionState.SPECIFICATION_NOT_FOUND }
    }
  } else if (version.specifications.length > 0) {
    specification = version.specifications[0]
  } else {
    return { state: ProjectSelectionState.SPECIFICATION_NOT_FOUND }
  }
  return {
    state: ProjectSelectionState.HAS_SELECTION,
    selection: { project, version, specification }
  }
}

export default ProjectSelection
