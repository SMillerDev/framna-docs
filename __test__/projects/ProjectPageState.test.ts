import {
  getProjectPageState,
  ProjectPageState
} from "../../src/features/projects/domain/ProjectPageState"

test("It enters the loading state", async () => {
  const sut = getProjectPageState({ isLoading: true })
  expect(sut.state).toEqual(ProjectPageState.LOADING)
})

test("It enters the error state", async () => {
  const sut = getProjectPageState({
    isLoading: false,
    error: new Error("foo")
  })
  expect(sut.state).toEqual(ProjectPageState.ERROR)
  expect(sut.error).toEqual(new Error("foo"))
})

test("It gracefully errors when no project has been selected", async () => {
  const sut = getProjectPageState({
    projects: [{
      id: "foo",
      name: "foo",
      displayName: "foo",
      versions: []
    }, {
      id: "bar",
      name: "bar",
      displayName: "bar",
      versions: []
    }]
  })
  expect(sut.state).toEqual(ProjectPageState.NO_PROJECT_SELECTED)
})

test("It selects the first version and specification of the specified project", async () => {
  const sut = getProjectPageState({
    selectedProjectId: "bar",
    projects: [{
      id: "foo",
      name: "foo",
      displayName: "foo",
      versions: []
    }, {
      id: "bar",
      name: "bar",
      displayName: "bar",
      versions: [{
        id: "baz1",
        name: "baz1",
        isDefault: false,
        specifications: [{
          id: "hello1",
          name: "hello1.yml",
          url: "https://example.com/hello.yml"
        }, {
          id: "hello2",
          name: "hello2.yml",
          url: "https://example.com/hello.yml"
        }]
      }, {
        id: "baz2",
        name: "baz2",
        isDefault: false,
        specifications: []
      }]
    }]
  })
  expect(sut.state).toEqual(ProjectPageState.HAS_SELECTION)
  expect(sut.selection!.project.id).toEqual("bar")
  expect(sut.selection!.version.id).toEqual("baz1")
  expect(sut.selection!.specification.id).toEqual("hello1")
})

test("It selects the first specification of the specified project and version", async () => {
  const sut = getProjectPageState({
    selectedProjectId: "bar",
    selectedVersionId: "baz2",
    projects: [{
      id: "foo",
      name: "foo",
      displayName: "foo",
      versions: []
    }, {
      id: "bar",
      name: "bar",
      displayName: "bar",
      versions: [{
        id: "baz1",
        name: "baz1",
        isDefault: false,
        specifications: []
      }, {
        id: "baz2",
        name: "baz2",
        isDefault: false,
        specifications: [{
          id: "hello1",
          name: "hello1.yml",
          url: "https://example.com/hello.yml"
        }]
      }]
    }]
  })
  expect(sut.state).toEqual(ProjectPageState.HAS_SELECTION)
  expect(sut.selection!.project.id).toEqual("bar")
  expect(sut.selection!.version.id).toEqual("baz2")
  expect(sut.selection!.specification.id).toEqual("hello1")
})

test("It selects the specification of the specified version", async () => {
  const sut = getProjectPageState({
    selectedProjectId: "bar",
    selectedVersionId: "baz2",
    projects: [{
      id: "foo",
      name: "foo",
      displayName: "foo",
      versions: []
    }, {
      id: "bar",
      name: "bar",
      displayName: "bar",
      versions: [{
        id: "baz1",
        name: "baz1",
        isDefault: false,
        specifications: []
      }, {
        id: "baz2",
        name: "baz2",
        isDefault: false,
        specifications: [{
          id: "hello1",
          name: "hello1.yml",
          url: "https://example.com/hello.yml"
        }, {
          id: "hello2",
          name: "hello2.yml",
          url: "https://example.com/hello.yml"
        }]
      }]
    }]
  })
  expect(sut.state).toEqual(ProjectPageState.HAS_SELECTION)
  expect(sut.selection!.project.id).toEqual("bar")
  expect(sut.selection!.version.id).toEqual("baz2")
  expect(sut.selection!.specification.id).toEqual("hello1")
})

test("It selects the specified project, version, and specification", async () => {
  const sut = getProjectPageState({
    selectedProjectId: "bar",
    selectedVersionId: "baz2",
    selectedSpecificationId: "hello2",
    projects: [{
      id: "foo",
      name: "foo",
      displayName: "foo",
      versions: []
    }, {
      id: "bar",
      name: "bar",
      displayName: "bar",
      versions: [{
        id: "baz1",
        name: "baz1",
        isDefault: false,
        specifications: []
      }, {
        id: "baz2",
        name: "baz2",
        isDefault: false,
        specifications: [{
          id: "hello1",
          name: "hello1.yml",
          url: "https://example.com/hello.yml"
        }, {
          id: "hello2",
          name: "hello2.yml",
          url: "https://example.com/hello.yml"
        }]
      }]
    }]
  })
  expect(sut.state).toEqual(ProjectPageState.HAS_SELECTION)
  expect(sut.selection!.project.id).toEqual("bar")
  expect(sut.selection!.version.id).toEqual("baz2")
  expect(sut.selection!.specification.id).toEqual("hello2")
})

test("It errors when the selected project cannot be found", async () => {
  const sut = getProjectPageState({
    selectedProjectId: "foo",
    projects: [{
      id: "bar",
      name: "bar",
      displayName: "bar",
      versions: []
    }]
  })
  expect(sut.state).toEqual(ProjectPageState.PROJECT_NOT_FOUND)
})

test("It errors when the selected version cannot be found", async () => {
  const sut = getProjectPageState({
    selectedProjectId: "foo",
    selectedVersionId: "bar",
    projects: [{
      id: "foo",
      name: "foo",
      displayName: "foo",
      versions: [{
        id: "baz",
        name: "baz",
        isDefault: false,
        specifications: []
      }]
    }]
  })
  expect(sut.state).toEqual(ProjectPageState.VERSION_NOT_FOUND)
})

test("It errors when the selected specification cannot be found", async () => {
  const sut = getProjectPageState({
    selectedProjectId: "foo",
    selectedVersionId: "bar",
    selectedSpecificationId: "baz",
    projects: [{
      id: "foo",
      name: "foo",
      displayName: "foo",
      versions: [{
        id: "bar",
        name: "bar",
        isDefault: false,
        specifications: [{
          id: "hello",
          name: "hello.yml",
          url: "https://example.com/hello.yml"
        }]
      }]
    }]
  })
  expect(sut.state).toEqual(ProjectPageState.SPECIFICATION_NOT_FOUND)
})

test("It errors when the selected project has no versions", async () => {
  const sut = getProjectPageState({
    selectedProjectId: "foo",
    projects: [{
      id: "foo",
      name: "foo",
      displayName: "foo",
      versions: []
    }]
  })
  expect(sut.state).toEqual(ProjectPageState.VERSION_NOT_FOUND)
})

test("It errors when the selected version has no specifications", async () => {
  const sut = getProjectPageState({
    selectedProjectId: "foo",
    selectedVersionId: "bar",
    projects: [{
      id: "foo",
      name: "foo",
      displayName: "foo",
      versions: [{
        id: "bar",
        name: "bar",
        isDefault: false,
        specifications: []
      }]
    }]
  })
  expect(sut.state).toEqual(ProjectPageState.SPECIFICATION_NOT_FOUND)
})

