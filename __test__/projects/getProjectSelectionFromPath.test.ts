import { getProjectSelectionFromPath } from "@/features/projects/domain"

test("It selects the first project when there is only one project and path is empty", () => {
  const sut = getProjectSelectionFromPath({
    path: "",
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
      }],
      owner: "acme",
      ownerUrl: "https://example.com/acme"
    }]
  })
  expect(sut.project!.owner).toEqual("acme")
  expect(sut.project!.name).toEqual("foo")
  expect(sut.version!.id).toEqual("bar")
  expect(sut.specification!.id).toEqual("hello")
})

test("It selects the first version and specification of the specified project", () => {
  const sut = getProjectSelectionFromPath({
    path: "/acme/bar",
    projects: [{
      id: "foo",
      name: "foo",
      displayName: "foo",
      versions: [],
      owner: "acme",
      ownerUrl: "https://example.com/acme"
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
      }],
      owner: "acme",
      ownerUrl: "https://example.com/acme"
    }]
  })
  expect(sut.project!.owner).toEqual("acme")
  expect(sut.project!.name).toEqual("bar")
  expect(sut.version!.id).toEqual("baz1")
  expect(sut.specification!.id).toEqual("hello1")
})

test("It selects the first specification of the specified project and version", () => {
  const sut = getProjectSelectionFromPath({
    path: "/acme/bar/baz2",
    projects: [{
      id: "foo",
      name: "foo",
      displayName: "foo",
      versions: [],
      owner: "acme",
      ownerUrl: "https://example.com/acme"
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
      }],
      owner: "acme",
      ownerUrl: "https://example.com/acme"
    }]
  })
  expect(sut.project!.owner).toEqual("acme")
  expect(sut.project!.name).toEqual("bar")
  expect(sut.version!.id).toEqual("baz2")
  expect(sut.specification!.id).toEqual("hello1")
})

test("It selects the specification of the specified version", () => {
  const sut = getProjectSelectionFromPath({
    path: "/acme/bar/baz2",
    projects: [{
      id: "foo",
      name: "foo",
      displayName: "foo",
      versions: [],
      owner: "acme",
      ownerUrl: "https://example.com/acme"
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
      }],
      owner: "acme",
      ownerUrl: "https://example.com/acme"
    }]
  })
  expect(sut.project!.owner).toEqual("acme")
  expect(sut.project!.name).toEqual("bar")
  expect(sut.version!.id).toEqual("baz2")
  expect(sut.specification!.id).toEqual("hello1")
})

test("It selects the specified project, version, and specification", () => {
  const sut = getProjectSelectionFromPath({
    path: "/acme/bar/baz2/hello2",
    projects: [{
      id: "foo",
      name: "foo",
      displayName: "foo",
      versions: [],
      owner: "acme",
      ownerUrl: "https://example.com/acme"
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
      }],
      owner: "acme",
      ownerUrl: "https://example.com/acme"
    }]
  })
  expect(sut.project!.owner).toEqual("acme")
  expect(sut.project!.name).toEqual("bar")
  expect(sut.version!.id).toEqual("baz2")
  expect(sut.specification!.id).toEqual("hello2")
})

test("It returns a undefined project, version, and specification when the selected project cannot be found", () => {
  const sut = getProjectSelectionFromPath({
    path: "/acme/foo",
    projects: [{
      id: "bar",
      name: "bar",
      displayName: "bar",
      versions: [],
      owner: "acme",
      ownerUrl: "https://example.com/acme"
    }]
  })
  expect(sut.project).toBeUndefined()
  expect(sut.version).toBeUndefined()
  expect(sut.specification).toBeUndefined()
})

test("It returns a undefined version and specification when the selected version cannot be found", () => {
  const sut = getProjectSelectionFromPath({
    path: "/acme/foo/bar",
    projects: [{
      id: "foo",
      name: "foo",
      displayName: "foo",
      versions: [{
        id: "baz",
        name: "baz",
        isDefault: false,
        specifications: []
      }],
      owner: "acme",
      ownerUrl: "https://example.com/acme"
    }]
  })
  expect(sut.project!.owner).toEqual("acme")
  expect(sut.project!.name).toEqual("foo")
  expect(sut.version).toBeUndefined()
  expect(sut.specification).toBeUndefined()
})

test("It returns a undefined specification when the selected specification cannot be found", () => {
  const sut = getProjectSelectionFromPath({
    path: "/acme/foo/bar/baz",
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
      }],
      owner: "acme",
      ownerUrl: "https://example.com/acme"
    }]
  })
  expect(sut.project!.owner).toEqual("acme")
  expect(sut.project!.name).toEqual("foo")
  expect(sut.version!.id).toEqual("bar")
  expect(sut.specification).toBeUndefined()
})

test("It moves specification ID to version ID if needed", () => {
  const sut = getProjectSelectionFromPath({
    path: "/acme/foo/bar/baz",
    projects: [{
      id: "foo",
      name: "foo",
      displayName: "foo",
      versions: [{
        id: "bar/baz",
        name: "bar",
        isDefault: false,
        specifications: [{
          id: "hello",
          name: "hello.yml",
          url: "https://example.com/hello.yml"
        }]
      }],
      owner: "acme",
      ownerUrl: "https://example.com/acme"
    }]
  })
  expect(sut.project!.owner).toEqual("acme")
  expect(sut.project!.name).toEqual("foo")
  expect(sut.version!.id).toEqual("bar/baz")
  expect(sut.specification!.id).toEqual("hello")
})