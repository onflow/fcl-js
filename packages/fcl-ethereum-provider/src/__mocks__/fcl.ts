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
