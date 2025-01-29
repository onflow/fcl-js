import * as fcl from "@onflow/fcl"

export function mockUser(): jest.Mocked<typeof fcl.currentUser> {
  const currentUser = {
    authenticate: jest.fn(),
    unauthenticate: jest.fn(),
    authorization: jest.fn(),
    signUserMessage: jest.fn(),
    subscribe: jest.fn(),
    snapshot: jest.fn(),
    resolveArgument: jest.fn(),
  }

  return Object.assign(
    () => {
      return {...currentUser}
    },
    {...currentUser}
  )
}

export function mockConfig(): jest.Mocked<typeof fcl.config> {
  const config = {
    put: jest.fn(),
    get: jest.fn(),
    all: jest.fn(),
    first: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    where: jest.fn(),
    subscribe: jest.fn(),
    overload: jest.fn(),
    load: jest.fn(),
  }

  return Object.assign(
    () => {
      return {...config}
    },
    {...config}
  )
}
