import {createFcl} from "@onflow/fcl"
import {tx as realTx} from "@onflow/fcl"
import {authenticatedUser, defaultUser} from "./user"

const sharedSubscribe = jest.fn(callback => {
  callback({
    "accessNode.api": "http://localhost:8080",
    "app.detail.title": "Test App",
  })
  return () => {}
})

let currentUserState = defaultUser

export const createMockFclInstance = () => {
  let mockTxResponse = {
    snapshot: jest.fn(),
    subscribe: jest.fn(),
    onceFinalized: jest.fn(),
    onceExecuted: jest.fn(),
    onceSealed: jest.fn(),
  }
  const mockTx = Object.assign(jest.fn().mockReturnValue(mockTxResponse), {
    isUnknown: jest.fn().mockImplementation(realTx.isUnknown),
    isPending: jest.fn().mockImplementation(realTx.isPending),
    isFinalized: jest.fn().mockImplementation(realTx.isFinalized),
    isExecuted: jest.fn().mockImplementation(realTx.isExecuted),
    isSealed: jest.fn().mockImplementation(realTx.isSealed),
    isExpired: jest.fn().mockImplementation(realTx.isExpired),
  })

  const mockCurrentUser = {
    subscribe: jest.fn().mockImplementation((callback: any) => {
      callback(currentUserState)
      return () => {}
    }),
    snapshot: async () => currentUserState,
    authenticate: jest.fn().mockImplementation(() => {
      currentUserState = authenticatedUser
      return Promise.resolve(authenticatedUser)
    }),
    unauthenticate: jest.fn().mockImplementation(() => {
      currentUserState = defaultUser
    }),
    authorization: jest.fn(),
    signUserMessage: jest.fn().mockImplementation(() => {
      return Promise.resolve("signedMessage")
    }),
    resolveArgument: jest.fn(),
  }

  const mockFclInstance: jest.Mocked<ReturnType<typeof createFcl>> = {
    account: jest.fn(),
    block: jest.fn(),
    events: jest.fn(),
    mutate: jest.fn(),
    query: jest.fn(),
    queryRaw: jest.fn(),
    tx: mockTx,
    send: jest.fn().mockImplementation(args => {
      // The real FCL returns an object that allows chaining with .then(fcl.decode)
      return {
        then: (callback: (value: any) => any) => callback({}),
      }
    }),
    decode: jest.fn().mockImplementation(result => {
      return result
    }),

    currentUser: mockCurrentUser,
    authenticate: jest.fn().mockImplementation(() => {
      currentUserState = authenticatedUser
      return Promise.resolve(authenticatedUser)
    }),
    unauthenticate: jest.fn().mockImplementation(() => {
      currentUserState = defaultUser
    }),
    getChainId: jest.fn().mockResolvedValue("mainnet"),
    subscribe: jest.fn(),
    subscribeRaw: jest.fn(),
    resolve: jest.fn(),
    config: jest.fn().mockReturnValue({
      subscribe: sharedSubscribe,
      snapshot: () => ({
        "accessNode.api": "http://localhost:8080",
        "app.detail.title": "Test App",
      }),
    }) as any,
    verifyUserSignatures: jest
      .fn()
      .mockRejectedValue(new Error("Not implemented")),
    signUserMessage: mockCurrentUser.signUserMessage,
    serialize: jest.fn(),
  }

  return {
    mockFclInstance,
    mockTx,
  }
}

export type MockFclInstance = ReturnType<typeof createMockFclInstance>
