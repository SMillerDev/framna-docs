import {
  GitHubProjectDataSource
 } from "../../src/features/projects/data"

test("It loads repositories from data source", async () => {
  let didLoadRepositories = false
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        didLoadRepositories = true
        return []
      }
    }
  })
  await sut.getProjects()
  expect(didLoadRepositories).toBeTruthy()
})

test("It maps projects including branches and tags", async () => {
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "foo",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "main",
            target: {
              oid: "12345678"
            }
          },
          branches: {
            edges: [{
              node: {
                name: "main",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          },
          tags: {
            edges: [{
              node: {
                name: "1.0",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  expect(projects).toEqual([{
    id: "foo",
    name: "foo",
    displayName: "foo",
    url: "https://github.com/acme/foo",
    versions: [{
      id: "main",
      name: "main",
      specifications: [{
        id: "openapi.yml",
        name: "openapi.yml",
        url: "/api/blob/acme/foo/openapi.yml?ref=12345678",
        editURL: "https://github.com/acme/foo/edit/main/openapi.yml"
      }],
      url: "https://github.com/acme/foo/tree/main",
      isDefault: true
    }, {
      id: "1.0",
      name: "1.0",
      specifications: [{
        id: "openapi.yml",
        name: "openapi.yml",
        url: "/api/blob/acme/foo/openapi.yml?ref=12345678",
        editURL: "https://github.com/acme/foo/edit/1.0/openapi.yml"
      }],
      url: "https://github.com/acme/foo/tree/1.0",
      isDefault: false
    }]
  }])
})

test("It removes \"-openapi\" suffix from project name", async () => {
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "foo-openapi",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "main",
            target: {
              oid: "12345678"
            }
          },
          branches: {
            edges: [{
              node: {
                name: "main",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          },
          tags: {
            edges: [{
              node: {
                name: "1.0",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  expect(projects[0].id).toEqual("foo")
  expect(projects[0].name).toEqual("foo")
  expect(projects[0].displayName).toEqual("foo")
})

test("It supports multiple OpenAPI specifications on a branch", async () => {
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "foo",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "main",
            target: {
              oid: "12345678"
            }
          },
          branches: {
            edges: [{
              node: {
                name: "main",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "foo-service.yml"
                    }, {
                      name: "bar-service.yml"
                    }, {
                      name: "baz-service.yml"
                    }]
                  }
                }
              }
            }]
          },
          tags: {
            edges: [{
              node: {
                name: "1.0",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  expect(projects).toEqual([{
    id: "foo",
    name: "foo",
    displayName: "foo",
    url: "https://github.com/acme/foo",
    versions: [{
      id: "main",
      name: "main",
      specifications: [{
        id: "foo-service.yml",
        name: "foo-service.yml",
        url: "/api/blob/acme/foo/foo-service.yml?ref=12345678",
        editURL: "https://github.com/acme/foo/edit/main/foo-service.yml"
      }, {
        id: "bar-service.yml",
        name: "bar-service.yml",
        url: "/api/blob/acme/foo/bar-service.yml?ref=12345678",
        editURL: "https://github.com/acme/foo/edit/main/bar-service.yml"
      }, {
        id: "baz-service.yml",
        name: "baz-service.yml",
        url: "/api/blob/acme/foo/baz-service.yml?ref=12345678",
        editURL: "https://github.com/acme/foo/edit/main/baz-service.yml"
      }],
      url: "https://github.com/acme/foo/tree/main",
      isDefault: true
    }, {
      id: "1.0",
      name: "1.0",
      specifications: [{
        id: "openapi.yml",
        name: "openapi.yml",
        url: "/api/blob/acme/foo/openapi.yml?ref=12345678",
        editURL: "https://github.com/acme/foo/edit/1.0/openapi.yml"
      }],
      url: "https://github.com/acme/foo/tree/1.0",
      isDefault: false
    }]
  }])
})

test("It removes \"-openapi\" suffix from project name", async () => {
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "foo-openapi",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "main",
            target: {
              oid: "12345678"
            }
          },
          branches: {
            edges: [{
              node: {
                name: "main",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          },
          tags: {
            edges: [{
              node: {
                name: "1.0",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  expect(projects[0].id).toEqual("foo")
  expect(projects[0].name).toEqual("foo")
  expect(projects[0].displayName).toEqual("foo")
})

test("It filters away projects with no versions", async () => {
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "foo",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "main",
            target: {
              oid: "12345678"
            }
          },
          branches: {
            edges: []
          },
          tags: {
            edges: []
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  expect(projects.length).toEqual(0)
})

test("It filters away branches with no specifications", async () => {
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "foo-openapi",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "main",
            target: {
              oid: "12345678"
            }
          },
          branches: {
            edges: [{
              node: {
                name: "main",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }, {
              node: {
                name: "bugfix",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "foo.txt"
                    }]
                  }
                }
              }
            }]
          },
          tags: {
            edges: []
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  expect(projects[0].versions.length).toEqual(1)
})

test("It filters away tags with no specifications", async () => {
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "foo-openapi",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "main",
            target: {
              oid: "12345678"
            }
          },
          branches: {
            edges: [{
              node: {
                name: "main",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          },
          tags: {
            edges: [{
              node: {
                name: "1.0",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }, {
              node: {
                name: "1.1",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "foo.txt"
                    }]
                  }
                }
              }
            }]
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  expect(projects[0].versions.length).toEqual(2)
})

test("It reads image from .shape-config.yml", async () => {
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "foo-openapi",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "main",
            target: {
              oid: "12345678"
            }
          },
          configYml: {
            text: "image: icon.png"
          },
          branches: {
            edges: [{
              node: {
                name: "main",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          },
          tags: {
            edges: []
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  expect(projects[0].imageURL).toEqual("/api/blob/acme/foo-openapi/icon.png?ref=12345678")
})

test("It filters away tags with no specifications", async () => {
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "foo-openapi",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "main",
            target: {
              oid: "12345678"
            }
          },
          branches: {
            edges: [{
              node: {
                name: "main",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          },
          tags: {
            edges: [{
              node: {
                name: "1.0",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }, {
              node: {
                name: "1.1",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "foo.txt"
                    }]
                  }
                }
              }
            }]
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  expect(projects[0].versions.length).toEqual(2)
})

test("It reads display name from .shape-config.yml", async () => {
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "foo-openapi",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "main",
            target: {
              oid: "12345678"
            }
          },
          configYml: {
            text: "name: Hello World"
          },
          branches: {
            edges: [{
              node: {
                name: "main",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          },
          tags: {
            edges: []
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  expect(projects[0].id).toEqual("foo")
  expect(projects[0].name).toEqual("foo")
  expect(projects[0].displayName).toEqual("Hello World")
})

test("It reads image from .shape-config.yml", async () => {
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "foo-openapi",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "main",
            target: {
              oid: "12345678"
            }
          },
          configYml: {
            text: "image: icon.png"
          },
          branches: {
            edges: [{
              node: {
                name: "main",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          },
          tags: {
            edges: []
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  expect(projects[0].imageURL).toEqual("/api/blob/acme/foo-openapi/icon.png?ref=12345678")
})

test("It reads display name from .shape-config.yaml", async () => {
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "foo-openapi",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "main",
            target: {
              oid: "12345678"
            }
          },
          configYaml: {
            text: "name: Hello World"
          },
          branches: {
            edges: [{
              node: {
                name: "main",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          },
          tags: {
            edges: []
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  expect(projects[0].id).toEqual("foo")
  expect(projects[0].name).toEqual("foo")
  expect(projects[0].displayName).toEqual("Hello World")
})

test("It reads image from .shape-config.yaml", async () => {
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "foo-openapi",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "main",
            target: {
              oid: "12345678"
            }
          },
          configYaml: {
            text: "image: icon.png"
          },
          branches: {
            edges: [{
              node: {
                name: "main",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          },
          tags: {
            edges: []
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  expect(projects[0].imageURL).toEqual("/api/blob/acme/foo-openapi/icon.png?ref=12345678")
})

test("It sorts projects alphabetically", async () => {
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "cathrine",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "main",
            target: {
              oid: "12345678"
            }
          },
          branches: {
            edges: [{
              node: {
                name: "main",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          },
          tags: {
            edges: []
          }
        }, {
          name: "anne",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "main",
            target: {
              oid: "12345678"
            }
          },
          branches: {
            edges: [{
              node: {
                name: "main",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          },
          tags: {
            edges: []
          }
        }, {
          name: "bobby",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "main",
            target: {
              oid: "12345678"
            }
          },
          branches: {
            edges: [{
              node: {
                name: "main",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          },
          tags: {
            edges: []
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  expect(projects[0].name).toEqual("anne")
  expect(projects[1].name).toEqual("bobby")
  expect(projects[2].name).toEqual("cathrine")
})

test("It sorts versions alphabetically", async () => {
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "foo",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "main",
            target: {
              oid: "12345678"
            }
          },
          branches: {
            edges: [{
              node: {
                name: "bobby",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }, {
              node: {
                name: "anne",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          },
          tags: {
            edges: [{
              node: {
                name: "1.0",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }, {
              node: {
                name: "cathrine",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  expect(projects[0].versions[0].name).toEqual("1.0")
  expect(projects[0].versions[1].name).toEqual("anne")
  expect(projects[0].versions[2].name).toEqual("bobby")
  expect(projects[0].versions[3].name).toEqual("cathrine")
})

test("It prioritizes main, master, develop, and development branch names when sorting verisons", async () => {
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "foo",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "main",
            target: {
              oid: "12345678"
            }
          },
          branches: {
            edges: [{
              node: {
                name: "anne",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }, {
              node: {
                name: "develop",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }, {
              node: {
                name: "main",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }, {
              node: {
                name: "development",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }, {
              node: {
                name: "master",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          },
          tags: {
            edges: [{
              node: {
                name: "1.0",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  expect(projects[0].versions[0].name).toEqual("main")
  expect(projects[0].versions[1].name).toEqual("master")
  expect(projects[0].versions[2].name).toEqual("develop")
  expect(projects[0].versions[3].name).toEqual("development")
  expect(projects[0].versions[4].name).toEqual("1.0")
  expect(projects[0].versions[5].name).toEqual("anne")
})

test("It identifies the default branch in returned versions", async () => {
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "foo",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "development",
            target: {
              oid: "12345678"
            }
          },
          branches: {
            edges: [{
              node: {
                name: "anne",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }, {
              node: {
                name: "main",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }, {
              node: {
                name: "development",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          },
          tags: {
            edges: []
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  const defaultVersionNames = projects[0]
    .versions
    .filter(e => e.isDefault)
    .map(e => e.name)
  expect(defaultVersionNames).toEqual(["development"])
})

test("It adds remote versions from the project configuration", async () => {
  const rawProjectConfig = `
  remoteVersions:
    - name: Anne
      specifications:
      - name: Huey
        url: https://example.com/huey.yml
      - name: Dewey
        url: https://example.com/dewey.yml
    - name: Bobby
      specifications:
      - name: Louie
        url: https://example.com/louie.yml
  `
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "foo",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "main",
            target: {
              oid: "12345678"
            }
          },
          configYml: {
            text: rawProjectConfig
          },
          branches: {
            edges: []
          },
          tags: {
            edges: []
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  expect(projects[0].versions).toEqual([{
    id: "anne",
    name: "Anne",
    isDefault: false,
    specifications: [{
      id: "huey",
      name: "Huey",
      url: `/api/proxy?url=${encodeURIComponent("https://example.com/huey.yml")}`
    }, {
      id: "dewey",
      name: "Dewey",
      url: `/api/proxy?url=${encodeURIComponent("https://example.com/dewey.yml")}`
    }]
  }, {
    id: "bobby",
    name: "Bobby",
    isDefault: false,
    specifications: [{
      id: "louie",
      name: "Louie",
      url: `/api/proxy?url=${encodeURIComponent("https://example.com/louie.yml")}`
    }]
  }])
})

test("It modifies ID of remote version if the ID already exists", async () => {
  const rawProjectConfig = `
  remoteVersions:
    - name: Bar
      specifications:
      - name: Baz
        url: https://example.com/baz.yml
    - name: Bar
      specifications:
      - name: Hello
        url: https://example.com/hello.yml
  `
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "foo",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "bar",
            target: {
              oid: "12345678"
            }
          },
          configYml: {
            text: rawProjectConfig
          },
          branches: {
            edges: [{
              node: {
                name: "bar",
                target: {
                  oid: "12345678",
                  tree: {
                    entries: [{
                      name: "openapi.yml"
                    }]
                  }
                }
              }
            }]
          },
          tags: {
            edges: []
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  expect(projects[0].versions).toEqual([{
    id: "bar",
    name: "bar",
    url: "https://github.com/acme/foo/tree/bar",
    isDefault: true,
    specifications: [{
      id: "openapi.yml",
      name: "openapi.yml",
      url: "/api/blob/acme/foo/openapi.yml?ref=12345678",
      editURL: "https://github.com/acme/foo/edit/bar/openapi.yml"
    }]
  }, {
    id: "bar1",
    name: "Bar",
    isDefault: false,
    specifications: [{
      id: "baz",
      name: "Baz",
      url: `/api/proxy?url=${encodeURIComponent("https://example.com/baz.yml")}`
    }]
  }, {
    id: "bar2",
    name: "Bar",
    isDefault: false,
    specifications: [{
      id: "hello",
      name: "Hello",
      url: `/api/proxy?url=${encodeURIComponent("https://example.com/hello.yml")}`
    }]
  }])
})

test("It lets users specify the ID of a remote version", async () => {
  const rawProjectConfig = `
  remoteVersions:
    - id: some-version
      name: Bar
      specifications:
      - name: Baz
        url: https://example.com/baz.yml
  `
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "foo",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "bar",
            target: {
              oid: "12345678"
            }
          },
          configYml: {
            text: rawProjectConfig
          },
          branches: {
            edges: []
          },
          tags: {
            edges: []
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  expect(projects[0].versions).toEqual([{
    id: "some-version",
    name: "Bar",
    isDefault: false,
    specifications: [{
      id: "baz",
      name: "Baz",
      url: `/api/proxy?url=${encodeURIComponent("https://example.com/baz.yml")}`
    }]
  }])
})

test("It lets users specify the ID of a remote specification", async () => {
  const rawProjectConfig = `
  remoteVersions:
    - name: Bar
      specifications:
      - id: some-spec
        name: Baz
        url: https://example.com/baz.yml
  `
  const sut = new GitHubProjectDataSource({
    dataSource: {
      async getRepositories() {
        return [{
          name: "foo",
          owner: {
            login: "acme"
          },
          defaultBranchRef: {
            name: "bar",
            target: {
              oid: "12345678"
            }
          },
          configYml: {
            text: rawProjectConfig
          },
          branches: {
            edges: []
          },
          tags: {
            edges: []
          }
        }]
      }
    }
  })
  const projects = await sut.getProjects()
  expect(projects[0].versions).toEqual([{
    id: "bar",
    name: "Bar",
    isDefault: false,
    specifications: [{
      id: "some-spec",
      name: "Baz",
      url: `/api/proxy?url=${encodeURIComponent("https://example.com/baz.yml")}`
    }]
  }])
})